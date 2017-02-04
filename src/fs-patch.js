import path from 'path';

const NS   = __filename;

/**
 * Patch the file system
 */
export function patch( fs ) {
	if ( fs[ NS ] )
		return;


	const virtualFS = {
		files: {},

		add: function( options ) {
			var file = path.resolve( options.path );
			virtualFS.files[ file ] = {
				path:    file,
				content: options.content
			};
		}
		
	};
	fs[ NS ] = virtualFS;

	
	createPatchFn( fs, 'readFile', function( orig, args, file, encoding, cb ) {
		var rfile = path.resolve( file );
		var vfile = virtualFS.files[ rfile ];
		if ( vfile ) {
			if ( typeof(encoding) === 'function' ) {
				cb       = encoding;
				encoding = null;
			}

			var content = vfile.content;
			if ( encoding != null )
				content = content.toString( encoding );
			
			cb( null, content )
			return;
		}
		return orig.apply( this, args );
	});
	createPatchFn( fs, 'readFileSync', function( orig, args, file, encoding ) {
		var rfile = path.resolve( file );
		var vfile = virtualFS.files[ rfile ];
		if ( vfile ) {
			var content = vfile.content;
			if ( encoding != null )
				content = content.toString( encoding );
			return content;
		}
		return orig.apply( this, args );
	});

	createPatchFn( fs, 'stat', function( orig, args, p, cb ) {
		var rp = path.resolve( p );
		var vfile = virtualFS.files[ rp ];
		if ( vfile ) {
			var vstat = {
				dev: 8675309,
				nlink: 1,
				uid: 501,
				gid: 20,
				rdev: 0,
				blksize: 4096,
				ino: 44700000,
				mode: 33188,
				size: vfile.content.length,
 				isFile: function() { return true; },
				isDirectory: function() { return false; },
				isBlockDevice: function() { return false; },
				isCharacterDevice: function() { return false; },
				isSymbolicLink: function() { return false; },
				isFIFO: function() { return false; },
				isSocket: function() { return false; },
			};
			cb( null, vstat );
			return;
		}
		return orig.apply( this, args );
	});
	createPatchFn( fs, 'statSync', function( orig, args, p ) {
		var rp = path.resolve( p );
		var vfile = virtualFS.files[ rp ];
		if ( vfile ) {
			var vstat = {
				dev: 8675309,
				nlink: 1,
				uid: 501,
				gid: 20,
				rdev: 0,
				blksize: 4096,
				ino: 44700000,
				mode: 33188,
				size: vfile.content.length,
 				isFile: function() { return true; },
				isDirectory: function() { return false; },
				isBlockDevice: function() { return false; },
				isCharacterDevice: function() { return false; },
				isSymbolicLink: function() { return false; },
				isFIFO: function() { return false; },
				isSocket: function() { return false; },
			};
			return vstat;
		}
		return orig.apply( this, args );
	});

};

export function add( fs, options ) {
	patch( fs );
	fs[ NS ].add( options );
}

function createPatchFn( obj, name, fn ) {
	const origin  = obj[ name ];
	obj[ name ] = function() {
		const args = Array.prototype.slice.call( arguments );
		return fn.apply( this, [origin, args].concat( args ) );
	};
}
