var pickup_regexp = readCookie('pickup_regexp') || '';
var pickup_tab_list = new Array();	// タブ一覧

// 発言(JSON)が指定タブの条件にマッチするか判定
function execRegexp(tw, tab) {
	return tab.regexp_id && tw.user.screen_name.match(tab.regexp_id) ||
			tab.regexp_text && tw.text.match(tab.regexp_text);
}

// タブ切り替え処理
function switchRegexp(tab) {
	var pickup = new Array();
	switchTo(tab.id);
	// メインTLから該当する発言を抽出
	var tl = $('tw').childNodes;
	for (var i = 0; i < tl.length; i++) {
		var tl2 = tl[i].childNodes;
		for (var j = 0; j < tl2.length; j++) {
			var target = tl2[j];
			if (target.tw && execRegexp(target.tw, tab))
				pickup.push(target.tw);
		}
	}
	twShow2(pickup);
}

// 抽出タブ変更
function setRegexp(str) {
	pickup_regexp = str;
	writeCookie('pickup_regexp', pickup_regexp, 3652);
	// 抽出タブを除去
	for (var i = 0; i < pickup_tab_list.length; i++)
		pickup_tab_list[i].parentNode.removeChild(pickup_tab_list[i]);
	pickup_tab_list = new Array;
	// 抽出タブ再初期化
	initRegexp();
}

// 抽出タブ初期化
function initRegexp() {
	var list = pickup_regexp.split(/[\r\n]/);
	// 抽出タブを生成
	for (var id = 0; id < list.length; id++) {
		var entry = list[id].split(':');
		var tabname = entry[0];
		var regexp = entry[1];
		var regexp2 = entry[2];
		var filter = entry[3];
		if (!tabname) continue;
		var ptab = document.createElement('a');
		ptab.id = 'pickup' + id;
		ptab.innerHTML = tabname;
		ptab.href = '#';
		if (regexp) ptab.regexp_id = new RegExp(regexp);
		if (regexp2) ptab.regexp_text = new RegExp(regexp2, 'i');
		if (filter) ptab.filter_flag = true
		ptab.onclick = function() { switchRegexp(this); return false; };
		$('menu2').insertBefore(ptab, $('misc'));
		pickup_tab_list.push(ptab);
	}
}
initRegexp();

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("p");
		e.innerHTML = 'Pickup Pattern <small>(TabName:ID:Status:TLFilter)</small> : <br><form onSubmit="setRegexp($(\'pickup_regexp\').value); return false;"><textarea cols="30" rows="4" id="pickup_regexp">' + pickup_regexp + '</textarea><br><input type="submit" value="Apply"></form>';
		ele.appendChild(e);
		ele.appendChild(document.createElement("hr"));
	},
	newMessageElement: function(s, tw, twNodeId) {
		if (twNodeId != 'tw') return;
		s.tw = tw; // 抽出に利用するためDOMツリーにJSONを記録
		// 発言にマッチしたら該当タブに色付け
		for (var i = 0; i < pickup_tab_list.length; i++) {
			if (execRegexp(tw, pickup_tab_list[i])) {
				pickup_tab_list[i].className += ' new';
				if (pickup_tab_list[i].filter_flag)
					s.style.display = "none";
			}
		}
	}
});

// Popup menu
function addIDRegexp(id) {
	setRegexp(id + ':^' + id + '$\n' + pickup_regexp);
	switchRegexp(pickup_tab_list[0]);
}

var a = document.createElement("hr");
$('popup').appendChild(a)

a = document.createElement("a");
a.target = 'twitter';
a.id = 'regexp_add_ID';
a.innerHTML = 'ID抽出タブ追加';
a.href = '#';
a.onclick = function() { addIDRegexp(popup_user); return false; }
$('popup').appendChild(a)
