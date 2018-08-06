window.wavus = window.wavus || {};

wavus.layer = (function() {
	
	var _map;
	
	
	var tileLayerUrl = 'http://xdworld.vworld.kr:8080/2d/Base/201411/{z}/{x}/{y}.png';
	var drawLayer;
	var highlightLayer;
	
	//단순 일회성 그래픽 레이어
	var graphicLayer;
	
	var z_index = 5000;
	
	//베이스 레이어 셋팅 
	function setBaseLayer() {
		var deferred = $.Deferred();
		
		var vwm = new ol.layer.Tile();
		vwm.setSource(new ol.source.XYZ({url:tileLayerUrl}));
		vwm.setVisible(false);
		vwm.set('name','vwm');
		vwm.set('baseLayer', true);
		vwm.setZIndex(10);
		_map.addLayer(vwm);
		
		var osm = new ol.layer.Tile({
			source : new ol.source.OSM()
		})
		osm.setVisible(false);
		osm.set('name','osm');
		osm.set('baseLayer', true);
		osm.setZIndex(11);
		_map.addLayer(osm);
		
		var bim = new ol.layer.Tile(
		{
			source : new ol.source.BingMaps(
					{
						key : 'Ajt5mJhIrmuerx94LJ31ozqZHX4FQddwR73ahRFVDr3HYT6YA-ruvwjEoP_t6Lmb',
						imagerySet : 'Aerial'
					})
		});
		bim.setVisible(false);
		bim.set('name','bim');
		bim.set('baseLayer', true);
		bim.setZIndex(12);
		_map.addLayer(bim);
		_setVectorLayer(deferred);
		
		return deferred;
	}
	
	function setTileLayer(param){
		var tileLayer = new ol.layer.Tile({
			source : param.source,
			map : param.map || _map,
			visible : param.visible
		})
		tileLayer.set('name', param.name);
		tileLayer.setZIndex(param.zIndex);
	}
	
	//기본 벡터레이어 셋팅
	function _setVectorLayer(deferred) {
		var vectorSource = new ol.source.Vector();
		var vectorStyle = wavus.symbol.findSymbol({
			type : 'polygon',
			style : 'none'
		});

		drawLayer = new ol.layer.Vector({
			source : vectorSource,
			style : vectorStyle,
			zIndex : 6000
		});
		_map.addLayer(drawLayer);
		
		vectorSource = new ol.source.Vector();
		vectorStyle = wavus.symbol.findSymbol({
			type : 'polygon',
			style : 'highlight'
		});

		highlightLayer = new ol.layer.Vector({
			source : vectorSource,
			style : vectorStyle,
			zIndex : 6001
		});
		_map.addLayer(highlightLayer);
		
		
		vectorSource = new ol.source.Vector();
		graphicLayer = new ol.layer.Vector({
			source : vectorSource,
			zIndex : z_index
		});
		_map.addLayer(graphicLayer);
		
		deferred.resolve(drawLayer, highlightLayer, graphicLayer);
		_manageZIndex();
	}
	
	//벡터레이어 추가하기
	function makeVectorLayer(name){
		var vectorSource = new ol.source.Vector();
		var vectorLayer = new ol.layer.Vector({
			source : vectorSource,
			zIndex : z_index
		});
		_manageZIndex();
		vectorLayer.set('name', name);
		
		_map.addLayer(vectorLayer);
		
		var deferred = $.Deferred();
		deferred.resolve(vectorLayer);
		return deferred;
	}
	
	//웹맵서비스 레이어 목록 셋팅
	function setWmsLayer(){
		_.each(wavus.config.layers, function(layer, key){
			if(layer.rqustType == 'img'){
				_map.addLayer(_setImgLayer(layer))
			}
			_map.addLayer(_setTileLayer(layer))
		})
	}
	
	//레이어 요청(wms)
	//geoserver 용
	function _setTileLayer(param) {
		var resolution;
		if(param.zoom){
			var zoomInfo =_.find(wavus.config.mapZoomScaleInfo, function(info){ return info.zoom == param.zoom; });
			resolution = zoomInfo.resolution;
		}
		var wmsSource = new ol.source.TileWMS({
			url : wavus.config.info.gisServer.url + "/wms",
			params : {
				'LAYERS' : param.layerId
				//,'VERSION' : '1.1.1',
				//'SRS' : wavus.config.mapInfo.projection,
				//'STYLES' : param.style || param.layerId
			},
			serverType : 'geoserver',
			//crossOrigin: 'anonymous' //크로스 도메인 허용
		});

		var wmsLayer = new ol.layer.Tile({
			source : wmsSource,
			zIndex : param.zIndex,
			visible : param.visible,
			maxResolution : resolution
		});

		wmsLayer.set('name', param.layerId);
		wmsLayer.set('group', 'wms');
		wmsLayer.set('baseLayer', param.basemap);
		return wmsLayer;
	}
	
	/*
	//원본
	//레이어 요청(wms)
	//geoserver 용
	function _setTileLayer(param) {
		var resolution;
		if(param.zoom){
			var zoomInfo =_.find(wavus.config.mapZoomScaleInfo, function(info){ return info.zoom == param.zoom; });
			resolution = zoomInfo.resolution;
		}
		var wmsSource = new ol.source.TileWMS({
			url : wavus.config.info.gisServer.url + "/wms",
			params : {
				'LAYERS' : param.layerId,
				'VERSION' : '1.1.1',
				'SRS' : wavus.config.mapInfo.projection,
				'STYLES' : param.style || param.layerId
			},
			serverType : 'geoserver',
			crossOrigin: 'anonymous' //크로스 도메인 허용
		});
		
		var wmsLayer = new ol.layer.Tile({
			source : wmsSource,
			zIndex : param.zIndex,
			visible : param.visible,
			maxResolution : resolution
		});
		
		wmsLayer.set('name', param.layerId);
		wmsLayer.set('group', 'wms');
		wmsLayer.set('baseLayer', param.basemap);
		return wmsLayer;
	}*/
	
	
	//레이어 요청(wms)
	//geoserver 용
	function _setImgLayer(param) {
		var resolution;
		if(param.zoom){
			var zoomInfo =_.find(wavus.config.mapZoomScaleInfo, function(info){ return info.zoom == param.zoom; });
			resolution = zoomInfo.resolution;
		}
		
		var wmsSource = new ol.source.ImageWMS({
			url : wavus.config.info.gisServer.url + "/wms",
			params : {
				'LAYERS' : param.layerId,
				'VERSION' : '1.1.1',
				'SRS' : wavus.config.mapInfo.projection,
				'STYLES' : param.style || param.layerId
			},
			serverType : 'geoserver',
			crossOrigin: 'anonymous' /*크로스 도메인 허용*/
		});

		var wmsLayer = new ol.layer.Image({
			source : wmsSource,
			zIndex : param.zIndex,
			visible : param.visible,
			maxResolution : resolution
		});

		wmsLayer.set('name', param.layerId);
		wmsLayer.set('group', 'wms');
		wmsLayer.set('baseLayer', param.basemap);
		return wmsLayer;
	}
	
	
	//shapefile 요청 
	function getShapefile(layerName, storeName){
		var url = wavus.config.info.gisServer.url + '/ows';
		url += '?service=WFS&version=1.0.0&request=GetFeature&outputformat=SHAPE-ZIP&typeName=' + storeName +':' + layerName;
		window.location.href = url;
	}
	/*//shapefile 요청 
	function getShapefile(){
		var url = wavus.config.info.gisServer.url;
		url += '/wms?service=WMS&version=1.1.0&request=GetMap&layers=sample:sample';
		window.location.href = url;
	}*/
	
	//레이어 이름으로 레이어 찾기
	function findLayerById(layerId) {
		var deferred = $.Deferred();
		var layer = _.find( _map.getLayers().getArray(), function(layer){
			return layer.get('name') == layerId || null;
		})
		deferred.resolve(layer);
		return deferred;
	}
	
	//레이어 온오프 
	function onOffLayer(param){
		wavus.map.getSynView().then(function(view){
			param.layer.setVisible(param.visible);
			if(view.getResolution() > param.layer.getMaxResolution() && param.visible){
				if(confirm('현재 해상도에서는 레이어를 확인할 수 없습니다. 확대 하시겠습니까?')){
					view.setResolution(param.layer.getMaxResolution()-0.001);
				}
			}
			
			
		})
	}
	
	function getDrawLayer(){
		return drawLayer;
	}
	
	function getHighlightLayer(){
		return highlightLayer;
	}
	
	function getGraphicLayer(){
		return graphicLayer;
	}
	
	//벡터레이어 z인덱스 관리
	function _manageZIndex(){
		this.z_index = this.z_index + 1 ;
	}
	
	/**
	 * 레이어 초기화
	 * param
	 *  - map : map 객체
	 */
	function init(map){
		var deferred = $.Deferred();
		_map = map;
		
		setWmsLayer();
		
		setBaseLayer().then(function(drawLayer, highlightLayer, graphicLayer){
			deferred.resolve(drawLayer, highlightLayer, graphicLayer);
		});
		
		return deferred;
	}
	
	
	var module = {
		setBaseLayer : setBaseLayer,
		findLayerById : findLayerById,
		setWmsLayer : setWmsLayer,
		onOffLayer : onOffLayer,
		getDrawLayer : getDrawLayer,
		getHighlightLayer : getHighlightLayer,
		getGraphicLayer : getGraphicLayer,
		makeVectorLayer : makeVectorLayer,
		getShapefile : getShapefile,
		setTileLayer: setTileLayer,
		
		init : init
	};
	
	return module;
	
})();

