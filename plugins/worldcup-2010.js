// World Cup 2010
(function() {
	var cc = {
		"alg":"Algeria","arg":"Argentina","aus":"Austrailia","bra":"Brazil","chi":"Chile",
		"civ":"Côte d'Ivoire","cmr":"Cameroon","den":"Denmark","eng":"England","esp":"Spain",
		"fra":"France","ger":"Germany","gha":"Ghana","gre":"Greece","hon":"Honduras",
		"ita":"Italy","jpn":"Japan","kor":"Korea Republic","mex":"Mexico","ned":"Netherlands",
		"nga":"Nigeria","nzl":"New Zealand","par":"Paraguay","por":"Portugal",
		"prk":"Korea DPR","rsa":"South Africa","srb":"Serbia","sui":"Switzerland",
		"svk":"Slovakia","svn":"Slovenia","uru":"Uruguay","usa":"United States"
	};
	var imgpre = "http://twitter.com/images/worldcup/16/";
	var imgpost = ".png";
	
	registerPlugin({
		newMessageElement : function(el) {
			el.innerHTML = el.innerHTML.replace(/#(\w{3})\b/g, function(str, c) {
				if (!cc[c]) return str;
				return str + '<img src="' + imgpre + c + imgpost + '" alt=""' +
					' title="' + cc[c] + '" style="vertical-align:middle">';
			});
		}
	});
})();
