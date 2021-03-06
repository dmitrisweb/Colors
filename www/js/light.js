(function () {
/**
 * Light
 *
 * This is an extreme small and easy JavaScript library. It can 
 * be used for small websites which won't be needing all the 
 * functionality of the bigger libraries around. Or use it to 
 * learn how to create your own library or framework.
 *
 * @author    Victor Villaverde Laan <info@freelancephp.net>
 * @link      http://www.freelancephp.net/light-4kb-min-jquery-light/
 * @license   Dual licensed under the MIT and GPL licenses
 */

/**
 * Light function
 */
window.Light = function ( selector, parent ) {
	return new Light.core.init( selector, parent );
};

// if global $ is not set
if ( ! window.$ )
	window.$ = window.Light;

/**
 * Light.core
 * Contains the core functions
 */
Light.core = Light.prototype = {

	// init function, set selected elements
	init: function ( selector, parent ) {
		var els;

		selector = selector || window; // default is window
		parent = parent || document; // default is document

		els = ( typeof selector == 'string' )
			? Light.selector( selector, parent ) // use selector method
			: els = selector;

		// reset elements
		this.els = [];

		if ( typeof els.length != 'undefined' ) {
			// els is an array or object
			for (var i = 0, max = els.length; i < max; i++)
				this.els.push(els[i]);
		} else {
			// els is an element
			this.els.push( els );
		}

		return this;
	},

	// get the element of given index (return all elements when no index given)
	get: function ( index ) {
		return ( typeof index == 'undefined' ) 
				? this.els
				: this.els[index];
	},

	// get number of selected elements
	count: function () {
		return this.els.length;
	},

	// set function to be run for each selected element
	each: function ( fn ) {
		for ( var x = 0, max = this.els.length; x < max; x++ )
			fn.call( this, this.els[x] );

		return this;
	},

	// set attribute value
	attr: function ( name, value, type ) {
		this.each(function( el ) {
			if ( typeof type == 'undefined' ) {
				el[name] = value;
			} else {
				el[type][name] = value;
			}
		});

		return this;
	},

	// set styles
	css: function ( styles ) {
		var that = this;
		this.each(function( el ) {
			for ( var name in styles )
				that.attr( name, styles[name], 'style' );
		});

		return this;
	},

	// add given className
	addClass: function ( className ) {
		this.each(function ( el ) {
			if(el.className.indexOf(className) === -1)
				el.className += ' ' + className;
		});

		return this;
	},

	// remove given className
	removeClass: function ( className ) {
		this.each(function ( el ) {
			el.className = el.className.replace( className, '' );
		});

		return this;
	},

	hasClass: function ( className ) {
		var result = 0;
		this.each(function ( el ) {
			result += el.className.indexOf(className) + 1;
		});
		return !!result;
	},

	// toggle className
	toggleClass: function ( className ) {
		this.each(function ( el ) {
			el = Light(el);
			if(el.hasClass(className)){
				el.removeClass(className);
			} else {
				el.addClass(className);
			}
		});

		return this;
	},

	// add event action
	on: function ( event, fn ) {
		var addEvent = function( el ) {
			if ( window.addEventListener ) {
				el.addEventListener( event, fn, false );
			} else if ( window.attachEvent ) {
				el.attachEvent( 'on'+ event, function() {
					fn.call( el, window.event );
				});
			}
		};

		this.each(function( el ) {
			addEvent( el );
		});

		return this;
	},

	// add function to be executed when the DOM is ready
	ready: function ( fn ) {
		DOMReady.add( fn );

		return this;
	},

	// remove selected elements from the DOM
	remove: function () {
		this.each(function( el ) {
			el.parentNode.removeChild( el );
		});

		return this;
	}

};

// Selector, default support:
// $('#id')        - get element by id
// $('.className') - get element(s) by class-name
// $('tagName')    - get element(s) by tag-name
Light.selector = function ( selector, context ) {
	var sels =  selector.split( ',' ),
		el, op, s;

	for ( var x = 0; x < sels.length; x++ ) {
		// trim spaces
		var sel = sels[x].replace(/ /g, '');

		if ( typeof sel == 'string' ) {
			op = sel.substr( 0, 1 ); // operator
			s = sel.substr( 1 ); // name without operator
			if ( op == '#' ) {
				el = document.getElementById( s );
				el = ( isDescendant( el, context ) ) ? el : null;
			} else if ( op == '.' ) {
				el = getElementsByClassName(s, context);
			} else {
				el = context.getElementsByTagName(sel);
			}
		}
	}

	return el;
};

// init gets core prototype
Light.core.init.prototype = Light.core;


/**
 * Helpers
 */

// DOMReady, add functions to be executed when the DOM is ready
var DOMReady = (function () {
	var fns = [],
		isReady = false,
		ready = function () {
			isReady = true;

			// call all functions
			for ( var x = 0; x < fns.length; x++ )
				fns[x].call();
		};

	// public add method
	this.add = function ( fn ) {
		// eval string in a function
		if ( fn.constructor == String ) {
			var strFunc = fn;
			fn = function () { eval( strFunc ); };
		}

		// call imediately when DOM is already ready
		if ( isReady ) {
			fn.call();
		} else {
			// add to the list
			fns[fns.length] = fn;
		}
	};

	// For all browsers except IE
	if ( window.addEventListener )
		document.addEventListener( 'DOMContentLoaded', function(){ ready(); }, false );

	// For IE
	// Code taken from http://ajaxian.com/archives/iecontentloaded-yet-another-domcontentloaded
	(function(){
		// check IE's proprietary DOM members
		if ( ! document.uniqueID && document.expando ) return;

		// you can create any tagName, even customTag like <document :ready />
		var tempNode = document.createElement('document:ready');

		try {
			// see if it throws errors until after ondocumentready
			tempNode.doScroll('left');

			// call ready
			ready();
		} catch ( err ) {
			setTimeout(arguments.callee, 0);
		}
	})();

	return this;
})();

// create a static reference
Light.ready = DOMReady.add;

// Check wether an element is a descendant of the given ancestor
function isDescendant( desc, anc ){
	return ( ( desc.parentNode == anc ) || ( desc.parentNode != document ) && isDescendant( desc.parentNode, anc ) );
};

// Cross browser function for getting elements by className
function getElementsByClassName( className, parent ) {
	var a = [],
		re = new RegExp('\\b' + className + '\\b'),
		els = parent.getElementsByTagName( '*' );

	parent = parent || document.getElementsByTagName( 'body' )[0];

	for ( var i = 0, j = els.length; i < j; i++ )
		if ( re.test( els[i].className ) )
			a.push( els[i] );

	return a;
};

})();