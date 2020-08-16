langResources['remove tab'] =	['タブを閉じる','关闭标签'];
langResources['Are you sure to close this tab?'] =	['このタブを閉じてもよろしいですか?','确认要关闭该标签？'];
langResources['Pickup Pattern'] =	['抽出条件','过滤规则'];
langResources['(TabName:ID:Tweet:Filter)'] =	['(タブ名:ユーザID:ツイート:非表示)','标签名:用户ID:用户发言:过滤参数'];
langResources['Apply'] =	['適用','应用'];
langResources['Pickup this user'] =	['このユーザを抽出','过滤该用户到新标签'];

var pickup_regexp = readCookie('pickup_regexp') || '';
var pickup_regexp_ex = ''; // 他プラグインからの検索条件
var pickup_tab_list = new Array();	// タブ一覧

// 発言(JSON)が指定条件にマッチするか判定
function execRegexp(tw, exp) {
	var source = "\nvia " + (tw.source ? tw.source.replace(/<.*?>/g,'') : '');
	var rtinfo = tw.retweeted_status ? "\nby @" + tw.user.screen_name : '';
	var qinfo = tw.quoted_status && tw.quoted_status.user ? "\n" + text(tw.quoted_status) + "\nby @" + tw.quoted_status.user.screen_name : '';
	var rs = tw.retweeted_status || tw;
	var t = display_as_rt ? tw : rs;
	if (!t.user || !t.user.screen_name) return false;
	var ttext = (t.text_replaced || text(t)) + source + rtinfo + qinfo;
	return	(!exp.id     || t.user.screen_name.match(exp.id  )) &&
		(!exp.id_n   ||!t.user.screen_name.match(exp.id_n)) &&
		(!exp.fn     || exp.fn.apply(tw)) &&
		(!exp.text   || ttext.match(exp.text  )) &&
		(!exp.text_n ||!ttext.match(exp.text_n))
}

// Lambda( {}で囲われたキーワード条件指定 )の関数化
function evalFnStr(str) {
	if (!str || !str.match(/^\{(.*)\}$/)) return null;
	// {〜}の対応チェック
	var check_str = RegExp.$1.replace(/\\\\/g,'').replace(/\\["']/g,'')
			.replace(/'.*?'/g, '').replace(/".*?"/g, ''); // 文字列を除外
	var s = 0;
	var depth_list = check_str.split('{').map(function(x){return s=s-x.split('}').length+2});
	if (depth_list[depth_list.length-1] != 1) return alert("{ and } are not matched"); // {と}の個数不一致
	for (var i = 0; i < depth_list.length; i++)
		if (depth_list[i] < 1) return alert("{ and } are not matched"); // 前の"{"に対応しない"}"が存在
	var ret = null;
	try {
		eval('ret = (function(){try\n' + str + '\ncatch(e){ window.regexp_error = e; }})');
	} catch(e) {
		alert("regexp.js: Error in pattern in {}:\n\n"+e);
	}
	return ret;
}

// タブ切り替え処理
function switchRegexp(tab) {
	var pickup = [[],[]];
	switchTo(tab.id);
	if (!tab.no_close) {
		$('tw2h').innerHTML = '<div class="tabcmd tabclose"><a id="regexp-closetab" style="size: small; color: red" href="#">[x] '+_('remove tab')+'</a></div>';
		$('regexp-closetab').onclick = function() { closeRegexp(tab); return false; };
	}
	// TLおよび@タブから該当する発言を抽出
	var duplication = {};
	for (var t = 0; t < 2; t++) {
		var tl = $(['tw','re'][t]).childNodes;
		for (var i = 0; i < tl.length; i++) {
			var tl2 = tl[i].childNodes;
			for (var j = 0; j < tl2.length; j++) {
				var target = tl2[j];
				for (var k = 0; k < tab.pickup.length; k++) {
					if (target.tw && execRegexp(target.tw, tab.pickup[k])) {
						if (duplication[target.tw.id_str]) continue;
						duplication[target.tw.id_str] = true;
						pickup[t].push(target.tw);
						break;
					}
				}
			}
		}
	}
	var sorted = [];
	while (pickup[0].length > 0 || pickup[1].length > 0) {
		if (!pickup[0][0] || pickup[1][0] && pickup[0][0].id < pickup[1][0].id)
			sorted.push(pickup[1].shift());
		else
			sorted.push(pickup[0].shift());
	}
	twShow2(sorted);
	callPlugins("regexp_switched", tab);
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
	if (confirm_close && !confirm(_('Are you sure to close this tab?'))) return;
	var list = pickup_regexp.split(/[\r\n]/);
	var list2 = [];
	for (var id = 0; id < list.length; id++)
		if (list[id].split(':')[0] != tab.name)
			list2.push(list[id]);
	setRegexp(list2.join("\n"));
	switchTL();
}

// 抽出タブ初期化
function initRegexp() {
	var list = (pickup_regexp + "\n" + pickup_regexp_ex).split(/[\r\n]+/);
	// 抽出タブを生成
	for (var id = 0; id < list.length; id++) {
		var entry = list[id].split(':');
		var tabname = entry[0];
		var regexp = entry[1] ? entry[1].split("/") : [];
		var regexp2_fn = evalFnStr(entry[2]);
		var regexp2 = !regexp2_fn && entry[2] ? entry[2].split("/") : [];
		var filter = entry[3];
		var no_close = false;
		if (!tabname) continue;
		if (tabname[0] == "\\") {
			tabname = tabname.substr(1);
			no_close = 1;
		}
		var infp = tabname.split('\\');
		tabname = infp[0];
		var info = infp[1];
		var ptab = $('pickup-'+tabname);
		if (!ptab) {
			ptab = document.createElement('a');
			ptab.pickup = new Array();
			ptab.id = 'pickup-' + tabname;
			ptab.innerHTML = ptab.name = tabname;
			ptab.href = '#';
			ptab.no_close = no_close;
			ptab.info = info;
			ptab.onclick = function() { switchRegexp(this); return false; };
			try {
				ptab.matchTest = new RegExp(" match-" + tabname + '(?:$| )');
			} catch (e) { alert("RegExp Error in " + tabname + " tab :\nline "+(id+1)+" - " + e); }
			$('menu2').appendChild(ptab);
			pickup_tab_list.push(ptab);
		}
		var exps = new Object;
		try {
			if (regexp[0]) exps.id = new RegExp(regexp[0]);
			if (regexp[1]) exps.id_n = new RegExp(regexp[1]);
			if (regexp2_fn) exps.fn = regexp2_fn;
			if (regexp2[0]) exps.text = new RegExp(regexp2[0], 'i');
			if (regexp2[1]) exps.text_n = new RegExp(regexp2[1], 'i');
		} catch (e) { alert("RegExp Error in " + tabname + " tab :\nline "+(id+1)+" - " + e); }
		if (filter) exps.filterTL = parseInt(filter);
		ptab.pickup.push(exps);
	}
}
initRegexp();

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = _('Pickup Pattern')+' <small>'+_('(TabName:ID:Tweet:Filter)')+'</small> : <br><form onSubmit="setRegexp($(\'pickup_regexp\').value); return false;"><textarea cols="30" rows="4" id="pickup_regexp">' + pickup_regexp + '</textarea><br><button type="submit">'+_('Apply')+'</button></form>';
		ele.appendChild(e);
		var hr = document.createElement("hr");
		hr.className = "spacer";
		ele.appendChild(hr);
	},
	newMessageElement: function(s, tw, twNodeId) {
		if (twNodeId == 'tw2c' && selected_menu.id.substr(0,7) == 'pickup-' && !selected_menu.no_close)
			return; // 抽出タブ表示中は処理しない(listsは除く)
		if (twNodeId == 'tw2c' && (selected_menu.id == 'direct' || fav_mode))
			return; // Direct Message, Fav, User一覧は処理しない
		for (var i = 0; i < pickup_tab_list.length; i++) {
			var tab = pickup_tab_list[i];
			var match = false;
			var alreadyMatched = s.className.indexOf(' match') >= 0
			for (var k = 0; k < tab.pickup.length; k++) {
				if (execRegexp(tw, tab.pickup[k])) {
					if (alreadyMatched && s.className.match(tab.matchTest))
							continue;
					match = true;
					s.className += " match-" + tab.name;
					// TL,Re内の発言にマッチしたら該当タブに色付け
					if ((twNodeId == 'tw' || twNodeId == 're') && tab.className.indexOf(' new') < 0)
						tab.className += ' new';
					if (tab.pickup[k].filterTL) {
						// filterTLビットマスク(1:TL 2:@ 4:全タブ)に応じてマッチした発言を隠す
						if ((tab.pickup[k].filterTL & 1) && twNodeId == 'tw' ||
						    (tab.pickup[k].filterTL & 2) && twNodeId == 're' ||
							(tab.pickup[k].filterTL & 4))
							s.style.display = "none";
					}
				}
			}
			if (match && !alreadyMatched)
				s.className += " match";
		}
	},
	replaceUrl: function(s, link, longUrl, shortUrl) {
		var rs = s.tw.retweeted_status || s.tw;
		var t = display_as_rt ? s.tw : rs;
		var twNodeId = '';
		try { twNodeId = s.parentNode ? s.parentNode.id : ''; } catch(e) {}
		t.text_replaced = (t.text_replaced || text(t)).replace(shortUrl, longUrl);
		this.newMessageElement(s, s.tw, twNodeId);
	},
	fav: function(id, f) {
		var s = $('tw-' + id);
		if (s && s.tw && f != -1)
			s.tw.favorited = !!f;
	}
});

function expireRegexp() {
	var updated = false;
	var list = pickup_regexp.split(/[\r\n]/);
	var list2 = [];
	var now = new Date().getTime() / 1000;
	for (var id = 0; id < list.length; id++) {
		var limit = parseInt(list[id].split(':')[4]);
		if (isNaN(limit) || limit == 0 || limit > now)
			list2.push(list[id]);
		else
			updated = true;
	}
	if (updated) setRegexp(list2.join("\n"));
	setTimeout(expireRegexp, 60*1000);
}
expireRegexp();

// Popup menu
function addIDRegexp(user) {
	setRegexp(user + ':^' + user + '$\n' + user + '::@' + user + '\n' + pickup_regexp);
	switchRegexp(pickup_tab_list[0]);
}

var a = document.createElement("hr");
$('popup').insertBefore(a,$('popup').childNodes[0])

a = document.createElement("a");
a.target = 'twitter';
a.id = 'regexp_add_ID';
a.innerHTML = _('Pickup this user');
a.href = '#';
a.onclick = function() { addIDRegexp(popup_user, popup_id); return false; }
$('popup').insertBefore(a,$('popup').childNodes[0])
