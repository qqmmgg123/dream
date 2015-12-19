var settings = require("./settings")()
    , Dream = require("./models/dream")
    , Node = require("./models/node")
    , log = require('util').log;

module.exports = function(app) {
    app.param(function(name, fn){
        if (fn instanceof RegExp) {
            return function(req, res, next, val){
                var captures;
                if (captures = fn.exec(String(val))) {
                    req.params[name] = captures;
                    next();
                } else {
                    next('route');
                }
            }
        }
    });

    app.param('id', /^[a-z0-9]+$/);

    // 主页
    app.get('/', function(req, res) {
        /*Dream.findOne({}, {}, {
            sort: {'date' : -1}
        }, 
        function(err, result) {
            res.render('index', {
                title: settings.APP_NAME,
                dream: result,
                success: 1
            })
        });*/

        Dream.find({}, {}, {
            sort: {'date': -1},
            limit: 10
        }, function(err, result) {
            if (err) throw new Error(err);

            var listData = result;

            res.render('index', {
                title: settings.APP_NAME,
                data: listData,
                success: 1
            });
        });
    });

    // 梦想页
    app.get('/dream/:id', function(req, res) {
        var curId = req.originalUrl.split('/')[2];

        console.log(curId);

        Dream.find({_id: {$lte: curId}}, {}, {
            sort: {'date': -1},
            limit: 10
        }, function(err, result){
            if (err) throw new Error(err);

            listData = result;
            
            res.render('index', {
                title: settings.APP_NAME,
                data: listData,
                success: 1
            });
        });
    });

    // 前一批梦想
    app.get('/dream/:id/next', function(req, res) {
        var curId = req.originalUrl.split('/')[2];

        Dream.find({_id: {$lt: curId}}, {}, {
            sort: {'date': -1},
            limit: 10
        }, function(err, result){
            if (err) throw new Error(err);

            var listData = result;
            
            res.json({
                data: listData,
                success: 1
            });
        });
    });

    // 保存一个梦想
    app.post('/dream/new', function(req, res) {
        var dream = new Dream({
            title: req.body.title,
            description: req.body.description
        });

        dream.save(function(err) {
            if (err) throw new Error(err);

            Dream.find({}, {}, {
                sort: {'date': -1},
                limit: 10
            }, function(err, result) {
                if (err) throw new Error(err);

                var listData = result;

                res.json({
                    data: listData,
                    success: 1
                });
            });
        });
    });

    // 梦想节点
    app.get('/dream/:id/nodes', function(req, res) {
        var dreamId = req.originalUrl.split('/')[2];
        Dream.findOne({_id: dreamId}, function(err, dream) {
            if (err) throw new Error(err);
        }).populate({
            path: 'nodes',
            options: {
                sort: {'date': -1},
                limit: 20
            }
        }).exec(function(err, dreams) {
            res.json({
                data: dreams.nodes,
                success: 1
            });
        });;
    });

    // 保存一个梦想节点
    app.post('/node/new', function(req, res) {
        var dreamId = req.body.dream;
        var dreamClass = Dream.findOne({_id: dreamId}, function(err, dream) {
            if (err) throw new Error(err);

            var node = new Node({
                _belong: dream._id,
                content: req.body.content
            });

            node.save(function(err) {
                if (err) throw new Error(err);

                dream.nodes.push(node);
                dream.save(function(err) {
                    if (err) throw new Error(err);
                    
                    dreamClass.populate({
                        path: 'nodes'
                    }).exec(function(err, dreams) {
                        res.json({
                            data: dreams.nodes,
                            success: 1
                        });
                    });
                });
            });
        });
    });
}
