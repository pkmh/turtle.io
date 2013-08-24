/**
 * Stops the instance
 *
 * @method stop
 * @return {Object} TurtleIO instance
 */
TurtleIO.prototype.stop = function () {
	var port = this.config.port;

	this.cache    = $.lru( 1000 );
	this.config   = {};
	this.handlers = {all: {regex: [], routes: [], hosts: {}}, "delete": {regex: [], routes: [], hosts: {}}, get: {regex: [], routes: [], hosts: {}}, patch: {regex: [], routes: [], hosts: {}}, post: {regex: [], routes: [], hosts: {}}, put: {regex: [], routes: [], hosts: {}}};
	this.pages    = {all: {}};
	this.sessions = {};
	this.vhosts   = [];
	this.watching = {};

	if ( this.server !== null ) {
		this.server.close();
	}

	console.log( "Stopped turtle.io on port " + port );

	return this;
};
