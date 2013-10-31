/**
* jQueryの拡張
*
* @class jQuery
*/
interface JQuery {
	psycle(config:any):JQuery;
}

jQuery.fn.psycle = function(config:any):JQuery {
	new Psycle(this, config);
	return this;
};