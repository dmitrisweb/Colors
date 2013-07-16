;(function () {
	
	// Accepts a template and data. Searches through the
	// data, and replaces each key in the template, accordingly.
	var attachTemplateToData = function(template, data) {
		var i = 0,
			len = data.length,
			fragment = '';

		// For each item in the object, make the necessary replacement
		function replace(obj) {
			var t, key, reg;
 
			for (key in obj) {
				reg = new RegExp('{{' + key + '}}', 'ig');
				t = (t || template).replace(reg, obj[key]);
			}
			return t;
		}
		for (; i < len; i++) {
			fragment += replace(data[i]);
		}
		return fragment;
	};

	this.tpl = attachTemplateToData;
	
	
	
	
	var addMarkers = function(){
		var markersHtml = '<i class="ds-m1"></i><i class="ds-m2"></i><i class="ds-m3"></i><i class="ds-m4"></i>';
		var el = document.createElement("div");
		el.className = 'ds-markers';
		el.innerHTML = markersHtml;
		document.body.appendChild(el);
	};
	
	var getDimensions = function(){
		return { 
			viewportWidth: document.documentElement.clientWidth,
			viewportHeight: document.documentElement.clientHeight,
			deviceWidth: window.screen.width,
			deviceHeight: window.screen.height,
			orientation: window.orientation
		}
	};
	
	var orientationChage = function(e){
		dimensions = getDimensions();
		console.log(dimensions);
	};

	
})();


// PhoneGap bridge
window.PG = (function(){
	var navigator = navigator,
		notification = navigator && navigator.notification;
		
	return {
		vibrate: function(ms){
			notification && notification.vibrate && notification.vibrate(ms);
		}
	}
})();
	


/* Array.shuffle( deep ) - перемешать элементы массива случайным образом

deep - необязательный аргумент логического типа, указывающий на то, 
       нужно ли рекурсивно обрабатывать вложенные массивы;
       по умолчанию false (не обрабатывать)
*/
Array.prototype.shuffle = function( b )
{
 var i = this.length, j, t;
 while( i ) 
 {
  j = Math.floor( ( i-- ) * Math.random() );
  t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
  this[i] = this[j];
  this[j] = t;
 }

 return this;
};
