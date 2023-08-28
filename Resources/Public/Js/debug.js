// after page load:
window.addEventListener('load', function () {
	// now we have jquery available.
	// first:
	const initDebugOverlay = function (){

		(function(){

			const elDebugPage = document.querySelector('.el-debug-control');
			const data = elDebugPage.dataset;
			const triggerToggleSelector = data.triggerToggleSelector;
			if(triggerToggleSelector){
				const triggerToggle = document.querySelector(triggerToggleSelector);
				// when double click on triggerToggle, show debug control ('.el-debug-control') and save state in cookie
				// also restore cookie state on page load
				const cookieName = 'el-debug-control';
				const cookieValue = 'true';
				elDebugPage.style.display = 'none';
				const cookie = document.cookie;
				const isActive = cookie.indexOf(cookieName + '=' + cookieValue) !== -1;
				if(isActive){
					elDebugPage.style.display = 'block';
				}else{
					elDebugPage.style.display = 'none';
				}
				triggerToggle.addEventListener('dblclick', function(){
					const isActive = elDebugPage.style.display === 'block';
					if(isActive){
						elDebugPage.style.display = 'none';
						document.cookie = cookieName + '=false; path=/';
						// animated scroll to bottom with delay of 200ms
					}else{
						elDebugPage.style.display = 'block';
						document.cookie = cookieName + '=true; path=/';
						setTimeout(function(){
							window.scrollTo({
								top: document.body.scrollHeight,
								left: window.pageXOffset,
								behavior: 'smooth'
							});
						}, 200);
					}
				} );
			}
			// const data = elDebugPage

			function createCanvasWithGrid() {
				// Erstelle ein Canvas-Element mit den gleichen Pixelmaßen wie der Browser-Viewport
				const canvas = document.createElement('canvas');

				let devicePixelRatio = window.devicePixelRatio || 1;

				// min 2
				devicePixelRatio = Math.max(2, devicePixelRatio);

				canvas.width = window.innerWidth * devicePixelRatio;
				canvas.height = window.innerHeight * devicePixelRatio;
				// document.body.appendChild(canvas);

				const container = document.querySelector('.smallgrid-overlay');
				container.appendChild(canvas);

				const ctx = canvas.getContext('2d');

				// Zeichne den weißen Hintergrund
				// ctx.fillStyle = 'white';
				// ctx.fillRect(0, 0, canvas.width, canvas.height);

				// Zeichne das Raster von Quadraten
				const squareSize = 16 * devicePixelRatio;
				const borderWidth = 1;
				const squaresPerRow = Math.ceil(canvas.width / squareSize);
				const squaresPerCol = Math.ceil(canvas.height / squareSize);

				for (let row = 0; row < squaresPerCol; row++) {
					for (let col = 0; col < squaresPerRow; col++) {
						const x = col * squareSize;
						const y = row * squareSize;

						// Zeichne den äußeren Rahmen des Quadrats
						ctx.fillStyle = 'red';
						ctx.fillRect(x, y, squareSize, borderWidth);
						ctx.fillRect(x, y, borderWidth, squareSize);
						ctx.fillRect(x, y + squareSize - borderWidth, squareSize, borderWidth);
						ctx.fillRect(x + squareSize - borderWidth, y, borderWidth, squareSize);

						// Zeichne den inneren Bereich des Quadrats
						// ctx.fillStyle = 'transparent';
						// ctx.fillRect(x + borderWidth, y + borderWidth, squareSize - borderWidth * 2, squareSize - borderWidth * 2);
					}
				}
			}
			createCanvasWithGrid();
			window.addEventListener('resize', function(){
				const els = document.querySelectorAll('.smallgrid-overlay canvas');
				els.forEach(function(e){
					e.remove();
				});
				createCanvasWithGrid();
			});
			// on key SHIFT + ARROR UP/DOWN move canvas up/down:
			window.addEventListener('keydown', function(e){
				if(e.shiftKey && e.keyCode === 38){ // up
					const el = document.querySelector('.smallgrid-overlay canvas');
					let top = parseInt(el.style.top);
					if(isNaN(top)){
						top = 0;
					}
					top = (top - 1);
					el.style.top = top + 'px';
				} else if(e.shiftKey && e.keyCode === 40){ // down
					const el = document.querySelector('.smallgrid-overlay canvas');
					let top = parseInt(el.style.top);
					if(isNaN(top)){
						top = 0;
					}
					top = (top + 1);
					el.style.top = top + 'px';
				}
			});


		})();



		(function(){
			function drawMultipleRectangles(rectanglePositions, el = null, type=null) {
				for (const [key, position] of Object.entries(rectanglePositions)) {
					drawRectangle(position, el, type, key);
				}
			}
			function getElementAbsolutePositionIncludingMargins(element) {
				const rect = element.getBoundingClientRect();
				const computedStyle = getComputedStyle(element);

				const marginTop = parseFloat(computedStyle.marginTop);
				const marginRight = parseFloat(computedStyle.marginRight);
				const marginBottom = parseFloat(computedStyle.marginBottom);
				const marginLeft = parseFloat(computedStyle.marginLeft);

				const viewportOffset = {
					x: window.pageXOffset,
					y: window.pageYOffset
				};

				const x = rect.left - marginLeft + viewportOffset.x;
				const y = rect.top - marginTop + viewportOffset.y;
				const width = rect.width + marginLeft + marginRight;
				const height = rect.height + marginTop + marginBottom;

				return { x, y, width, height };
			}
			function drawRectangle(position, htmlElement = null, type = null, orientation = null) {
				if(position.height <= 0 || position.width <= 0){
					console.warn('height or width is <= 0');
					return;
				}
				const rectangle = document.createElement('div');
				rectangle.classList.add('rectangle');
				rectangle.classList.add('layout-debug-element');
				let color = 'rgba(255, 0, 0, 0.2)';
				let colorFull = 'rgba(255, 0, 0, 1)';
				let infotext = null;
				let rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
				if(type === 'margin'){
					rectangle.classList.add('layout-debug-element-margin');
					color = 'rgba(255, 0, 0, 0.2)';
					colorFull = 'rgba(255, 0, 0, 1)';
					infotext = position.height / rootFontSize + 'rem / ' + position.height + 'px' ;
				} else if(type === 'padding'){
					rectangle.classList.add('layout-debug-element-padding');
					color = 'rgba(0, 255, 0, 0.2)';
					colorFull = 'rgb(96 155 96)';
					infotext = position.height / rootFontSize + 'rem / ' + position.height + 'px' ;

				} else if(type === 'element'){
					rectangle.classList.add('layout-debug-element-element');
					color = 'rgba(0, 255, 0, 0.05)';
					colorFull = 'rgba(0,109,187, 0.8)';
					// colorFull = 'rgb(0,109,187)'
				}
				rectangle.style.position = 'absolute';
				rectangle.style.left = position.x + 'px';
				rectangle.style.top = position.y + 'px';
				rectangle.style.width = position.width + 'px';
				rectangle.style.height = position.height + 'px';
				rectangle.style.zIndex = 999999;
				rectangle.style.pointerEvents = 'none';
				rectangle.style.backgroundColor = color;
				if(type === 'element'){
					const borderWidth = 5;
					const space = 1;
					rectangle.style.border = borderWidth + 'px solid ' + colorFull;
					const info = document.createElement('div');
					info.classList.add('layout-debug-element');
					info.classList.add('layout-debug-element-info');
					info.style.position = 'absolute';
					info.style.backgroundColor = colorFull;
					info.style.zIndex = 999999999;
					info.style.color = 'white';
					info.style.fontSize = '11px';
					info.style.fontWeight = 'bold';
					info.style.padding = '2px 10px';
					info.style.top = (position.y + (borderWidth + space)) + 'px';
					info.style.left = (position.x + (borderWidth + space)) + 'px';
					info.style.pointerEvents = 'none';
					info.style.textAlign = 'left';
					info.innerText = htmlElement.className;
					document.body.appendChild(info);
				}
				if(infotext){
					const borderWidth = 1;
					const space = 1;
					rectangle.style.border = borderWidth + 'px solid '+colorFull;
					const info = document.createElement('div');
					info.classList.add('layout-debug-element');
					info.classList.add('layout-debug-element-info');
					info.style.position = 'absolute';
					info.style.backgroundColor = colorFull;
					info.style.zIndex = 999999999;
					info.style.color = 'white';
					info.style.fontSize = '11px';
					info.style.fontWeight = 'bold';
					info.style.padding = '2px 10px';
					info.style.top = position.y + 'px';
					// info.style.left = position.x + 'px';
					info.style.right = 0 + 'px';
					info.style.pointerEvents = 'none';
					info.style.textAlign = 'right';
					info.innerText = infotext;
					if(type=== 'margin' || type === 'padding'){
						if(orientation === 'bottom'){
							info.style.right = 2 + 'px';
							info.style.top = (position.y + 2) + 'px';
						} else if(orientation === 'right'){

						} else if(orientation === 'top'){
							info.style.right = 2 + 'px';
							info.style.top = (position.y + position.height - 2) + 'px';
							info.style.transform = 'translateY(-100%)';
						} else if(orientation === 'left'){

						}
					}
					document.body.appendChild(info);
				}
				if(htmlElement){
					// add event listeners:
					// change all rectangles to yellow if mouse enters htmlElement
					if(type === 'element'){
						// htmlElement.addEventListener('mouseenter', function(){
						// 	rectangle.style.backgroundColor = 'rgba(255,146,23,0.5)';
						// });
						// htmlElement.addEventListener('mouseleave', function(){
						// 	rectangle.style.backgroundColor = color;
						// });
					}
				}
				document.body.appendChild(rectangle);

				console.log('drawn rectangle', {
					position,
					htmlElement,
					orientation,
					color,
					rectangle
				});

			}
			function getElementMarginAbsolutePositions(element) {
				const rect = element.getBoundingClientRect();
				const computedStyle = getComputedStyle(element);

				const marginTop = parseFloat(computedStyle.marginTop);
				const marginRight = parseFloat(computedStyle.marginRight);
				const marginBottom = parseFloat(computedStyle.marginBottom);
				const marginLeft = parseFloat(computedStyle.marginLeft);

				const viewportOffset = {
					x: window.pageXOffset,
					y: window.pageYOffset
				};
				const positions = {
					top: {
						x: rect.left + viewportOffset.x,
						y: rect.top - marginTop + viewportOffset.y,
						width: rect.width,
						height: marginTop
					},
					right: {
						x: rect.right + viewportOffset.x,
						y: rect.top + viewportOffset.y,
						width: marginRight,
						height: rect.height
					},
					bottom: {
						x: rect.left + viewportOffset.x,
						y: rect.bottom + viewportOffset.y,
						width: rect.width,
						height: marginBottom
					},
					left: {
						x: rect.left - marginLeft + viewportOffset.x,
						y: rect.top + viewportOffset.y,
						width: marginLeft,
						height: rect.height
					}
				};
				return positions;
			}
			function getElementPaddingAbsolutePositions(element) {
				const rect = element.getBoundingClientRect();
				const computedStyle = getComputedStyle(element);

				const paddingTop = parseFloat(computedStyle.paddingTop);
				const paddingRight = parseFloat(computedStyle.paddingRight);
				const paddingBottom = parseFloat(computedStyle.paddingBottom);
				const paddingLeft = parseFloat(computedStyle.paddingLeft);

				const viewportOffset = {
					x: window.pageXOffset,
					y: window.pageYOffset
				};

				const positions = {
					top: {
						x: rect.left + viewportOffset.x,
						y: rect.top + viewportOffset.y,
						width: rect.width,
						height: paddingTop
					},
					right: {
						x: rect.right - paddingRight + viewportOffset.x,
						y: rect.top + viewportOffset.y,
						width: paddingRight,
						height: rect.height
					},
					bottom: {
						x: rect.left + viewportOffset.x,
						y: rect.bottom - paddingBottom + viewportOffset.y,
						width: rect.width,
						height: paddingBottom
					},
					left: {
						x: rect.left + viewportOffset.x,
						y: rect.top + viewportOffset.y,
						width: paddingLeft,
						height: rect.height
					}
				};

				return positions;
			}

			const ces = document.querySelectorAll('main > [class^="ce-"], header > [class^="ce-"], footer > [class^="ce-"]');
			const drawLayoutDebugElements = function (ces){
				ces.forEach(function(el){
					let positions = getElementMarginAbsolutePositions(el);
					drawMultipleRectangles(positions, el, 'margin');
					const elPos = getElementAbsolutePositionIncludingMargins(el);
					drawRectangle(elPos, el, 'element');
					positions = getElementPaddingAbsolutePositions(el);
					drawMultipleRectangles(positions, el, 'padding');
				});
			};
			drawLayoutDebugElements(ces);
			window.addEventListener('resize', function(){
				const els = document.querySelectorAll('.layout-debug-element');
				els.forEach(function(e){
					e.remove();
				});
				drawLayoutDebugElements(ces);
			});
			window.addEventListener('load', function(){
				const els = document.querySelectorAll('.layout-debug-element');
				els.forEach(function(e){
					e.remove();
				});
				drawLayoutDebugElements(ces);
			});

			let DOMNodeInsertedMutex = false;
			window.addEventListener('DOMNodeInserted', function(){
				if(DOMNodeInsertedMutex){
					return;
				}
				DOMNodeInsertedMutex = true;
				const els = document.querySelectorAll('.layout-debug-element');
				els.forEach(function(e){
					e.remove();
				});
				drawLayoutDebugElements(ces);
				DOMNodeInsertedMutex = false;
			});
			// const positions = getElementMarginAbsolutePositions(el);
			// drawMultipleRectangles(positions);

			// document.addEventListener('resize', function(){
			// 	const debouncedDraw = function () {
			// 		const els = document.querySelectorAll('.layout-debug-element');
			// 		els.forEach(function(e){
			// 			e.remove();
			// 		});
			// 		const positions = getElementMarginAbsolutePositions(el);
			// 		drawMultipleRectangles(positions);
			// 	};
			// 	debouncedDraw();
			//
			//
			// });



		})();




		$('.el-debug-page').css({display: 'block'});
		(function(){
			const $toggle = $('input[data-action="toggle-grid"]');
			var cookie = document.cookie;
			var isActive = cookie.indexOf('bootstrap-grid-overlay=true') !== -1;
			$toggle.prop('checked', isActive);
			if(isActive){
				$('.page').css({position: 'relative'});
			}
			$('.bootstrap-grid-overlay').toggleClass('active', isActive);
			// also toggle active if SHIFT+G is pressed
			$(document).on('keydown', function(e){
				if(e.shiftKey && e.key === 'C'){
					$toggle.prop('checked', !$toggle.prop('checked'));
					$toggle.trigger('change');
				}
			});
			$toggle.on('change', function(){
				var isActive = $toggle.prop('checked');
				if(isActive){
					$('.page').css({position: 'relative'});
				}
				$('.bootstrap-grid-overlay').toggleClass('active', isActive);
				document.cookie = "bootstrap-grid-overlay=" + isActive + "; path=/";
			});
		})();
		(function(){
			const $toggle = $('input[data-action="toggle-smallgrid"]');
			var cookie = document.cookie;
			var isActive = cookie.indexOf('smallgrid-overlay=true') !== -1;
			$toggle.prop('checked', isActive);
			if(isActive){
				$('.page').css({position: 'relative'});
			}
			$('.smallgrid-overlay').toggleClass('active', isActive);
			// also toggle active if SHIFT+G is pressed
			$(document).on('keydown', function(e){
				if(e.shiftKey && e.key === 'G'){
					$toggle.prop('checked', !$toggle.prop('checked'));
					$toggle.trigger('change');
				}
			});
			$toggle.on('change', function(){
				var isActive = $toggle.prop('checked');
				if(isActive){
					$('.page').css({position: 'relative'});
				}
				$('.smallgrid-overlay').toggleClass('active', isActive);
				document.cookie = "smallgrid-overlay=" + isActive + "; path=/";
			});
		})();
		(function(){
			const $toggle = $('input[data-action="toggle-grid-fluid"]');
			var cookie = document.cookie;
			var isActive = cookie.indexOf('bootstrap-grid-overlay-fluid=true') !== -1;
			$toggle.prop('checked', isActive);
			$('.bootstrap-grid-overlay-fluid').toggleClass('active', isActive);

			$toggle.on('change', function(){
				var isActive = $toggle.prop('checked');
				$('.bootstrap-grid-overlay-fluid').toggleClass('active', isActive);
				document.cookie = "bootstrap-grid-overlay-fluid=" + isActive + "; path=/";
			});
		})();
		(function(){
			const $toggle = $('input[data-action="toggle-breakpoints"]');
			var cookie = document.cookie;
			var isActive = cookie.indexOf('bootstrap-breakpoints-overlay=true') !== -1;
			$toggle.prop('checked', isActive);
			$('.bootstrap-breakpoints-overlay').toggleClass('active', isActive);
			$(document).on('keydown', function(e){
				if(e.shiftKey && e.key === 'B'){
					$toggle.prop('checked', !$toggle.prop('checked'));
					$toggle.trigger('change');
				}
			});
			$toggle.on('change', function(){
				var isActive = $toggle.prop('checked');
				$('.bootstrap-breakpoints-overlay').toggleClass('active', isActive);
				document.cookie = "bootstrap-breakpoints-overlay=" + isActive + "; path=/";
			});
		})();
		(function(){
			const $toggle = $('input[data-action="toggle-debug-ces"]');
			var cookie = document.cookie;
			var isActive = cookie.indexOf('toggle-debug-ces=true') !== -1;
			$toggle.prop('checked', isActive);
			$('body').toggleClass('toggle-debug-ces', isActive);
			$(document).on('keydown', function(e){
				if(e.shiftKey && e.key === 'E'){
					$toggle.prop('checked', !$toggle.prop('checked'));
					$toggle.trigger('change');
				}
			});
			$toggle.on('change', function(){
				var isActive = $toggle.prop('checked');
				$('body').toggleClass('toggle-debug-ces', isActive);
				document.cookie = "toggle-debug-ces=" + isActive + "; path=/";
			});
		})();
	}

	// check every 100ms if jquery is available
	// then call initDebugOverlay
	var interval = setInterval(function(){
		if (typeof $ !== 'undefined') {
			clearInterval(interval);
			initDebugOverlay();
		}
	}, 100);




});
