var express = require('express');
var cors = require('cors');
var app = express();
var bodyParser = require('body-parser');
var pleer = require('pleer');
var BillBoard = require('billboard-hot-100');

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

var port = process.env.PORT || 8080;
var router = express.Router();

router.get('/', function(req, res) {
    res.json({
        message: 'YO!'
    });
});

router.get('/billboard', function(req, res) {
    BillBoard.init().then(function(billboard){
      songs = billboard.getAllSongs()
      arr = []
      for(i = 0; i < songs.length; i++)
         arr.push(songs[i].name)
      res.json(arr);
  }).catch(function(err){
      console.log(err);
  });
});

// Get tracks
router.route('/search').post(function(req, res) {
    pleer.search(req.body.query, function(err, response) {
        if (!err)
            console.log(req.body.query);
        res.json(response.tracks);
    });
});

// Get track information
router.route('/info/:track_id').get(function(req, res) {
    pleer.getInfo(req.params.track_id, function(err, response) {
        res.json(response.data);
    });
});

// Get download url
router.route('/download/:track_id').get(function(req, res) {
    pleer.getUrl(req.params.track_id, function(err, response) {
        res.json(response.url);
    });
});

app.use('/api', router);
app.listen(port);
console.log('Magic happens on port ' + port);
