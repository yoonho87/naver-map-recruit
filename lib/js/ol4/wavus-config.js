window.wavus = window.wavus || {};

wavus.config = (function() {
	var _layerListUrl = $(location).attr('protocol')+'//'+$(location).attr('host')+'/spceInfo/layer_info.do';
	/*
	 * 서버 정보
	 */
	var info = {
		gisServer : {
			url : 'http://localhost:12300/geoserver/sample'
		}
	};
	
	var mapInfo = {
			center : [14204353.535,4380000],
			zoom : 8,
			minZoom : 7,
			maxZoom : 19,
			projection : 'EPSG:900913'
	}
	
	/*
	 * DB좌표계
	 */
	proj4.defs('EPSG:5186', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1'
			+ '+x_0=200000 +y_0=600000 +ellps=GRS80' + '+units=m +no_defs ');
	var DBProjection = ol.proj.get('EPSG:5186');
	proj4.defs('EPSG:32652', '+proj=utm +zone=52 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
	var EPSG32652 = ol.proj.get('EPSG:32652');
	
	/*
	 * 벡터레이어 피처색 정의
	 */
	var mapperColor = {
			'대' : 1,
			'장' : 2,
			'전' : 3,
			'답' : 4,
			'구' : 5,
            '도' : 6,
            '답' : 7,
            '학' : 8,
            '잡' : 9
	}
	
	/**
	 * passi-cmprn 피처색 정의
	 */
	var passiCmprnColor = {
		'대' : 1,
		'잡' : 2,
		'도' : 3,
		'학' : 4,
		'구' : 5,
	}
	
	
	/*
	 * 레이어 정의
	 */
	var layers = [
	              {
					layerId : 'AL_11_D010_20170506_5181',
					zIndex : 3000,
					visible : false,
					basemap : 'sample'
	              },
	              {
	            	  layerId : 'TL_SCCO_SIG_W_5181',
	            	  zIndex : 2000,
	            	  visible : false,
	            	  basemap : 'sample'
	              },
	              {
	            	  layerId : '행정동_5181',
	            	  zIndex : 1000,
	            	  visible : false,
	            	  basemap : 'sample'
	              }
	              ];
	
	/**
	 * zoom scale 정보
	 */
	var mapZoomScaleInfo = [
	  {
		  zoom : 1,
		  resolution : 78271.51,
		  scale : 295829355.45
	  },                  
	  {
		  zoom : 2,
		  resolution : 39135.75,
		  scale : 147914677.73
	  },                  
	  {
		  zoom : 3,
		  resolution : 19567.88,
		  scale : 73957338.86
	  },                  
	  {
		  zoom : 4,
		  resolution : 9783.94,
		  scale : 36978669.43
	  },                  
	  {
		  zoom : 5,
		  resolution : 4891.97,
		  scale : 18489334.72
	  },                  
	  {
		  zoom : 6,
		  resolution : 2445.98,
		  scale : 9244667.36
	  },                  
	  {
		  zoom : 7,
		  resolution : 1222.99,
		  scale : 4622333.68
	  },                  
	  {
		  zoom : 8,
		  resolution : 611.50,
		  scale : 2311166.84
	  },                  
	  {
		  zoom : 9,
		  resolution : 305.75,
		  scale : 1155583.42
	  },                  
	  {
		  zoom : 10,
		  resolution : 152.87,
		  scale : 577791.71
	  },                  
	  {
		  zoom : 11,
		  resolution : 76.44,
		  scale : 288895.85
	  },                  
	  {
		  zoom : 12,
		  resolution : 38.22,
		  scale : 144447.93
	  },                  
	  {
		  zoom : 13,
		  resolution : 19.11,
		  scale : 72223.96
	  },                  
	  {
		  zoom : 14,
		  resolution : 9.55,
		  scale : 36111.98
	  },                  
	  {
		  zoom : 15,
		  resolution : 4.78,
		  scale : 18055.99
	  },                  
	  {
		  zoom : 16,
		  resolution : 2.39,
		  scale : 9028.00
	  },                  
	  {
		  zoom : 17,
		  resolution : 1.19,
		  scale : 4514.00
	  },                  
	  {
		  zoom : 18,
		  resolution : 0.60,
		  scale : 2257.00
	  },                  
	  {
		  zoom : 19,
		  resolution : 0.30,
		  scale : 1128.50
	  },                  
	  {
		  zoom : 20,
		  resolution : 0.15,
		  scale : 564.25
	  },                  
	  {
		  zoom : 21,
		  resolution : 0.0746,
		  scale : 282.12
	  }                  
    ];

	function init() {
		var deferred = $.Deferred();
		
		wavus.util.ajax({
			url : _layerListUrl,
			dataType : "json",
			type : 'POST'
		}).then(function (result){
			layers = result.layerList;
			
			deferred.resolve();
		}).fail(function (xhr, status, thrown){
		});
		
		return deferred;
	}
	
	var module = {
		init : init,
		mapZoomScaleInfo : mapZoomScaleInfo,
		mapInfo  : mapInfo,
		DBProjection : DBProjection,
		layers : layers,
        mapperColor : mapperColor,
        
        EPSG32652 : EPSG32652,
        
        passiCmprnColor : passiCmprnColor
	};

	module.info = info;
	return module;
})();
