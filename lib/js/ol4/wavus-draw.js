
window.wavus = window.wavus || {};

wavus.draw = (function() {
	
	var _map;
	var _drawLayer;
	
	
	var draw;
	var drawType;
	var helpTooltipElement, helpTooltip;
	var sketch;
	var mapListener, mousListener;
	var msg_selectMap = '지도를 클릭 주세요.';
	var msg_continuePolygon = '더블클릭하면 다각형을 완성할 수 있습니다.';
	var msg_continueLine = '더블클릭하면 선을 완성할 수 있습니다.';
	var msg_continueBox = '클릭하면 사각형을 완성할 수 있습니다.';
	var msg_continueCircle = '클릭하면 원을 완성할 수 있습니다.';
	
	//드로우 인터렉션 추가
	function addDraw(value, style, vectorSource) {
		var deferred = $.Deferred();
		var geometryFunction;
		
		drawType = value;
		if(value == 'Box'){
			value = 'Circle';
			geometryFunction = ol.interaction.Draw.createBox();
		}

		draw = new ol.interaction.Draw({
			source : vectorSource || _drawLayer.getSource(),
			type : value,
			style : style || wavus.symbol.findSymbol({style : 'draw'}),
			geometryFunction : geometryFunction
		});
		
		_map.addInteraction(draw);
		_createHelpTooltip();
		mousListener = _map.on('pointermove', _pointerMoveHandler);
		draw.on('drawstart', _checkTootip);
		draw.on('drawend', _endTootip);
		_map.getViewport().addEventListener('mouseout', _mouseoutHandler);
		
		deferred.resolve(draw);
		return deferred;
	}
	var _mouseoutHandler = function(){
		helpTooltipElement.classList.add('hidden');
	}
	
	//드로우 지우기
	function removeDraw(){
		_map.removeInteraction(draw);
		_map.getViewport().removeEventListener('mouseout', _mouseoutHandler);
		ol.Observable.unByKey(mousListener);
		draw = null;
		if(helpTooltip)_map.removeOverlay(helpTooltip);
	}
	
	function getDraw(){
		return draw;
	}
	
	function _createHelpTooltip() {
		if (helpTooltipElement) {
			helpTooltipElement.parentNode.removeChild(helpTooltipElement);
		}
		helpTooltipElement = document.createElement('div');
		helpTooltipElement.className = 'tooltip hidden';
		helpTooltip = new ol.Overlay({
			element : helpTooltipElement,
			offset : [ 15, 0 ],
			positioning : 'center-left'
		});
		_map.addOverlay(helpTooltip);
	}
	
	var _pointerMoveHandler = function(evt) {
		if (evt.dragging) {
			return;
		}
		/** @type {string} */
		var tooltipMsg = msg_selectMap;
		
		if (sketch) {
			if(drawType == 'Polygon'){
				tooltipMsg = msg_continuePolygon;
			}else if(drawType == 'LineString'){
				tooltipMsg = msg_continueLine;
			}else if(drawType == 'Box'){
				tooltipMsg = msg_continueBox;
			}else if(drawType == 'Circle'){
				tooltipMsg = msg_continueCircle;
			}
		}
		helpTooltipElement.innerHTML = tooltipMsg;
		helpTooltip.setPosition(evt.coordinate);
		helpTooltipElement.classList.remove('hidden');
	}
	
	var _checkTootip = function(evt){
		sketch = evt.feature;
	}
	
	var _endTootip = function(){
	    sketch = null;
//	    _createHelpTooltip();
	}
	
	var init = function(map, drawLayer){
		_map = map;
		_drawLayer = drawLayer;
	}
	
	
	
	var module = {
			addDraw : addDraw,
			removeDraw : removeDraw,
			getDraw : getDraw,
			
			init : init
		};
	
	return module;
})();