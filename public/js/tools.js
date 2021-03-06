(function(exports) {
    // 公共使用小工具
    var Tools = function(){};

    Tools.prototype = {
        // 生成模板
        template: function (tpl, data) {
            return tpl.replace(/\{\{\s*([\w\.]+)\s*\}\}/g, function(){
                var keys = arguments[1].split('.');
                var newData = data;
                for (var k = 0,l=keys.length;k < l;++k)
                newData = newData[keys[k]]
                return newData;
            })
        },
        // Disable the right mouse button, drag, and select the text.
        unselectable: function() {
            var callback =  new Function("return false");
            window.ondragstart = window.oncontextmenu = callback;
        },
        isFunction: function( fn ) { 
            return !!fn && !fn.nodeName && fn.constructor != String && 
            fn.constructor != RegExp && fn.constructor != Array && 
            /function/i.test( fn + "" ); 
        } 
    }

    exports.tools = new Tools();
})(this)
