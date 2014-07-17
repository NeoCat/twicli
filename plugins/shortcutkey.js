var shortcutkey_plugin = {
	selected_div: null, // 選択中のtweet
	last_selected_div_id: null, // 前回選択されたtweetのdiv ID(オーバーレイ表示は除く)
	key_handled: false, // 他プラグインがkeydownを処理済みか：true時はイベント処理しない
	last_event_date: null, // 最終イベント発生時刻
	repeat_check: false, // keydown,keypress両指定時のチェック
	
	// tweetの選択
	selectTweet: function(ev, div, no_scroll) {
		if (shortcutkey_plugin.selected_div && shortcutkey_plugin.selected_div.id.indexOf('reps-') != 0)
			shortcutkey_plugin.last_selected_div_id = shortcutkey_plugin.selected_div.id;
		shortcutkey_plugin.deselectTweet(true);
		div = div || this;
		div.className += " selected";
		shortcutkey_plugin.selected_div = div;
		if (div.id.indexOf('reps-') != 0 && !no_scroll)
			scrollToDiv(div, $('control').clientHeight+1);
	},
	// tweetの選択解除
	deselectTweet: function(save) {
		var selected = shortcutkey_plugin.selected_div;
		if (selected)
			selected.className = selected.className.replace(' selected', '');
		shortcutkey_plugin.selected_div = null;
		if (!save) delete selected_menu.last_selected;
	},
	// タブ切り替え時に保存したtweet選択を再設定
	applyLastSelection: function(menu) {
		if (menu.last_selected) {
			setTimeout(function(){
				var ele = $(menu.last_selected);
				if (ele)
					shortcutkey_plugin.selectTweet(null, ele, true);
			}, 0);
		}
	},
	// キーボードショートカットハンドラ
	shortCutKeyDown: function(ev) {
		ev = ev || window.event;
		if (ev.shiftKey || ev.altKey || ev.ctrlKey || ev.metaKey || ev.modifiers) return true;
		var code = ev.keyCode || ev.charCode;
		//$("fst").value = code;
		if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
			// inputフォーカス時はesc以外をパススルー
			if (code == 27) { // esc
				document.activeElement.blur();
				return false;
			}
			return true;
		}
		if (shortcutkey_plugin.repeat_check) {
			if (ev.type == 'keydown' && code != 38 && code != 40 && code != 74 && code != 75)
				return true;
			var date = ev.timeStamp || new Date(); // 連続する30ms以内のイベントは無視
			if (shortcutkey_plugin.last_event_date && date - shortcutkey_plugin.last_event_date < 30)
				return true;
			shortcutkey_plugin.last_event_date = date;
		}
		if (ev.type == 'keypress' && navigator.userAgent.indexOf('Firefox') >= 0 && ev.charCode == 0 && ev.keyCode >= 112)
			return true; // FirefoxでFnキーを解釈しない
		
		var tw = null;
		var id = null;
		var user = null;
		var selected = shortcutkey_plugin.selected_div;
		if (selected) {
			tw = selected.tw.retweeted_status || selected.tw;
			if (display_as_rt || fav_mode == 2 || fav_mode == 3) tw = selected.tw;
			id = tw.id_str || tw.id;
			user = tw.user.screen_name;
		}
		shortcutkey_plugin.key_handled = false 
		callPlugins('keydown', code, selected, tw);
		if (shortcutkey_plugin.key_handled) return false;

		if (shortcutkey_plugin.history.push(code) > 10) {
			shortcutkey_plugin.history.shift();
			if (shortcutkey_plugin.history.join() == '38,38,40,40,37,39,37,39,66,65') {
				$('fst').value = "\u306b\u3083\u30fc\u3093 #twicliJP";
				press(1);
				var p = document.evaluate("//span[contains(@class,'status')]/child::text()", $("tw"), null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
				for (var i = 0; i < p.snapshotLength; i++)
					p.snapshotItem(i).nodeValue = p.snapshotItem(i).nodeValue.replace(/な|(い|か|せん|た|だ|です|ます|る|よ)(?:な|ね)?(?=$|[。．.…「」()（）!?！？・\n])/g,'$1ニャ');
			}
		}

		var ele;
		var lower = ev.type == 'keypress' ? 32 : 0;
		switch (code) {
			case 27: // esc : ポップアップメニュー,オーバーレイ表示を閉じる/選択解除
				if ($('popup').style.display == 'block')
					popup_hide();
				else if ($('rep').style.display == 'block')
					closeRep();
				else
					shortcutkey_plugin.deselectTweet();
				return false;
			case 49: // 1 : TLタブ
				switchTL();
				return false;
			case 50: // 2 : @タブ
				switchReply();
				return false;
			case 51: // 3 : ユーザタブ
				switchUser();
				return false;
			case 52: // 4 : Dタブ
				switchDirect();
				return false;
			case 53: // 5 : +タブ
				switchMisc();
				return false;
			case 54: // 6 : タブ6
			case 55: // 7 : タブ7
			case 56: // 8 : タブ8
			case 57: // 9 : タブ9
			case 48: // 0 : タブ10
				var num = code == 48 ? 9 : code - 49;
				var menu = $('menu2').childNodes[num];
				if (!menu || !menu.onclick) return true;
				try {
					menu.onclick();
				} catch(e) {
					alert('shortcutkey error: ' + e);
				}
				return false;
			case 40: // ↓
			case 74+lower: // j : 1つ下を選択
				if (!selected) {
					ele = (selected_menu.id == 'TL' ? $('tw') : selected_menu.id == 'reply' ? $('re') :
							 $('tw2c')).childNodes[0];
					while (ele && !(ele.childNodes[0] && ele.childNodes[0].tw)) ele = ele.nextSibling;
					ele = ele && ele.childNodes[0];
				} else {
					ele = selected;
					while (ele == selected || ele && (!ele.tw || ele.style.display == 'none')) {
						if (ele.nextSibling)
							ele = ele.nextSibling;
						else {
							var pele = ele.parentNode.nextSibling;
							ele = null;
							while (!ele && pele) {
								ele = pele.childNodes[0] && pele.childNodes[0].tw && pele.childNodes[0];
								pele = pele.nextSibling;
							}
						}
					}
				}
				if (ele && ele.tw)
					shortcutkey_plugin.selectTweet(ev, ele);
				return false;
			case 38: // ↑
			case 75+lower: // k : 1つ上を選択
				if (!selected) {
					ele = (selected_menu.id == 'TL' ? $('tw') : selected_menu.id == 'reply' ? $('re') :
							 $('tw2c'));
					ele = ele.childNodes[ele.childNodes.length - 1];
					while (ele && !(ele.childNodes[0] && ele.childNodes[0].tw)) ele = ele.previousSibling;
					ele = ele && ele.childNodes[ele.childNodes.length - 1];
				} else {
					ele = selected;
					while (ele == selected || ele && (!ele.tw || ele.style.display == 'none')) {
						if (ele.previousSibling)
							ele = ele.previousSibling;
						else {
							var pele = ele.parentNode.previousSibling;
							ele = null;
							while (!ele && pele) {
								ele = pele.childNodes[0] && pele.childNodes[0].tw &&
										 pele.childNodes[pele.childNodes.length - 1];
								pele = pele.previousSibling;
							}
						}
					}
				}
				if (ele && ele.tw)
					shortcutkey_plugin.selectTweet(ev, ele);
				return false;
			case 70+lower: // f : fav
				if (!selected) return true;
				fav($('fav-'+selected.id), id);
				return false;
			case 73+lower: // i : 返信元を表示(In reply to)
				if (!selected || !tw.in_reply_to_status_id_str) return true;
				dispReply(user, tw.in_reply_to_status_id_str, $("utils-"+selected.id));
				return false;
			case 85+lower: // u : ユーザTLを表示(User)
				if (!selected) return true;
					switchUserTL(selected);
				return false;
			case 69+lower: // e : 返信(rEply)
				if (!selected) return true;
				replyTo(user, id, selected.id);
				return false;
			case 76+lower: // l : リストの全ツイート取得(get all tweets in the List)
				if (!$('list_get_all')) return true;
				$('list_get_all').onclick();
				return false;
			case 80+lower: // p : ユーザを抽出(Pickup)
				if (!selected) return true;
				if (typeof(addIDRegexp) != 'function') return true;
				addIDRegexp(user, id);
				return false;
			case 82+lower: // r : リツイート(Retweet)
				if (!selected) return true;
				retweetStatus(id, selected);
				return false;
			case 81+lower: // q : RT:を付けて引用(Quote with RT:)
				if (!selected) return true;
				quoteStatus(id, user, selected);
				return false;
			case 68+lower: // d : tweetを削除(Delete)
				if (!selected) return true;
				if (selected_menu.id != "direct" && user != myname) return true;
				deleteStatus(id);
				return false;
			case 84+lower: // t : 翻訳(Translate)
				if (!selected) return true;
				translateStatus(selected.id);
				return false;
			case 71+lower: // g : 地図表示(Geo map)
				if (!selected) return true;
				var geomap = $('geomap-'+selected.id);
				if (geomap.onclick())
					window.open(geomap.href, '_blank');
				return false;
			case 79+lower: // o : リンクを開く(Open links)
				if (!selected) return true;
				for (var i = 0; i < selected.childNodes.length; i++) {
					var target = selected.childNodes[i]
					if (target.id && target.id.substr(0,5) == 'text-') {
						for (i = 0; i < target.childNodes.length; i++) {
							var target2 = target.childNodes[i];
							if (target2.tagName == 'A' && target2.innerHTML.substr(0,4) == 'http') {
								if (link(target2)) window.open(target2.href, "_blank");
							}
						}
						break;
					}
				}
				return false;
			case 86+lower: // v : 写真等のリンク先内容を表示(View links)
				if (!selected) return true;
				for (var i = 0; i < selected.childNodes.length; i++) {
					var target = selected.childNodes[i]
					if (target.id && target.id.substr(0,5) == 'text-') {
						for (i = 0; i < target.childNodes.length; i++) {
							var target2 = target.childNodes[i];
							if (target2.tagName == 'A' && target2.className == 'button' && target2.onclick) {
								target2.onclick();
								break;
							}
						}
						break;
					}
				}
				return false;
			case 77+lower: // m : 発言欄へ移動(Move to textarea)
				$('fst').focus();
				return false;
			case 88+lower: // x : タブを閉じる
				var closetab = $('tws-closetab') || $('regexp-closetab');
				if (closetab)
					return closetab.onclick();
		}

		return true;
	},

	newMessageElement: function(el) {
		// tweetをクリックすると選択
		el.onclick = this.selectTweet;
		// オーバーレイ表示時は初回に自動選択
		if (el.id.indexOf('reps-') == 0 &&
				(!this.selected_div || this.selected_div.id.indexOf('reps-') != 0))
			this.selectTweet(null, el);
	},
	closeRep: function() {
		if (this.selected_div && this.selected_div.id.indexOf('reps-') == 0) {
			if (this.last_selected_div_id && $(this.last_selected_div_id))
				this.selectTweet(null, $(this.last_selected_div_id));
			else
				this.deselectTweet();
		}
	},
	switchTo: function(new_menu, old_menu) {
		if (this.selected_div)
			old_menu.last_selected = this.selected_div.id;
		this.deselectTweet(true);
		this.applyLastSelection(new_menu);
	},
	added: function(tw, tw_node, after) {
		if (tw_node != "tw2c" || after) return;
		this.applyLastSelection(selected_menu);
	},
	resetFrm: function(arg) {
		if (arg) this.deselectTweet();
	},
	init: function() {
		this.history = [];
		if (navigator.userAgent.indexOf('Opera') >= 0)
			document.onkeypress = this.shortCutKeyDown;
		else if (navigator.userAgent.indexOf('Firefox') >= 0) {
			document.onkeydown = document.onkeypress = this.shortCutKeyDown;
			this.repeat_check = true;
		}
		else
			document.onkeydown = this.shortCutKeyDown;
	}
};
registerPlugin(shortcutkey_plugin);
