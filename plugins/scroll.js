// ホイールの回転でスクロール (スクロール不可のウィンドウ・フレーム内で有効)
function wheel(event) {
	var delta = 0;
	if (!event) event = window.event;
	if (event.wheelDelta) {
		delta = event.wheelDelta;
	} else if (event.detail)
		delta = -event.detail;
	if (navigator.userAgent.indexOf("Gecko/") >= 0)
		delta *= 10;
	if (navigator.userAgent.indexOf("AppleWebKit/") >= 0)
		delta /= 10;
	if (delta)
		scrollBy(0, -delta);
	if (event.preventDefault)
		event.preventDefault();
	event.returnValue = false;
}
if (window.addEventListener) window.addEventListener('DOMMouseScroll', wheel, false);
window.onmousewheel = document.onmousewheel = wheel;
