/*
 * @fileOverview 动画处理
 * @version 0.1
 * @author minggangqiu
 */
(function() {
    function Animation() {
        // 事件集合
        this.events = {};
        this.settings = {};

        // 帧循环
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame || 
                window.webkitRequestAnimationFrame;
        })();
    }

    Animation.prototype = {
        // 添加动画处理事件
        addHandle: function(evt, callback) {
            var nevt = {
                name: evt,
                callback: callback
            };
            if (!(evt in this.events)) 
                this.events[evt] = [];
            this.events[evt].push(nevt);
        },
        setSettings: function(opts){
            var defaultOpts = {
                action: "interval"
            }

            opts = opts || {};

            for (var o in defaultOpts) {
                this.settings[o] = opts[o] || defaultOpts[o];
            }
        },
        // 注册动画
        registerAnimation: function(opts) {
            this.setSettings(opts);
            var self = this;

            switch(this.settings.action) {
                case "interval":
                    animation();
                    function animation() {
                        window.requestAnimFrame(animation);
                        trigger();
                    };
                    break;
                case "scroll":
                    // 滚轮事件
                    window.addEventListener("wheel", trigger, false);
                    break;
                default:
                    break;
            }

            function trigger(data) {
                console.log(window);
                // 触发所有tick事件
                var events = self.events;

                var evt = events['tick'];
                for (var evi=0;evi<evt.length;++evi) {
                    var ev=evt[evi];
                    ev.callback.call(self, ev);
                }
            }
        }
    }

    window.animation = new Animation;
})();
