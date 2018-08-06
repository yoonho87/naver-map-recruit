
window.wavus = window.wavus || {};

wavus.symbol = (function() {
	function findSymbol(param) {
		return _setSymbolAsPolygon(param.style);
	}
	
	function _setSymbolAsPolygon(style) {
		var vectorStyle = new ol.style.Style();
		switch(style) {
			case 'none' :
				vectorStyle.setFill(new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})),
				vectorStyle.setStroke(new ol.style.Stroke({
					color : '#1666b7',
					width : 2
				})),
				vectorStyle.setImage(new ol.style.Circle({
					radius : 7,
					fill : new ol.style.Fill({
						color : '#1666b7'
					})
				}))
				break;
			case 'draw' :
				vectorStyle.setFill(new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})),
				vectorStyle.setStroke(new ol.style.Stroke({
					color : 'rgba(0, 0, 0, 0.5)',
					lineDash : [ 10, 10 ],
					width : 2
				})),
				vectorStyle.setImage(new ol.style.Circle({
					radius : 5,
					stroke : new ol.style.Stroke({ 
						color : 'rgba(0, 0, 0, 0.7)'
					}),
					fill : new ol.style.Fill({
						color : 'rgba(255, 255, 255, 0.2)'
					})
				}))
				break;
			case 'highlight' :
				/*vectorStyle.setFill(new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})),*/
				vectorStyle.setStroke(new ol.style.Stroke({
					color : '#f5d80a',
					width : 3
				})),
				vectorStyle.setImage(new ol.style.Circle({
					radius : 7,
					fill : new ol.style.Fill({
						color : '#f5d80a'
					})
				}))
				break;
			case 'addBuilding' :
				vectorStyle.setFill(new ol.style.Fill({
					color : 'rgba(255, 255, 255, 0.2)'
				})),
				vectorStyle.setStroke(new ol.style.Stroke({
					color : '#f5d80a',
					lineDash : [ 10, 10 ],
					width : 2
				})),
				vectorStyle.setImage(new ol.style.Circle({
					radius : 7,
					fill : new ol.style.Fill({
						color : '#f5d80a'
					})
				}))
				break;
		}
		return vectorStyle;
	}

    function setFeatureStyle(feature){
        var vectorStyle = new ol.style.Style();
        var colorNo;

        if (!wavus.util.isEmpty(feature.get('colorNo'))) {
            colorNo = feature.get('colorNo');
        } else {
            colorNo = 99;
        }

        // console.log('colorNo : ' + colorNo + ', _colorList[colorNo] : ' + _colorList[colorNo]);

        var rgb = _hexToRgb(_colorList[colorNo]);

        vectorStyle.setFill(new ol.style.Fill({
            color: 'rgba(' +rgb.r + ', ' + rgb.g +', ' + rgb.b + ', ' + '0.6)'
        }))

        vectorStyle.setStroke(new ol.style.Stroke({
			   color : _colorList[colorNo],
			   width : '3'
		}))
        return vectorStyle;
    }
    
    /**
     * 기본 스타일을 리턴한다.
     */
    function getDefaultStyle(){
    	var vectorStyle = new ol.style.Style();
    	var rgb = _hexToRgb(_colorList[99]);
        vectorStyle.setFill(new ol.style.Fill({
            color: 'rgba(' +rgb.r + ', ' + rgb.g +', ' + rgb.b + ', ' + '0.6)'
        }))

        vectorStyle.setStroke(new ol.style.Stroke({
			   color : _colorList[99],
			   width : '3'
		}))
        return vectorStyle;
    }
    
    /**
     * 피처에 컬러 인덱스에 따른 해당 스타일을 리턴
     */
    function getFeatureStyle(colorIdx){
    	var vectorStyle = new ol.style.Style();
    	var rgb = _hexToRgb(_colorList[colorIdx]);
        vectorStyle.setFill(new ol.style.Fill({
            color: 'rgba(' +rgb.r + ', ' + rgb.g +', ' + rgb.b + ', ' + '0.6)'
        }))

        vectorStyle.setStroke(new ol.style.Stroke({
			   color : _colorList[colorIdx],
			   width : '3'
		}))
        return vectorStyle;    	
    	
    }
    
    function _hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


	var _colorList = {
			1 : '#0000CD',
			2 : '#23238E',
			3 : '#4D4DFF',
			4 : '#FF6EC7',
			5 : '#00009C',
			6 : '#EBC79E',
			7 : '#CFB53B',
			8 : '#FF7F00',
			9 : '#FF2400',
			10 : '#DB70DB',
			11 : '#8FBC8F',
			12 : '#BC8F8F',
			13 : '#EAADEA',
			14 : '#D9D9F3',
			15 : '#5959AB',
			16 : '#6F4242',
			17 : '#8C1717',
			18 : '#238E68',
			19 : '#6B4226',
			20 : '#8E6B23',
			21 : '#E6E8FA',
			22 : '#3299CC',
			23 : '#007FFF',
			24 : '#FF1CAE',
			25 : '#00FF7F',
			26 : '#236B8E',
			27 : '#38B0DE',
			28 : '#DB9370',
			29 : '#D8DFD8',
			30 : '#ADEAEA',
			31 : '#5C4033',
			32 : '#CDCDCD',
			33 : '#4F2F4F',
			34 : '#CC3229',
			35 : '#D8D8BF',
			36 : '#99CC32',
            99 : '#00CCAF'
	}

	var module = {
		findSymbol : findSymbol,
		setFeatureStyle : setFeatureStyle,
		
		getDefaultStyle : getDefaultStyle,
		getFeatureStyle : getFeatureStyle
	};
	
	return module;
	
})();

