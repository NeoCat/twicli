langResources['Twitter search (yats)'] =	['Twitter検索(yats)','在Twitter上搜索（yats）'];

var test_n = 0;
var twsj_page = 0;
var twsj_query = '';
function twsjSearch(q) {
	twsj_page = 1;
	twsj_query = q;
	xds.load_for_tab('http://yats-data.com/yats/search?seq=' + (seq++) +
						'&query=' + encodeURIComponent(q), twsjSearchShow, 'json');
}
function twsjSearchShow(res) {
	var tmp = $("tmp");
	if (tmp) tmp.parentNode.removeChild(tmp);
	var result = res.map(function(a){
		var d = new Date;
		d.setTime(Date.parse(a.time.replace(/-/g,'/')));
		a.url.match(/status\/(\d+)/);
		return { id: RegExp.$1, text: a.content, created_at: d,
					user: {screen_name:a.user, name: a.user, profile_image_url: a.image} };
	});
	if (twsj_page++ == 1) $('tw2c').innerHTML = '';
	twShowToNode(result, $("tw2c"), false, twsj_page > 1);
	if (res.length > 0) {
		$("tw2c").appendChild(nextButton('next-search2'));
	}
	get_next_func = function(){
		xds.load_for_tab('http://yats-data.com/yats/search?page=' + twsj_page +
						'&query=' + twsj_query + '&seq=' + (seq++), twsjSearchShow, 'json');
	}
}

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<form onSubmit="twsjSearch($(\'searchj_q\').value); return false;"><a target="twitter" href="http://yats-data.com/yats/">'+_('Twitter search (yats)')+'</a>: <input type="text" size="15" id="searchj_q"><input type="image" src="images/go.png"></form>';
		ele.appendChild(e);
		var hr = document.createElement("hr");
		hr.className = "spacer";
		ele.appendChild(hr);
	}
});
