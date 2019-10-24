var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mongo Start
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
let db, collection;
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    if (err.toString().indexOf("ECONNREFUSED")) {
      console.log("\
        Cant connect to Mongodb\n\n\
        1) start it with :\n\
            sudo systemctl start mongodb \n\n\
        2) or install it with:\n\
            sudo apt install -y mongodb\
      ");
    } else {
      console.error(err);
    }
    return;
  }
  db = client.db('demo');
  collection = db.collection('users');
});
// Mongo End


app.post('/addname', (req, res) => {
  collection.insertOne(req.body,(err, result) => {
    if (err) {
      console.log('show warrning');
      res.status(400).send('unable to save to database');
    } else {
      res.send('item saved to database');
    }
  });
});

app.use('/', (req, res) => {
  res.sendFile('index.html', { root: __dirname });
});

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});