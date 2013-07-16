(function(){
	// 
	var dimensions,
		colors = [
			{
				name: 'Красный',
				code: 'E41B17'
			},{
				name: 'Синий',
				code: '1589FF'
			},{
				name: 'Зеленый',
				code: '4CC417'
			},{
				name: 'Желтый',
				code: 'FFFF00'
			},{
				name: 'Оранжевый',
				code: 'FFA500'
			},{
				name: 'Белый',
				code: 'ffffff'
			},{
				name: 'Черный',
				code: '000000'
			},{
				name: 'Коричневый',
				code: 'A03200'
			},{
				name: 'Фиолетовый',
				code: '7D0552'
			},{
				name: 'Серый',
				code: '808080'
			}
		],
		tpl_button = '',
		gameSize = 12,
		hiddenCount = 0;

	var startGame = function(){
		var aTemp = colors.slice(0),
			len = aTemp.length, newLen = len,
			i = 0, rnd, data = [],
			count = 0, currentTile,
			bgClass = 'bg-0' + Math.floor(Math.random() * 6);
			
		document.body.className = bgClass;
		
		for(; i <= len/2; i++){
			rnd = Math.floor(Math.random() * newLen);
			data.push(aTemp[rnd]);
			aTemp.splice(rnd,1);
			newLen--;
		}
		
		data = data.concat(data).shuffle();
		//console.log(data);
		
		var game = document.getElementById('game'),
			template = '<li><div class="panel click ds-pair-tile color-{{code}}" data-id="{{code}}"><div class="front"></div><div class="back" style="background-color:#{{code}}"></div></div></li>';

		game.innerHTML = tpl(template, data);
 

		var handler = function(e){
			e.preventDefault && e.preventDefault();
			e.stopImmediatePropagation && e.stopImmediatePropagation();
			PG.vibrate(500);
			var el = $(this),
				id = this.getAttribute('data-id');
			
			
			if(!el.hasClass('flip')){
				if(count == 2){
					$('.panel').removeClass('flip');
					count = 0;
					currentTile = '';
				}
				if(count == 1 && currentTile == id){
					hiddenCount++;
					setTimeout(function(){
						$('.color-' + id).addClass('hide');
						
						if(hiddenCount == 6) {
							$('.buttonPush').css({display: 'block'});
							hiddenCount = 0;
						}
					}, 300);
				}
				currentTile = id;
				el.addClass('flip');
				count++;
			}
		};

		$('.click').on('touchstart', handler);
		$('.click').on('click', handler);

	};
	
	var init = function(){
		//dimensions = getDimensions();
	};
	
	init();
	
	var start = function(){
		//console.log(dimensions);
		//addMarkers();
		$('.buttonPush').css({display: 'none'});
		startGame();
	};
	
	
	window.DS = {
		start: start
	};
}());

