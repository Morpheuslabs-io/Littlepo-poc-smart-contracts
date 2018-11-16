"use strict";
// 
function error(message){
    throw message;
}

// Utils class
const Util = {};

Util.sprintf = function () {
    for (var a = arguments[0], b = 1; b < arguments.length; b++){
    	a = a.replaceAll("{" + (b - 1) + "}", arguments[b]);
    }
    return a
};

Util.isString = function(s) {
    return typeof(s) === 'string' || s instanceof String;
};
String.prototype.replaceAll = function(
	strTarget, // The substring you want to replace
	strSubString // The string you want to replace in.
	){
	var strText = this;
	var intIndexOfMatch = strText.indexOf( strTarget );
	 
	// Keep looping while an instance of the target string
	// still exists in the string.
	while (intIndexOfMatch != -1){
	// Relace out the current instance.
	strText = strText.replace( strTarget, strSubString )
	 
	// Get the index of any next matching substring.
	intIndexOfMatch = strText.indexOf( strTarget );
	}
	 
	// Return the updated string with ALL the target strings
	// replaced out with the new substring.
	return( strText );
}

module.exports = Util;