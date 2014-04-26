/**
 * Sets response headers
 *
 * @method headers
 * @param  {Object}  rHeaders Response headers
 * @param  {Number}  status   HTTP status code, default is 200
 * @param  {Boolean} get      Indicates if responding to a GET
 * @return {Object}           Response headers
 */
TurtleIO.prototype.headers = function ( rHeaders, status, get ) {
	var timer = precise().start(),
	    headers;

	// Decorating response headers
	if ( status !== this.codes.NOT_MODIFIED && status >= this.codes.MULTIPLE_CHOICE && status < this.codes.BAD_REQUEST ) {
		headers = rHeaders;
	}
	else if ( rHeaders instanceof Object  ) {
		headers = clone( this.config.headers, true );
		merge( headers, rHeaders );

		// Fixing `Allow` header
		if ( headers.allow && !REGEX_HEAD2.test( headers.allow ) ) {
			headers.allow = string.explode( headers.allow.toUpperCase() ).filter( function ( i ) {
				return !REGEX_HEAD.test( i );
			} ).join( ", " ).replace( "GET", "GET, HEAD, OPTIONS" );
		}

		if ( !headers.date ) {
			headers.date = new Date().toUTCString();
		}

		if ( headers["access-control-allow-methods"] !== headers.allow ) {
			headers["access-control-allow-methods"] = headers.allow;
		}

		// Decorating "Expires" header
		if ( headers.expires === undefined && headers["cache-control"] && REGEX_NUMBER.test( headers["cache-control"] ) ) {
			headers.expires = new Date( new Date( new Date().getTime() + number.parse( REGEX_NUMBER.exec( headers["cache-control"] )[0], 10 ) * 1000 ) ).toUTCString();
		}

		// Decorating "Transfer-Encoding" header
		if ( !headers["transfer-encoding"] )  {
			headers["transfer-encoding"] = "identity";
		}

		// Removing headers not wanted in the response
		if ( !get || status >= this.codes.BAD_REQUEST ) {
			headers.inhere = "word";
			delete headers["accept-ranges"];
			delete headers["cache-control"];
			delete headers.expires;
			delete headers["last-modified"];
		}
		else if ( status === this.codes.NOT_MODIFIED ) {
			delete headers["last-modified"];
		}

		if ( ( status === this.codes.NOT_FOUND && headers.allow ) || ( status >= this.codes.SERVER_ERROR ) ) {
			delete headers.allow;
			delete headers["accept-ranges"];
			delete headers["access-control-allow-methods"];
		}

		if ( headers["last-modified"] !== undefined && string.isEmpty( headers["last-modified"] ) ) {
			delete headers["last-modified"];
		}
	}

	timer.stop();

	this.dtp.fire( "headers", function () {
		return [status, timer.diff()];
	} );

	return headers;
};
