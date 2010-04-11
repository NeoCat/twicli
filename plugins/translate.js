var translateLang = readCookie("lang") || "ja";
function setTranslateLang(lang) {
	translateLang = lang;
	writeCookie("lang", lang, 3652);
	alert("Choose \"translate\" from ▼ to translate tweet into " + lang + ".");
}

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'translate_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼Translate</b></a>' +
			'<form id="translate_pref" style="display:none" onSubmit="setTranslateLang($(\'translateLang\').value); return false;">' +
			'translate language: <input type="text" size="15" id="translateLang" value="'+translateLang+'">' +
			'<input type="image" src="images/go.png"></form>';
		$("pref").appendChild(e);
	},

	popup: function() {
		$('translate_status').href = "javascript:translateStatus('"+popup_ele.id+"')";
	}
});

function translateStatus(id) {
	update_ele2 = loadXDomainScript("http://www.google.com/uds/Gtranslate?v=1.0"+
				"&callback=gTranslate" + "&context=" + id.replace("-","_") +
				"&q=" + encodeURIComponent($(id).tw.text) +
				"&langpair=|"+translateLang, update_ele2);
}
function gTranslate(id, result, code, error, code2) {
	if (code != 200) {
		alert("Translate error " + code + ": " + error);
		return;
	}
	var target = $(id.replace("_","-"));
	if (!target) return;

	rep_top = cumulativeOffset(target)[1] + 20;
	$('reps').innerHTML = result.translatedText;
	$('rep').style.display = "block";
	$('rep').style.top = rep_top;
	user_pick1 = user_pick2 = null;
}

// Popup menu

var a = document.createElement('hr');
$('popup').appendChild(a)

a = document.createElement('a');
a.id = 'translate_status';
a.innerHTML = 'Translate';
$('popup').appendChild(a)
