var pickup_regexp = readCookie('pickup_regexp') || '';
var pickup_tab_list = new Array();	// タブ一覧

// 発言(JSON)が指定タブの条件にマッチするか判定
function execRegexp(tw, tab) {
	return tw.user.screen_name.match(tab.regexp_id) || tw.text.match(tab.regexp_text);
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
function setRegexp() {
	pickup_regexp = $('pickup_regexp').value;
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
	var list = pickup_regexp.split('\n');
	// 抽出タブを生成
	for (var id = 0; id < list.length; id++) {
		var tabname = list[id].split(':')[0];
		var regexp = list[id].split(':')[1];
		var regexp2 = list[id].split(':')[2];
		if (!tabname) continue;
		var ptab = document.createElement('a');
		ptab.id = 'pickup' + id;
		ptab.innerHTML = tabname;
		ptab.href = '#';
		if (regexp) ptab.regexp_id = new RegExp(regexp);
		if (regexp2) ptab.regexp_text = new RegExp(regexp2, 'i');
		ptab.onclick = function() { switchRegexp(this); return false; };
		$('menu2').insertBefore(ptab, $('misc'));
		var space = document.createTextNode(' ');
		$('menu2').insertBefore(space, $('misc'));
		pickup_tab_list.push(ptab);
	}
}
initRegexp();

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("p");
		e.innerHTML = 'Pickup Pattern (TabName:ID:Status) : <br><form onSubmit="setRegexp(); return false;"><textarea cols="30" rows="4" id="pickup_regexp">' + pickup_regexp + '</textarea><br><input type="submit" value="Apply"></form>';
		ele.appendChild(e);
		ele.appendChild(document.createElement("hr"));
	},
	newMessageElement: function(s, tw, twNodeId) {
		if (twNodeId != 'tw') return;
		s.tw = tw; // 抽出に利用するためDOMツリーにJSONを記録
		// 発言にマッチしたら該当タブに色付け
		for (var i = 0; i < pickup_tab_list.length; i++)
			if (execRegexp(tw, pickup_tab_list[i]))
				pickup_tab_list[i].className += ' new';
	}
});
