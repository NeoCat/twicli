// Array#mapの再実装
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
if (!Array.prototype.uniq) {
	Array.prototype.uniq = function() {
		for (var i = 0, l = this.length; i < l; i++)
			for (var j = 0; j < i; j++)
				if (this[i] === this[j])
					this.splice(i--, l-- && 1);
		return this;
	};
}
// Array#remove
if (!Array.prototype.remove) {
	Array.prototype.remove = function(x) {
		for (var i = 0, l = this.length; i < l; i++)
			if (this[i] === x)
				this.splice(i--, l-- && 1);
		return this;
	};
}
// Array#indexOfの再実装
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(e, from) {
		var len = this.length;
		from = from || 0;
		if (from < 0) from += len;
		for (; from < len; from++)
			if (from in this && this[from] === e)
				return from;
		return -1;
	};
}
// callback for xds.load
function cb(){document.x=arguments}
