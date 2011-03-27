// Array#mapの再実装(Opera用)
if (!Array.prototype.map) {
	Array.prototype.map = function(fun) {
		var len = this.length;
		var res = new Array(len);
		var thisp = arguments[1];
		for (var i = 0; i < len; i++)
			if (i in this)
				res[i] = fun.call(thisp, this[i], i, this);
		return res;
	};
}
// Array#uniqの再実装
Array.prototype.uniq = function() {
	for (var i = 0, l = this.length; i < l; i++)
		for (var j = 0; j < i; j++)
			if (this[i] === this[j])
				this.splice(i--, l-- && 1);
	return this;
};
// Array#remove
Array.prototype.remove = function(x) {
	for (var i = 0, l = this.length; i < l; i++)
		if (this[i] === x)
			this.splice(i--, l-- && 1);
	return this;
};

// callback for xds.load
function cb(){document.x=arguments}
