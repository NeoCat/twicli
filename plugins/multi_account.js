langResources['Accounts'] =	['アカウント','账户'];
langResources['Are you sure to delete account "$1"?'] =	['アカウント"$1"を削除してもよろしいですか?','确认要删除账户 "$1" ？'];

var accounts_info = {};
var q = location.search.match('account=([^/]+)');
var accounts = readCookie('accounts');
accounts = accounts ? accounts.split(',') : [];
for (var i = 0; i < accounts.length; i++) {
	var info = accounts[i].split('|');
	accounts_info[info[1]] = accounts[i];
	if (q && q[1] == info[0]) {
		writeCookie('access_user', info[0]+'|'+info[1], 3652);
		writeCookie('access_token', info[2], 3652);
		writeCookie('access_secret', info[3], 3652);
		window.access_token = info[2];
		window.access_secret = info[3];
	}
}

function accounts_save() {
	var accounts = [];
	for (var x in accounts_info) accounts.push(accounts_info[x]);
	writeCookie('accounts', accounts.join(','), 3652);
}

function accounts_change() {
	var id = $('accounts').options[$('accounts').selectedIndex].value;
	var account = accounts_info[id].split('|');
	writeCookie('access_user', account[0]+'|'+account[1], 3652);
	writeCookie('access_token', account[2], 3652);
	writeCookie('access_secret', account[3], 3652);
	location.href = location.href;
}

function accounts_delete() {
	var option = $('accounts').options[$('accounts').selectedIndex];
	if (!confirm(_('Are you sure to delete account "$1"?', option.innerHTML))) return false;
	delete accounts_info[option.value];
	accounts_save();
	option.parentNode.removeChild(option);
}

function accounts_add() {
	deleteCookie('access_user');
	location.href = 'oauth/index.html';
}


registerPlugin({
	miscTab: function() {
		var e = document.createElement('div');
		e.innerHTML = _('Accounts')+': <select id="accounts"></select>' +
				'<button type="button" class="go" onclick="accounts_change(); return false"></button>' +
				'<button type="button" class="clr" onclick="accounts_delete(); return false"></button>' +
				'<button type="button" class="add" onclick="accounts_add(); return false"></button><br>';
		$('tw2h').insertBefore(e, $('logout'));

		var opt;
		for (var x in accounts_info) {
			opt = document.createElement('option');
			opt.innerHTML = accounts_info[x].split('|')[0];
			opt.value = accounts_info[x].split('|')[1];
			if (x == myid) opt.selected = 'selected';
			$('accounts').appendChild(opt);
		}
	},
	auth: function() {
		var current_account = readCookie('access_user')+'|'+readCookie('access_token')+'|'+readCookie('access_secret');
		accounts_info[current_account.split('|')[1]] = current_account; // update account info
		accounts_save();
	},
	logout: function() {
		delete accounts_info[myid];
		accounts_save();
	}
});
