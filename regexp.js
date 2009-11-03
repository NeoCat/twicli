var pickup_regexp = readCookie('pickup_regexp') || '';
var pickup_regexp_ex = ''; // 他プラグインからの検索条件
var pickup_tab_list = new Array();	// タブ一覧

// 発言(JSON)が指定条件にマッチするか判定
function execRegexp(tw, exp) {
	return	(!exp.id     || tw.user.screen_name.match(exp.id  )) &&
		(!exp.id_n   ||!tw.user.screen_name.match(exp.id_n)) &&
		(!exp.text   || tw.text.match(exp.text  )) &&
		(!exp.text_n ||!tw.text.match(exp.text_n))
}

// タブ切り替え処理
function switchRegexp(tab) {
	var pickup = new Array();
	switchTo(tab.id);
	if (!tab.no_close)
		$('tw2h').innerHTML = '<div style="background-color: #ccc; text-align: right"><a style="size: small; color: red" href="javascript:closeRegexp(\''+tab.name+'\')">[x] remove tab</a></div>';
	// メインTLから該当する発言を抽出
	var tl = $('tw').childNodes;
	for (var i = 0; i < tl.length; i++) {
		var tl2 = tl[i].childNodes;
		for (var j = 0; j < tl2.length; j++) {
			var target = tl2[j];
			for (var k = 0; k < tab.pickup.length; k++) {
				if (target.tw && execRegexp(target.tw, tab.pickup[k])) {
					pickup.push(target.tw);
					break;
				}
			}
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

// タブを削除
function closeRegexp(tab) {
	if (!confirm("Are you sure to close this tab?")) return;
	var list = pickup_regexp.split(/[\r\n]/);
	var list2 = [];
	for (var id = 0; id < list.length; id++)
		if (list[id].split(':')[0] != tab)
			list2.push(list[id]);
	setRegexp(list2.join("\n"));
	switchTL();
}

// 抽出タブ初期化
function initRegexp() {
	var list = (pickup_regexp + pickup_regexp_ex).split(/[\r\n]/);
	// 抽出タブを生成
	for (var id = 0; id < list.length; id++) {
		var entry = list[id].split(':');
		var tabname = entry[0];
		var regexp = entry[1] ? entry[1].split("/") : [];
		var regexp2 = entry[2] ? entry[2].split("/") : [];
		var filter = entry[3];
		var no_close = false;
		if (!tabname) continue;
		if (tabname[0] == "\\") {
			tabname = tabname.substr(1);
			no_close = 1;
		}
		var ptab = $('pickup-'+tabname);
		if (!ptab) {
			ptab = document.createElement('a');
			ptab.pickup = new Array();
			ptab.id = 'pickup-' + tabname;
			ptab.innerHTML = ptab.name = tabname;
			ptab.href = '#';
			ptab.no_close = no_close;
			ptab.onclick = function() { switchRegexp(this); return false; };
			$('menu2').appendChild(ptab);
			pickup_tab_list.push(ptab);
		}
		var exps = new Object;
		try {
			if (regexp[0]) exps.id = new RegExp(regexp[0]);
			if (regexp[1]) exps.id_n = new RegExp(regexp[1]);
			if (regexp2[0]) exps.text = new RegExp(regexp2[0], 'i');
			if (regexp2[1]) exps.text_n = new RegExp(regexp2[1], 'i');
		} catch (e) { alert("RegExp Error in " + tabname + " tab :\nline "+(id+1)+" - " + e); }
		if (filter) exps.filterTL = true;
		ptab.pickup.push(exps);
	}
}
initRegexp();

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = 'Pickup Pattern <small>(TabName:ID:Status:TLFilter)</small> : <br><form onSubmit="setRegexp($(\'pickup_regexp\').value); return false;"><textarea cols="30" rows="4" id="pickup_regexp">' + pickup_regexp + '</textarea><br><input type="submit" value="Apply"></form>';
		ele.appendChild(e);
		var hr = document.createElement("hr");
		hr.className = "spacer";
		ele.appendChild(hr);
	},
	newMessageElement: function(s, tw, twNodeId) {
		if (twNodeId != 'tw') return;
		// 発言にマッチしたら該当タブに色付け
		for (var i = 0; i < pickup_tab_list.length; i++) {
			var tab = pickup_tab_list[i];
			var match = false;
			for (var k = 0; k < tab.pickup.length; k++) {
				if (execRegexp(tw, tab.pickup[k])) {
					match = true;
					s.className += " match-" + tab.name;
					if (tab.className.indexOf(' new') < 0)
						tab.className += ' new';
					if (tab.pickup[k].filterTL)
						s.style.display = "none";
				}
			}
			if (match)
				s.className += " match";
		}
	},
	fav: function(id, f, img, img_tl) {
		var s = $('tw-' + id);
		if (s && s.tw && f != -1)
			s.tw.favorited = !!f;
	}
});

// Popup menu
function addIDRegexp(user, id) {
	setRegexp(user + ':^' + user + '$\n' + user + '::@' + user + '\n' + pickup_regexp);
	switchRegexp(pickup_tab_list[0]);
}

var a = document.createElement("hr");
$('popup').insertBefore(a,$('popup').childNodes[0])

a = document.createElement("a");
a.target = 'twitter';
a.id = 'regexp_add_ID';
a.innerHTML = 'Pickup this user';
a.href = '#';
a.onclick = function() { addIDRegexp(popup_user, popup_id); return false; }
$('popup').insertBefore(a,$('popup').childNodes[0])
