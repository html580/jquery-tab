(function($){
	$.fn.tabs = function( option ) {
		option = $.extend( {}, $.fn.tabs.option, option );
		return this.each(function(){
			var tabObj = $(this).find(option.tabObj);
			var thumbObj;
			if (option.thumbObj != null) {
				thumbObj = $(this).find(option.thumbObj);
			}
			var elem = $(this),
				control = tabObj.parent(),
				total = control.children().size(),
				width = control.children().outerWidth(),
				height = control.children().outerHeight(),
				start = option.start - 1,
				effect = option.effect.indexOf(',') < 0 ? option.effect : option.effect.replace(' ', '').split(',')[0],
				paginationEffect = option.effect.indexOf(',') < 0 ? effect : option.effect.replace(' ', '').split(',')[1],
				next = 0, prev = 0, number = 0, current = 0,  active, clicked, position, direction, imageParent, pauseTimeout, playInterval;
			
			function animate(direction, effect, clicked) {
				if (!active) {
					active = true;
					option.animationStart(current + 1);
					switch(direction) {
						case 'next':
							prev = current;
							next = current + 1;
							next = total === next ? 0 : next;
							position = width*2;
							direction = -width*2;
							current = next;
						break;
						case 'prev':
							prev = current;
							next = current - 1;
							next = next === -1 ? total-1 : next;								
							position = 0;								
							direction = 0;		
							current = next;
						break;
						case 'pagination':
							next = parseInt(clicked,10);
							prev = current;
							if (next > prev) {
								position = width*2;
								direction = -width*2;
							} else {
								position = 0;
								direction = 0;
							}
							current = next;
						break;
					}
					if (effect === 'fade') {
							control.children(':eq('+ prev +')').fadeOut();
							control.children(':eq('+ next +')').fadeIn();
							active = false;
					}else if (effect === 'slideToggle') {
							control.children(':eq('+ prev +')').slideToggle();
							control.children(':eq('+ next +')').slideToggle();
							active = false;
					}else if (option.effect=='slide') {
							control.children(':eq('+ next +')').css({
								left: position,
								display: 'block'
							});
							control.animate({
								left: direction
							},option.slideSpeed, option.slideEasing, function(){
								control.css({
									left: -width
								});
								control.children(':eq('+ next +')').css({
									left: width,
									zIndex: 5
								});
								control.children(':eq('+ prev +')').css({
									left: width,
									display: 'none',
									zIndex: 0
								});
								option.animationComplete(next);
								active = false;
							});
					}else{
						control.children(':eq('+ prev +')').hide();
						control.children(':eq('+ next +')').show();
						active = false;
					}
					if (thumbObj != null) {
						thumbObj.removeClass(option.currentClass).eq(next).addClass(option.currentClass);
					}
				}
			}  
			
			function stop() {
				clearInterval(elem.data('interval'));
			}

			function pause() {
				if (option.pause) {
					clearTimeout(elem.data('pause'));
					clearInterval(elem.data('interval'));
					pauseTimeout = setTimeout(function() {
						clearTimeout(elem.data('pause'));
						playInterval = setInterval(	function(){
							animate("next", effect);
						},option.play);
						elem.data('interval',playInterval);
					},option.pause);
					elem.data('pause',pauseTimeout);
				} else {
					stop();
				}
			}
			if (start < 0) {
				start = 0;
			}
			if (start > total) {
				start = total - 1;
			}
			if (option.start) {
				current = start;
			}
			if(option.effect=='slide'){
				control.css({
					overflow: 'hidden',
					position: 'relative'
				});
				control.children().css({
					position: 'absolute',
					top: 0, 
					left: control.children().outerWidth(),
					zIndex: 0,
					display: 'none'
				 });
				control.css({
					position: 'relative',
					width: (width * 3),
					height: height,
					left: -width
				});
				control.css({
					display: 'block'
				});
			}
			control.children().css({
				display: 'none'
			});
			control.children(':eq(' + start + ')').fadeIn();
			var botPrev=null;
			if (option.prev != null) {
				botPrev = $(this).find(option.prev);
			}
			var botNext;
			if (option.next != null) {
				botNext = $(this).find(option.next);
			}
			if (total < 2) {
//				if (botPrev != null) {
//					botPrev.css({visibility:'hidden'});
//				}
//				if (botNext != null) {
//					 botNext.css({visibility:'hidden'});
//				}
				return;
			}
			if (thumbObj != null) {
				thumbObj.removeClass(option.currentClass).eq(start).addClass(option.currentClass);
				if(option.thumbClick){
					thumbObj.click(function() {
						if (option.play) {
							 pause();
						}
						clicked = thumbObj.index($(this));
						if (current != clicked) {
							animate('pagination', paginationEffect, clicked);
						}
						return false;
					});
				}
				if(option.thumbHover){
					thumbObj.mouseenter(function() {
						if (option.play) {
							 stop();
						}
						clicked = thumbObj.index($(this));
						if (current != clicked) {
							animate('pagination', paginationEffect, clicked);
						}
						return false;						
					});
					thumbObj.mouseleave(function() {
						if (option.play) {
							 pause();
						}
					});
				}
			}
			
			if (option.hoverPause && option.play) {
				control.bind('mouseover',function(){
					stop();
				});
				control.bind('mouseleave',function(){
					pause();
				});
			}
			
			
			if (botNext != null) {	
				botNext.click(function(e){
					e.preventDefault();
					if (option.play) {
						pause();
					}
					animate('next', effect);
				});
			}
			
			if (botPrev != null) {
				botPrev.click(function(e){
					e.preventDefault();
					if (option.play) {
						 pause();
					}
					animate('prev', effect);
				});
			}
			if(total<=1){
				if (botPrev != null&&option.slideHover) {
					botPrev.css({visibility:'hidden'});
				}
				if (botNext != null&&option.slideHover) {
					botNext.css({visibility:'hidden'});
				}
			}
			if(option.slideHover){
				$(this).hover(function(){
					if (botPrev != null) {
							botPrev.css({visibility:'visible'});
					}
					if (botNext != null) {
						  botNext.css({visibility:'visible'});
					}
				},function(){
					if (botPrev != null) {
						botPrev.css({visibility:'hidden'});
					}
					if (botNext != null) {
						 botNext.css({visibility:'hidden'});
					}
				})
			}
			if (option.play) {
				playInterval = setInterval(function() {
					animate('next', effect);
				}, option.play);
				elem.data('interval',playInterval);
			}
			option.tabsLoaded(elem,option);
		});
	};
	$.fn.tabs.option = {
		tabObj:null,
		thumbObj : null, 
		thumbClick : false,
		thumbHover : true,
		next: '.next',  
		prev: '.prev', 
		slideHover:true,
		currentClass: 'on', 
		fadeSpeed: 350, 
		fadeEasing: '', 
		slideSpeed: 350, 
		slideEasing: '', 
		start: 1, 
		effect: 'slide', 
		play: 4000, 
		pause: 2500, 
		hoverPause: true,
		animationStart: function(){}, 
		animationComplete: function(){},
		tabsLoaded: function(){}
	};
	
})(jQuery);