/** Document Style Sheets Operation Library v0.0.1
 *  @Author ThomasSoloist
 *  @Date 2016/01/15
 *  Released under the MIT license
 */

setTimeout(function(){
	console.log(document.styleSheets);
},500);

var docStyle = (function() {

	function find(selector,index) {
		selector = selector.toLowerCase().replace(/\s/g,"").replace(/\,/g,", ");
		
		if(!document.styleSheets || !document.styleSheets.length){
			var style = document.createElement("style");
			document.head.appendChild(style);
		}
		
		var css,indexnum=0,styleindex=0;
		
		for (var i in document.styleSheets) {
			var obj = document.styleSheets[i].cssRules || document.styleSheets[i].rules;
			styleindex++;
			for (var a in obj) {
				if(a=="length" || a=="item"){
					break;
				}
				indexnum++;
				if (obj[a].selectorText == selector) {
					css = obj[a];
					break;
				}
				if (obj[a].name == selector && obj[a].cssRules != undefined) {
					css = obj[a];
					break;
				}
			}
			if(css!=undefined){
				break;
			}
			
		}
		if(index!=undefined && index==true){
			return indexnum-1;
		}else if(index==-1){
			return styleindex-1;
		}
		return css;
	}
	
	function getPrefix(){
		if(typeof CSSKeyframesRule!="undefined"){
			return "";
		}else if(typeof MozCSSKeyframesRule!="undefined"){
			return "-moz-";
		}else if(typeof WebKitCSSKeyframesRule!="undefined"){
			return "-webkit-";
		}else{
			return "-o-";
		}
	}

	var duang = {
		hasSelector: function(selector){
			if(find(selector)==undefined){
				return false;
			}else{
				return true;
			}
		},
		setStyle: function(selector,style,value){
			find(selector).style[style] = value;
		},
		getStyle: function(selector,style){
			return find(selector).style[style];
		},
		hasStyle: function(selector,style){
			if(this.hasSelector(selector)==false){
				return false;
			}
			if(find(selector).style[style]==""){
				return false;
			}else {
				return true;
			}
		},
		setKeyFrames: function(name,percent,style,value){
			var obj = find(name);
			for(var i in obj.cssRules){
				if(obj.cssRules[i].keyText==percent){
					obj.cssRules[i].style[style] = value;
					return;
				}
			}
			if(obj.insertRule){
				obj.insertRule(percent+" {}");
			}else{
				obj.appendRule(percent+" {}");
			}
			obj.cssRules[obj.cssRules.length-1].style[style] = value;
		},
		getKeyFrames: function(name,percent,style){
			var obj = find(name);
			for(var i in obj.cssRules){
				if(obj.cssRules[i].keyText==percent){
					return obj.cssRules[i].style[style];
				}
			}
			return null;
		},
		hasKeyFrames: function(name){
			if(find(name)==-1){
				return false;
			}else {
				return true;
			}
		},
		addStyle: function(selector){
			if(!document.styleSheets || !document.styleSheets.length){
				var style = document.createElement("style");
				document.head.appendChild(style);
			}
			if(document.styleSheets[0].insertRule){
				document.styleSheets[0].insertRule(selector+" {}",0);
			}else{
				document.styleSheets[0].addRule(selector,{},0);
			}
		},
		removeStyle: function(selector){
			if(document.styleSheets[0].deleteRule){
				document.styleSheets[0].deleteRule(find(selector,true));
			}else{
				document.styleSheets[0].removeRule(find(selector,true));
			}
		},
		addKeyFrames: function(name){
			var style = document.createElement("style");

			style.innerHTML = "@"+getPrefix()+"keyframes "+name+" {}";

			document.head.appendChild(style);
		},
		removeKeyFrames: function(name){
			var index = find(name,-1);
			if(index==-1){
				return;
			}
			if(document.styleSheets[index].deleteRule){
				document.styleSheets[index].deleteRule(0);
			}else{
				document.styleSheets[index].removeRule(0);
			}
		},
		useKeyFrames: function(id, className, keyFramesName, time, other){
			var temp = keyFramesName+" "+time;
			if(other!=undefined){
				temp += " "+other;
			}
			 
			if(this.hasSelector("."+className)==false){
				this.addStyle("."+className);
			}
			
			this.setStyle("."+className,getPrefix()+"animation",temp);
			
			this.cancelKeyFrames(id, className);
			
			if(document.getElementById(id).className==""){
				document.getElementById(id).className = className;
			}else{
				document.getElementById(id).className += " "+className;
			}
			
			console.log(document.getElementById(id).className);
			
		},
		cancelKeyFrames: function(id, className){
			var temp = document.getElementById(id).className;
			var reg = "/"+className+"\s?/g"
			document.getElementById(id).className = temp.replace(eval(reg),"");
		}
	};

	return duang;
})();