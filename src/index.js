"use strict";

import path from 'path';
import {parseQuery} from 'loader-utils';
import * as fsPatch from './fs-patch';

function VirtualFileLoader() {
	const query = parseQuery( this.query );
	if ( !query.src )
		throw new Error( "virtual-file-loader requires src param" );
	if ( !query.file )
		throw new Error( "virtual-file-loader requires file param" );
	
	var file    = resolveFile( this, query.file );
	var encoding = query.encoding || 'hex';
	var src      = new Buffer( query.src, encoding );

	fsPatch.add( this.fs, {
		path:    file,
		content: src
	});

	return `module.exports = require("${file}");`;
};

function resolveFile( ctx, file ) {
	if ( !ctx._module )
		return file;

	var context;
	var reason = ctx._module.reasons && ctx._module.reasons[ ctx._module.reasons.length - 1 ];
	if ( reason ) {
		context = path.dirname( reason.module.resource );
	} else {
		var issuer = ctx._module.issuer.split( "!" );
		context = path.dirname( issuer[ issuer.length - 1 ] );
	}

	return path.resolve( context, file );
}

export default VirtualFileLoader;
