var express = require('express');
var cors =  cors = require('cors');
var MongoClient = require('mongodb').MongoClient;
var request = require('request');
var schedule = require('node-schedule');

var app = express();

app.use(cors());

function updateDB() {
	request({
		  url: 'http://api.football-data.org/v1/soccerseasons',
		  headers: {
		    'X-Auth-Token': '6fc9733b6645454bb6dc7f663db40e45'
		  }
		}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var seasons = JSON.parse(body);
	    MongoClient.connect('mongodb://localhost:27017/ultrabet', function(err, db) {
		    var leagues = db.collection('leagues');
		    var fixtures = db.collection('fixtures');
		    leagues.remove({});
		    leagues.insert(seasons);
		    leagues.find().toArray(function(err, docs) {
		    	fixtures.remove({});
		    	docs.forEach(function(val){
		    		request({
						  url: 'http://api.football-data.org/v1/soccerseasons/' + val.id + '/fixtures',
						  headers: {
						    'X-Auth-Token': '6fc9733b6645454bb6dc7f663db40e45'
						  }
					  }, function(error, response, body) {
								var season = {}
								season.id = val.id;
								season.fixtures = JSON.parse(body);  
						  	fixtures.insert(season);
		        	});
		    	});
		    	console.log('Export done');
		    });
		});    
	  }
	});
}

var rule = new schedule.RecurrenceRule();
rule.minute = 59;
rule.second = 59;
var j = schedule.scheduleJob(rule, function(){
  var exportTime = new Date();
  var exportTimeFormatted = exportTime.getHours() + ":" + exportTime.getMinutes() + ":" + exportTime.getSeconds();

	console.log('Export begin at: ', exportTimeFormatted);
	updateDB();
});

app.get('/leagues', function (req, res) {
	MongoClient.connect('mongodb://localhost:27017/ultrabet', function(err, db) {
	    var collection = db.collection('leagues');
	    collection.find().toArray(function(err, docs) {
	        res.send(docs);
	    });
	});    
});

app.get('/fixtures/:id', function (req, res) {
	var leagueId = req.params.id;   
	MongoClient.connect('mongodb://localhost:27017/ultrabet', function(err, db) {
	    var collection = db.collection('fixtures');
	    var name = 'id';
			var value = parseInt(leagueId);
			var query = {};
			query.id = value;

	    collection.find(query).toArray(function(err, docs) {
	        res.send(docs[0]);
	    });
	});  
});

updateDB();

app.use(express.static('app'));

app.listen(3000, function(){
    console.log('Express server listening on port 3000');
});
