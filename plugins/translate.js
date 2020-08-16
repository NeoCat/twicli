langResources['Translate'] =	['翻訳','翻译'];
langResources['translate language'] =	['翻訳先の言語','翻译语言'];
langResources['Choose "translate" from ▼ to translate the tweet.'] =	['翻訳するにはツイートの▼メニューから"翻訳"を選んで下さい。','请点击发言中的▼并选择“翻译”进行翻译。'];


var translateLang = readCookie("lang") || "ja";
function setTranslateLang(lang) {
	translateLang = lang;
	writeCookie("lang", lang, 3652);
	alert(_('Choose "translate" from ▼ to translate the tweet.'));
}

registerPlugin({
	miscTab: function() {
		var e = document.createElement("div");
		e.innerHTML = '<a href="javascript:var s = $(\'translate_pref\').style; s.display = s.display==\'block\'?\'none\':\'block\';void(0)"><b>▼'+_('Translate')+'</b></a>' +
			'<form id="translate_pref" style="display:none" onSubmit="setTranslateLang($(\'translateLang\').value); return false;">' +
			_('translate language')+': <input type="text" size="15" id="translateLang" value="'+translateLang+'">' +
			'<button type="submit" class="go"></form>';
		$("pref").appendChild(e);
	},

	popup: function() {
		$('translate_status').href = "javascript:translateStatus('"+popup_ele.id+"')";
	}
});

function translateStatus(id) {
	window.translateTarget = $(id);
	xds.load_for_tab("//api.microsofttranslator.com/V2/Ajax.svc/Translate?"+
				"&appId=73B027BB51D74FB461C097BCCF841DB5678FDBB3" +
				"&text=" + encodeURIComponent(text($(id).tw)) +
				"&to="+translateLang, translateResult, 'oncomplete');
}
function translateResult(result) {
	var target = window.translateTarget;
	if (!target) return;

	rep_top = cumulativeOffset(target)[1] + 20;
	if (document.all)
		$('reps').innerText = result;
	else
		$('reps').textContent = result;
	$('rep').style.display = "block";
	$('rep').style.top = rep_top;
	user_pick1 = user_pick2 = null;
}

// Popup menu

var a = document.createElement('hr');
$('popup').appendChild(a)

a = document.createElement('a');
a.id = 'translate_status';
a.innerHTML = _('Translate');
$('popup').appendChild(a)
