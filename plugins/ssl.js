twitterURL = 'https://twitter.com/';
twitterAPI = 'https://api.twitter.com/1/';
document.frm.action = 'https://api.twitter.com/1/statuses/update.xml';
document.frm.target = 'tx';

var origResetFrm;
if (navigator.userAgent.indexOf("Opera") >= 0) {
	origResetFrm = resetFrm;
	resetFrm = function() { // Opera fails to post targetting https frame
		try { if (document.frames.tx.location.href == "about:blank") return origResetFrm(); } catch(e) {
			document.frames.tx.location.href = "about:blank";
		}
	}
}
