/**
 * util 함수정의
 * 
 * 간단히 자주 사용되는 함수를 여기에 정의합니다.
 * 
 * 문자열, 날짜, 숫자형태 등..
 */

window.wavus = window.wavus || {};

wavus.util = (function() {
	
	var defaultDateFormat = 'yymmdd'; 

	function commify(n){
		var reg = /(^[+-]?\d+)(\d{3})/;
		n += '';
		while (reg.test(n))
			n = n.replace(reg, '$1' + ',' + '$2');
		return n;
	}
	
	function removeCommas(str) {
	    return(str.replace(/,/g,''));
	}
	
	// http://stackoverflow.com/questions/6660977/convert-hyphens-to-camel-case-camelcase
	var camelCase = (function () {
	    var DEFAULT_REGEX = /[-_]+(.)?/g;

	    function toUpper(match, group1) {
	        return group1 ? group1.toUpperCase() : '';
	    }
	    return function (str, delimiters) {
	        return str.replace(delimiters ? new RegExp('[' + delimiters + ']+(.)?', 'g') : DEFAULT_REGEX, toUpper);
	    };
	})();
	
	function formatDate(format, date) {
		date = date || new Date();
		format = format || defaultDateFormat;
		
		return $.datepicker.formatDate(format, date);
	}
	
	function timestamp() {
		var d = new Date();
		return formatDate()
			 + right('0' + d.getHours(), 2)
			 + right('0' + d.getMinutes(), 2)
			 + right('0' + d.getSeconds(), 2);
	}
	
	function left(str, n) {
		if (n <= 0)
			return "";
		else if (_.isUndefined(str))
			return "";
		else if (n > String(str).length)
			return str;
		else
			return String(str).substring(0,n);				
	}
	
	function right(str, n){
		if (n <= 0)
			return "";
		else if (_.isUndefined(str))
			return "";
		else if (n > String(str).length)
			return str;
		else {
			var iLen = String(str).length;
			return String(str).substring(iLen, iLen - n);
		}
	}
	
	function isNumber(n) {
		if (n) {
			return !!! _.isNaN(Number(n));	
		}
		
		return false;
	}
	
	/**
	 * param.url
	 * param.data
	 * param.async
	 * param.dataType
	 * 
	 */
	function ajax(param) {
		return $.when(
			$.ajax({
				type : param.type || "POST",
				async : param.async === false ? false : true,
				contentType : param.contentType || "application/x-www-form-urlencoded;charset=utf-8",
				url : param.url,
				dataType : param.dataType || "json",
				cache : param.cache,
				processData : param.processData,
				data : param.data,
				error : param.error,
				success : param.success
			})
		);
	}
	
	/**
	 * post 는 data(json object)를 문자열로 변환하여야 한다. 
	 */
	function jsonPost(param) {
		param.type = 'POST';
		param.contentType = 'application/json';
		param.data = JSON.stringify(param.data);
		
		return ajax(param);
	}
	
	/**
	 * get 은 data를 변환없이 전달한다.
	 */
	function jsonGet(param) {
		param.type = 'GET';
		param.contentType = 'application/json';
		param.data = param.data;
		
		return ajax(param);
	}
	
	
	/**
	 * 변수의 널값 체크
	 */
	function isEmpty(value) {
		if (value == "" || value == null || value == undefined 
			|| (value != null && typeof value == "object" && !Object.keys(value).length)) {
			return true
		} else {
			return false
		} 
	}
	
	/**
	 * 공백을 0으로 체우는 메소드
	 */
	function prependZero(value, len) {
		while (value.toString().length < len) {
			value = "0" + value
		}
		return value;
	}

    /**
     * 천단위 콤마
     */
    function comma(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function uncomma(x) {
        return x.replace(/[^\d]+/g, '');
    }

	/**
	 * url(get 방식) 파라미터를 json 으로 변환 하는 메소드 
	 */
	function QueryStringToJSON(url) {
		var urls = url.split('?');
		var str = urls[1];
	    var pairs = str.split('&');
	    var result = {};
	    pairs.forEach(function (pair) {
	        pair = pair.split('=');
            var name = pair[0];
            var value = pair[1];
	        if (name.length)
	            if (result[name] !== undefined) {
	                if (!result[name].push) {
	                    result[name] = [result[name]];
	                }
	                result[name].push(value || '');
	            } else {
	                result[name] = value || '';
	            }
	    });
	    return (result);
	}
	
	/**
	 * 문자열에서 해당 문자 모두 변환 
	 */
	function replaceAll(str, searchStr, replaceStr) {
	    return str.split(searchStr).join(replaceStr);
	}
	
	
	
	
   
	function init() {		
		var deferred = $.Deferred();
		
		// TODO 초기 설정작업을 여기서 한다.
		deferred.resolve();
		
		return deferred;
	}
	
	var module = {
		init : init,
		
		commify : commify,
		removeCommas : removeCommas,
		
		camelCase : camelCase,
		formatDate : formatDate,
		
		left : left,
		right : right,
		
		isNumber : isNumber, 
		
		ajax : ajax,
		
		jsonPost : jsonPost, 
		jsonGet : jsonGet, 
		
		timestamp : timestamp,
		
		isEmpty : isEmpty,
		prependZero : prependZero,
		
		QueryStringToJSON : QueryStringToJSON,

        replaceAll: replaceAll,

        comma: comma,
        uncomma: uncomma
	};
	
	return module;
	
})();
