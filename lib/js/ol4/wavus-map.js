
window.wavus = window.wavus || {};

wavus.map = (function() {
	var map;
	
	/**
	 * 뷰 체인지 이벤트 용 deferred
	 * 
	 * 받는 쪽에서는
	 * wavus.map.viewChangeDeferred.then(null, null, function(view){
	 * 	view.getZoom(); view.xxx(); view.xxx
	 * 사용하면됨
	 * });
	 */
	var viewChangeDeferred = $.Deferred();
	
	/**
	 * 다중맵 배열
	 */
	var subMaps = [];
	
	
	
	var view = new ol.View({ // map 뷰 설정
		projection : wavus.config.mapInfo.projection,
		minZoom : wavus.config.mapInfo.minZoom,
		maxZoom : wavus.config.mapInfo.maxZoom
	});
	
	function setMap(mapDiv) {
		var div = document.getElementById(mapDiv);
		var deferred = $.Deferred();
		
		map = new ol.Map({ // 맵생성
			target : div,
			view : view
		});
		view.setZoom(wavus.config.mapInfo.zoom);
		view.setCenter(wavus.config.mapInfo.center);
		
        map.addControl( new ol.control.ZoomSlider());
        map.addControl( new ol.control.ScaleLine());

		//뷰 체인지 공지용
        view.on('change', function(){
        	viewChangeDeferred.notify(getView());
        });
        
		deferred.resolve(map);
		return deferred;
	}
	
	//분할지도 화면 맵 생성
	function makeSubMap(mapDiv){
		var deferred = $.Deferred();
		
		var div = document.getElementById(mapDiv);
		
		// 맵생성
		var subMap = new ol.Map({ 
			controls : ol.control.defaults({
				attribution : false,
				rotate : false,
				zoom : false
			}),
			target : div,
			view : map.getView()
		});
		
		
		subMaps.push(subMap);
		
		deferred.resolve(subMap);
		return deferred;
	}
	
	function addLayer(layer) {
		map.addLayer(layer);
	}
	
	function getMap(){
		return map;
	}
	
	function getSynMap(){
		var deferred = $.Deferred();
		deferred.resolve(map);
		return deferred;
	}
	
	function getView(){
		return map.getView();
	}
	
	function getSynView(){
		var deferred = $.Deferred();
		deferred.resolve(map.getView());
		return deferred;
	}
	
	
	/**
	 * 맵 이동 메소드
	 * 
	 * 
	 * param.extent 지오메터리 값  
	 * param.geom	디비에서 나오는 값
	 * 
	 * param.options 옵션
	 * 
	 */
	function moveMap(param){
		var _geometry = null;
		
		if(param.geom){
			var wktFormat = new ol.format.WKT();
			
			var feature = wktFormat.readFeature(param.geom, {
                dataProjection : wavus.config.DBProjection,
                featureProjection : wavus.config.mapInfo.projection
            });
			_geometry = feature.getGeometry();
		}
		
		if(param.extent){
			_geometry = param.extent;
		}
		
		if(_geometry == null){
			_geometry = getView().calculateExtent(map.getSize());
		}
		
		
		
//		var extent = param.extent || getView().calculateExtent(map.getSize());
		var options = {
				duration : 300
		}
		
		getView().fit(_geometry);
	}
	
	
	/**
	 * 맵의 특정 영역 이상으로 못나가게 설정 하는 메소드
	 * param.extent : 영역 extent 
	 * 
	 * param.geom : 디비 검색된 geom 값
	 * 
	 * 넘어올 좌표계에 따라서 좌표 변환이 추가 필요함
	 * 
	 */
	function setLimitExtent(param){
		
		var _geometry = null;
		
		if(param.geom){
			var wktFormat = new ol.format.WKT();
			
			var feature = wktFormat.readFeature(param.geom, {
                dataProjection : wavus.config.DBProjection,
                featureProjection : wavus.config.mapInfo.projection
            });
			_geometry = feature.getGeometry().getExtent();
		}
		
		if(param.extent){
			_geometry = param.extent;
		}
		
		
		var limitView = new ol.View({ // map 뷰 설정
			projection : wavus.config.mapInfo.projection,
			extent : _geometry,
//			minZoom : 13,
			minZoom : 15,
			maxZoom : 19
		});		
		
		limitView.on('change', function(){
        	viewChangeDeferred.notify(getView());
        });
		
		map.setView(limitView);
		
		
		for(var attr in subMaps){
			subMaps[attr].setView(limitView);
		}
		
		
		moveMap({extent : _geometry});
		
		
		setScaleSelectBox();
		
		
		viewChangeDeferred.notify(getView());
		
	}
	
	/**
	 * 스케일 셀렉트 박스 id 저장 변수
	 */
	var _scaleSelectBoxDomId = null;
	
	/**
	 * 스케일 셀렉트 박스 셋팅
	 */
	function setScaleSelectBox(param){
		if(_scaleSelectBoxDomId == null){
			if(param){
				_scaleSelectBoxDomId = param.id;
			}
		}
		
		var minResolution = Math.round(getView().getMinResolution() * 100)/100;
		var maxResolution = Math.round(getView().getMaxResolution() * 100)/100;
		
		var selectBox = $(_scaleSelectBoxDomId);
		selectBox.empty();
		
//		var minZoom = _.find(mapZoomScaleInfo, function(info){
//			return info.resolution == minResolution;
//		});
//		var maxZoom = _.find(mapZoomScaleInfo, function(info){
//			return info.resolution == maxResolution;
//		});
		
		var scaleInfoList = _.filter(wavus.config.mapZoomScaleInfo, function(info){
			return info.resolution >= minResolution && info.resolution <= maxResolution; 
		});
		
		_.each(scaleInfoList, function(info){
			selectBox.append('<option value="'+info.zoom +'"> 1:'+info.scale+'</option>');
		});
		
		selectBox.val(getView().getZoom()).attr('selected', 'selected');
		
		
		selectBox.change(function(){
			getView().animate({zoom : $(this).val(), duration : 300})
		});
	}
	
	
	
	var module = {
		setMap : setMap,
		addLayer :addLayer,
		getMap : getMap,
		getView : getView,
		makeSubMap : makeSubMap,
		getSynMap : getSynMap,
		getSynView : getSynView,
		
		moveMap : moveMap,
		
		setLimitExtent : setLimitExtent ,
		
		viewChangeDeferred : viewChangeDeferred,
		
		setScaleSelectBox : setScaleSelectBox
		
	};
	
	return module;
})();

