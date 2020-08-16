langResources['Sound'] =	['音','声音'];
langResources['on TL update'] =	['TL新着音','TL更新提醒'];
langResources['on new Reply'] =	['@新着音','@更新提醒'];

var twsd_html5 = true, twsd_mp3 = true;
try {
	var twsd_audio = new Audio("");
	if (!twsd_audio.canPlayType("audio/mpeg")) twsd_mp3 = false;
} catch(e) {
	twsd_html5 = false;
}
var sound_name = (readCookie('sound_fname') || (twsd_mp3 ? "2.mp3,4.mp3" : "2.ogg,4.ogg")).split(",");
if (twsd_html5 && !twsd_mp3 && sound_name.join(',').indexOf('.mp3') >= 0) twsd_html5 = false;
function setSoundNames(names) {
	sound_name = names;
	writeCookie('sound_fname', names.join(","), 3652);
}

registerPlugin({
	miscTab: function() {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'sound_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼'+_('Sound')+'</b></a>' +
			'<form id="sound_pref" style="display:none" onSubmit="setSoundNames([$(\'sound0\').value,$(\'sound1\').value]); return false;">' +
			_('on TL update')+': <input type="text" size="15" id="sound0" value="'+sound_name[0]+'"><br>' +
			_('on new Reply')+': <input type="text" size="15" id="sound1" value="'+sound_name[1]+'"><br>' +
			'<button type="submit">Apply</button></form>';
		$("pref").appendChild(e);
	},
	noticeUpdate: function(tw, nr) {
		if (nr > 0)
			this.playSound(0);
	},
	noticeNewReply: function() {
		this.playSound(1);
	},
	playSound: function(n) {
		var fname = sound_name[n].replace(/\s+$/,'');
		if (fname == "") return false;
		if (fname.indexOf('/') < 0) fname = "sounds/"+fname;
		var htmlToPlay = twsd_html5 ?
			'<audio id="ply0-'+n+'" autobuffer="autobuffer" src="'+fname+'"></audio>' :
			'<object type="audio/mpeg" data="'+fname+'" id="ply1-'+n+'" width="0" height="0" classid="clsid:6BF52A52-394A-11d3-B153-00C04F79FAA6"><param name="uiMode" value="none"><param name="url" value="'+fname+'"><param name="AutoStart" value="true"><object type="audio/mpeg" data="'+fname+'" id="ply2-'+n+'" width="0" height="0" classid="clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" autoplay="true"><param name="src" value="'+fname+'"><param name="autoplay" value="true"><embed src="'+fname+'" id="ply3-'+n+'" width="0" height="0" autostart="true" autoplay="true"></object></object>';
		var target;
		if (twsd_html5) {
			target = document.getElementById('ply0-'+n);
			if (!target) {
				document.getElementById('plysnd'+n).innerHTML = htmlToPlay;
				target = document.getElementById('ply0-'+n);
			}
			target.play();
			return;
		}
		target = document.getElementById('ply1-'+n) || document.getElementById('ply2-'+n) || document.getElementById('ply3-'+n);
		if (target && typeof(target.Play) == "function")
			target.Play();
		else if (target && typeof(target.controls) == "object")
			target.controls.play();
		else
			document.getElementById('plysnd'+n).innerHTML = htmlToPlay;
	}
});


setTimeout(function(){
	for (var i = 0; i < 2; i++) {
		var ele = document.createElement("div");
		ele.id = 'plysnd'+i;
		document.body.appendChild(ele);
	}
}, 0);
