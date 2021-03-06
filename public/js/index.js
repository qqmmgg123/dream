var dreamTpl = '<p><input name="title" class="" type="text" placeholder="{{ TITLE }}" /></p>' +
               '<p><textarea name="description" placeholder="{{ DESCRIPTION }}"></textarea></p>';

var registerTpl = '<p><input class="" type="text" placeholder="{{ NAME }}" /></p>' +
                  '<p><input class="" type="text" placeholder="{{ CONTACT }}" /></p>' +
                  '<p><input class="" type="password" placeholder="{{ PASSWORD }}" /></p>' +
                  '<p><input class="" type="checkbox" /> {{ AUTOSIGN }}</p>';

function Win(opts) {

}

Win.prototype = {

}



function Popup(opts) {
    this.opts = opts;
    this.init();
}

Popup.prototype = {
    init: function() {
        var opts = this.opts || {};

        this.visible = false;
        this.width = opts.width || 400,
        this.height = typeof opts.height == 'number'? 
        opts.height:(typeof opts.height == "string"? 0:320);

        this.defaultOpts = {
            width: this.width,
            height: this.height,
            arrow: true,
            direction: 'top',
            modal: false,
            left: 0,
            top: 0
        }

        this.div = document.createElement('div');
        this.div.className = "dialog none";

        this.settings = opts;
    },
    setOpts: function(opts) {
        for (var o in this.defaultOpts) {
            switch (o) {
                case 'width':
                case 'height':
                case 'left':
                    case 'top':
                        var value = opts[o]? opts[o]:this.defaultOpts[o];
                        if (typeof value == "number")
                            value += 'px';

                        this.div.style[o] = value;
                        break;
                    case 'arrow':
                        if (typeof opts[o] != "boolean") 
                            opts[o] = this.defaultOpts[o]

                        if (opts[o]) {
                            var arrowCls = ['arrow-border', 'arrow'];
                            for (var i=0;i<arrowCls.length;++i) {
                                var div = document.createElement('div');
                                div.className = arrowCls[i];
                                this.div.appendChild(div);
                                div = null;
                            }
                        }
                        break;
                     case 'direction':
                        var cls = opts[o]? opts[o]:this.defaultOpts[o];
                        this.div.className += ' ' + cls;
                        break;
                     case 'modal':
                        this.modal = document.createElement('div');
                        break;
                    default:
                        break;
                }
        }
    },
    bintEvents: function() {
        var self = this;
        // 键盘操作关闭窗口
        keyboard.addHandle('escape_keydown', function() {
            self.close();
            keyboard.removeHandle('escape_keydown', arguments.callee);
        });
    },
    show: function() {
        var win_width = window.innerWidth;
        var win_height = window.innerHeight;

        this.defaultOpts.left = (win_width - this.width) * 0.5,
        this.defaultOpts.top  = (win_height - this.height) * 0.5,
        this.setOpts(this.settings);
        this.bintEvents();
        document.body.appendChild(this.div);
        document.body.appendChild(this.modal);

        this.div.className = this.div
            .className.replace(' none','');

        this.modal.className = "modal fade-out";
        var oheight = this.modal.offsetHeight;
        this.modal.className = "modal fade-in";

        this.visible = true;
    },
    close: function() {
        if (document.body.contains(this.div)) {
            document.body.removeChild(this.div);
            document.body.removeChild(this.modal);
            // this.modal = this.div = null;
            this.visible = false;
        }
    }
};

function Tips(opts) {
    Popup.call(this, opts);
}

Tips.prototype = Object.create(Popup.prototype, {
    show: {
        value: function(content) {
            Popup.prototype.show.apply(this, arguments); // call super
            var self = this;

            this.div.innerHTML = content;

            setTimeout(function() {
                self.close();
            }, 2000);
        },
        enumerable: true,
        configurable: true, 
        writable: true
    }
});

Tips.prototype.constructor = Popup;

function StepPopup(opts) {
    var defaultOpts = {
        steps: [
            {
                html: tools.template(dreamTpl, dream_tips)
            },
            {
                html: tools.template(registerTpl, register_tips)
            }
        ],
        onConfirm: function() {
            console.log('hello!!!');
        }
    }
    for (var k in opts)
        defaultOpts[k] = opts[k];
    Popup.call(this, defaultOpts);
}

StepPopup.prototype = Object.create(Popup.prototype, {
    show: {
        value: function() {
            Popup.prototype.show.apply(this, arguments); // call super
            var self = this;
            
            var content = "";
            for (var i = 0; i < this.settings.steps.length; ++i) {
                var stepCon = "<div class='step_pop " + (i? "none'":"'") + ">" + 
                              this.settings.steps[i].html +
                              (i != this.settings.steps.length - 1? 
                              "<button class='next_btn'>下一步</button>":
                              "<button class='confirm_btn'>保存</button>") +
                              "</div>";
                content += stepCon;
            }
            
            this.currentStep = 0;
            this.div.innerHTML = content;
            var nextBtns = this.div.querySelectorAll(".next_btn");
            for(i=0; i < nextBtns.length; i++) {
                nextBtns[i].addEventListener("click", function() {
                    var steps = self.div.querySelectorAll(".step_pop");
                    for(index=0; index < steps.length; index++) {
                        steps[index].className = "step_pop none";
                    }
                    steps[++self.currentStep].className = "step_pop";
                }, false);
            }
            var confirmBtn = this.div.querySelector(".confirm_btn");
            confirmBtn.addEventListener("click", function() {
                self.settings.onConfirm.call(this);
                self.close();
            }, false);
        },
        enumerable: true,
        configurable: true, 
        writable: true
    }
});

StepPopup.prototype.constructor = Popup;

function DropDown(opts) {
    var defaultOpts = {
        list: [
            {
                key: "spiritual",
                value: 1,
                text: "精神上支持",
                listener: {
                    event: "click",
                    callback: function() {
                        console.log('1111');
                    }
                }
            },
            {
                key: "donation",
                value: 2,
                text: "捐款",
                listener: {
                    event: "click",
                    callback: function() {
                        console.log('2222');
                    }
                }
            }
        ]
    }
    for (var k in opts)
        defaultOpts[k] = opts[k];
    Popup.call(this, defaultOpts);
}

DropDown.prototype = Object.create(Popup.prototype, {
    show: {
        value: function() {
            Popup.prototype.show.apply(this, arguments); // call super
            var self = this;
            
            var clickHandles = {};
            var content = "<ul class='dropdown'>";
            var list = this.settings.list;
            for (var i = 0, l = list.length; i < l; i++) {
                var option = "<li id='{{ key }}'" + 
                             "data-value='{{ value }}' class='option'>" +
                             "{{ text }}" +
                             "</li>";
                content += tools.template(option, list[i]);
                
                if (list[i].listener.event = "click") {
                    clickHandles[list[i].key] = list[i].listener.callback;
                }
            }
            content += "</ul>";
            
            this.div.innerHTML = content;
            this.div.addEventListener("click", function(event) {
                var key = event.target.id;
                clickHandles[key] && clickHandles[key].call(this, event);
            }, false);
        },
        enumerable: true,
        configurable: true,
        writable: true
    }
});

DropDown.prototype.constructor = Popup;

function Req() {
    
}

Req.prototype = {
    ajax: function(url, data, type, success, error) {
        var oMyForm = new FormData();

        console.log(data);

        for (var k in data) {
            oMyForm.append(k, data[k]);
        }

        function createXHR() {
            if (typeof XMLHttpRequest != "undefined") {
                return new XMLHttpRequest();
            }
        }

        var xhr = createXHR();

        function reqComplete() {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    var data = JSON.parse(xhr.responseText);
                    success.call(this, data);
                    xhr.removeEventListener("load", reqComplete, false);
                }
            }
        }

        xhr.addEventListener("load", reqComplete, false);

        xhr.onerror = function(error) {
            error.call(this, error);
            xhr.onerror = null;
        }

        xhr.open(type, url, true);
        console.log(oMyForm);
        xhr.send(oMyForm);
    }
};

var req = new Req();

var containerArea = document.getElementById("container_area");
var listArea = document.getElementById("list_area");
var createDreamNodeBtn = document.getElementById("create_dream_node_btn");
var createDreamBtn = document.getElementById("create_dream_btn");
var confirmBtn = document.getElementById("confirm_btn");
var prevDreamBtn = document.getElementById("prev_dream_btn");
var nextDreamBtn = document.getElementById("next_dream_btn");
var supportBtn = document.getElementById("support_btn");
var currentEditor = null;

function getNodeDataByDreamId(dream_id) {
    req.ajax(
        "http://127.0.0.1:3000/dream/" + dream_id + "/nodes",
        null,
        "get",
        function(data) {
            if (data.success) {
                var contentArea = document.getElementById("content_area");
                var content = "";
                var dreamTpl = '<div class="dream_header">' +
                    '<h1 class="title">{{ title }}</h1>' +
                    '<p class="desc">{{ description }}</p>' + 
                    '</div>' + 
                    '<div id="dream_area">';
                content += tools.template(dreamTpl, data.data);

                for (var i = 0, l = data.data.nodes.length; i < l; i++) {
                    var nodeTpl = "<div class='node'>{{ content }}</div>";
                    content += tools.template(tpl, data.data.nodes[i]);
                }

                contentArea.innerHTML = content;
            }
        },
        function() {
        }
    );
}

getNodeDataByDreamId(next_dream_ids[0]);

function checkAccount(callback) {
    return false;
}

var switch_state = false;

function switchDream(data, callback, show) {
    switch_state = true;
    var contentArea = document.getElementById("content_area");

    containerArea.className = "view";
    listArea.style.transition = "1s ease-in-out";
    var item_width = containerArea.offsetWidth;
    contentArea.style.width = item_width;
    listArea.style.width = item_width * 2;
    var newContentArea = contentArea.cloneNode(false);
    
    newContentArea.innerHTML = '<div class="dream_loading">loading...</div>';
    
    var dreamTpl = '<div class="dream_header">' +
        '<h1 class="title">{{ title }}</h1>' +
        '<p class="desc">{{ description }}</p>' + 
        '</div>' + 
        '<div id="dream_area"></div>';
    newContentArea.innerHTML = tools.template(dreamTpl, data);
    
    // 确定切换的方向
    var flag = "-";
    if (show == prev) flag = "";

    listArea.style.transform = "translate("+ flag + item_width +"px, 0)";
    listArea.appendChild(newContentArea);

    function updateTransition() {
        containerArea.removeAttribute("class");
        listArea.removeAttribute("style");
        listArea.removeChild(contentArea);
        newContentArea.removeAttribute("style");
        listArea.removeEventListener("transitionend", updateTransition, true);
        newContentArea = null;
        callback();
    }

    listArea.addEventListener("transitionend", updateTransition, true);
}

createDreamBtn.addEventListener("click", function() {
    var stepWin = new StepPopup({
        width: 400,
        direction: 'top',
        modal: true,
        steps: [
            {
                html: tools.template(dreamTpl, dream_tips)
            }
        ],
        onConfirm: function() {
            var stepCon = this.parentNode;
            var formData = {};
            var inputs = stepCon.querySelectorAll("input, textarea");
            for (var i = 0, l = inputs.length; i < l; i++) {
                var field = inputs[i];
                formData[field.name] = field.value;
            }
            req.ajax(
                "http://127.0.0.1:3000/dream/new",
                formData,
                "post",
                function(data) {
                    if (data.success) {
                        if (switch_state) return;
                        switchDream(formData, function() {
                           dream_index = 0;
                           dream_ids = [];
                           dream_titles = [];
                           dream_descs = [];
                           for (var i = 0, l = data.data.length; i < l; i++) {
                               dream_ids[i] = data.data[i]._id;
                               dream_titles[i] = data.data[i].title;
                               dream_descs[i] = data.data[i].description;
                           }
                           var json={time:new Date().getTime()};
                           window.history.pushState(json,"","/dream/" + dream_ids[dream_index]);
                           // 没有拉数据做什么？
                           // getNodeDataByDreamId(dream_ids[dream_index++]);
                           switch_state = false;
                       }, "next");
                    }
                },
                function() {
                
                }
            );
        }
    });
    stepWin.show();
}, false);

createDreamNodeBtn.addEventListener("click", function() {
    var dreamArea = document.getElementById("dream_area");
    var newDreamCon = document.createElement('div');
    newDreamCon.className = "node";
    dreamArea.insertBefore(newDreamCon, dreamArea.firstChild);
    currentEditor = newDreamCon;
    newDreamCon.setAttribute("contenteditable", true);
    newDreamCon.focus();
    confirmBtn.removeAttribute("class");
    newDreamCon = null;
}, false);

confirmBtn.addEventListener("click", function() {
    var $self = this;
    var content = currentEditor.innerHTML;
    var url = "http://127.0.0.1:3000/node/new";
    var dreamId = location.pathname.split("/")[2];
    var oMyForm = new FormData();
    oMyForm.append("dream", dreamId);
    oMyForm.append("content", content);

    function createXHR() {
        if (typeof XMLHttpRequest != "undefined") {
            return new XMLHttpRequest();
        }
    }

    var xhr = createXHR();

    function reqComplete() {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                var data = JSON.parse(xhr.responseText);
                if (!data.success) return;
                var tips = new Tips({
                    width: 100,
                    height: 28,
                    top: $self.offsetTop,
                    left: $self.offsetLeft,
                    direction: 'top',
                    modal: true
                });
                tips.show("创建成功!");
                confirmBtn.className = "none";
                currentEditor.removeAttribute("contentEditable");
                currentEditor = null;
                xhr.removeEventListener("load", reqComplete, false);
            }
        }
    }

    xhr.addEventListener("load", reqComplete, false);

    xhr.onerror = function(error) {
        error.call(this);
        xhr.onerror = null;
    }

    xhr.open("post", url, true);
    xhr.send(oMyForm);
}, false);

nextDreamBtn.addEventListener("click", function() {
    // 切换到下一个梦想
    if (dream_index < dream_ids.length) {
        if (switch_state) return;

        var json={time:new Date().getTime()};
        window.history.pushState(json,"","/dream/" + dream_ids[dream_index]);

        if (dream_index == dream_ids.length - 1) {
            req.ajax(
                "http://127.0.0.1:3000/dream/" + dream_ids[dream_index] + "/next",
                null,
                "get",
                function(data) {
                    if (data.success) {
                        // TODO 这里用并行异步请求
                        getNodeDataByDreamId(dream_ids[dream_index]);
                        dream_index = 0;
                        dream_ids = [];
                        dream_titles = [];
                        dream_descs = [];
                        for (var i = 0, l = data.data.length; i < l; i++) {
                            dream_ids[i] = data.data[i]._id;
                            dream_titles[i] = data.data[i].title;
                            dream_descs[i] = data.data[i].description;
                        }
                        switch_state = false;
                    }
                },
                function() {

                }
            );
        }else{
            switch_state = false;
        }

        var get_data_promise = new Promise(function(resolve, reject) {
            
        });
        var get_ids_promise = new Promise(function(resolve, reject) {
            getNodeDataByDreamId(dream_ids[dream_index], function(ids) {
                resolve(ids);
            });
        });
        Promise.all([get_data_promise, get_ids_promise]).then(function() {
            
        }, function() {});
        switchDream(function() {
        }, "next");
    }
}, false);

supportBtn.addEventListener("click", function() {
    // 支持下拉菜单
    var dropdown = new DropDown();
    dropdown.show();
}, false);

prevDreamBtn.addEventListener("click", function() {
    // 切换到下一个梦想
    if (dream_index < dream_ids.length) {
        var data = {
            title: dream_titles[dream_index],
            description: dream_descs[dream_index]
        };
        switchDream(data, function() {
            if (dream_index == dream_ids.length - 1) {
                req.ajax(
                    "http://127.0.0.1:3000/dream/" + dream_ids[dream_index] + "/next",
                    null,
                    "get",
                    function(data) {
                        if (data.success) {
                            var json={time:new Date().getTime()};
                            window.history.pushState(json,"","/dream/" + dream_ids[dream_index])
                            // TODO 这里用并行异步请求
                            getNodeDataByDreamId(dream_ids[dream_index]);
                            dream_index = 0;
                            dream_ids = [];
                            dream_titles = [];
                            dream_descs = [];
                            for (var i = 0, l = data.data.length; i < l; i++) {
                                dream_ids[i] = data.data[i]._id;
                                dream_titles[i] = data.data[i].title;
                                dream_descs[i] = data.data[i].description;
                            }
                            switch_state = false;
                        }
                    },
                    function() {

                    }
                );
            }else{
                var json={time:new Date().getTime()};
                window.history.pushState(json,"","/dream/" + dream_ids[dream_index]);
                // TODO 这里用并行异步请求
                getNodeDataByDreamId(dream_ids[dream_index++]);
                switch_state = false;
            }
        }, "prev");
    }
})

/////////////////////////////////////////////////////////////////////////

/*var startNode = contentArea.firstChild;
var currentNode = null;
var currentNodePos = 0;
var incPos = 0;
var max = 100;
var speed = 5;

// 添加循环动画
animation.addHandle('tick', function() {
    if (!startNode) return;
    if (!currentNode) {
        // get node
        var node = startNode;
        while (node.nodeType != 1) {
            node = node.nextSibling;
        }
        currentNode = node;
    }
    currentNodePos = parseInt(currentNode.style.bottom || 0);
    currentNodePos += Math.min(incPos, max);
    currentNode.style.bottom = currentNodePos + "px";
    incPos += speed;
    if (incPos >= max) {
        startNode = currentNode.nextSibling;
        currentNode = null;
        incPos = 0;
    }
});

animation.registerAnimation({
    action: "scroll"
});*/
