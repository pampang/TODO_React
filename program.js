var express = require('express');
var app = express();
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var DOM = React.DOM;
var body = DOM.body;
var div = DOM.div;
var script = DOM.script;

var browserify = require('browserify');
var babelify = require('babelify');

app.set('port', (process.argv[2] || 3000));
app.set('view engine', 'jsx');
app.set('views', __dirname + '/views');
app.engine('jsx', require('express-react-views').createEngine({ transformViews: false }));

require('babel/register')({
    ignore: false
});

var TodoBox = require('./views/index.jsx');

app.use('/bundle.js', function (req, res) {
    res.setHeader('content-type', 'application/javascript');

    // 用browserify来打包app.js这个浏览器端的文件
    // transform转换react和es2015的js语言
    browserify({debug: true})
        .transform(babelify.configure({
            presets: ['react', 'es2015']
        }))
        .require('./app.js', {entry: true})
        .bundle()
        .pipe(res);
});

var data = [
    {
        title: 'Shopping',
        detail: 'Milk'
    },
    {
        title: 'Hair cut',
        detail: '13:00'
    }
]

app.use('/', function (req, res) {
    var initialData = JSON.stringify(data);
    var markup = ReactDOMServer.renderToString(React.createElement(TodoBox, {data: data}));

    res.setHeader('Content-Type', 'text/html');

    var html = ReactDOMServer.renderToStaticMarkup(body(null, div({id: 'app', dangerouslySetInnerHTML: {__html: markup}}),
        script({
            id: 'initial-data',
            type: 'text/plain',
            'data-json': initialData
        }),
        // 上方通过browserify生成了bundle.js
        script({src: '/bundle.js'})
        ));

    res.end(html);
})

app.listen(app.get('port'), function() {});