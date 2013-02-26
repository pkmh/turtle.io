/**
 * Returns the difference of now from `timer`
 * 
 * @param  {Object} timer Date instance
 * @return {Number}       Milliseconds
 */
var diff = function (timer) {
	return moment().diff(moment(timer));
};
