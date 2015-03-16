var outputz_key = readCookie('outputz_key');
function setOutputzKey(key) {
	outputz_key = key;
	writeCookie('outputz_key', key, 3652);
	if (key)
		alert("Your posts length will be posted to Outputz from now on!");
	else
		alert("Outputz is disabled.");
}

registerPlugin({
	miscTab: function(ele) {
		var e = document.createElement("div");
		e.innerHTML = '<form onSubmit="setOutputzKey($(\'outputz_key\').value); return false;"><a target="outputz" href="http://outputz.com/">Outputz</a> key : <input type="text" size="15" id="outputz_key" value="'+(outputz_key?'(enabled)':'')+'"><button type="submit" class="go"></form>';
		ele.appendChild(e);
		var hr = document.createElement("hr");
		hr.className = "spacer";
		ele.appendChild(hr);
	},
	post: function(message) {
		if (outputz_key)
			enqueuePost('http://outputz.com/api/post?uri=' + encodeURIComponent("http://twitter.com/statuses/update.xml") + '&size=' + message.length + '&key=' + outputz_key,
				function(){}, function(){});
	}
});
