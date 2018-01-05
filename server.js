'use strict';

const cool = require('cool-ascii-faces');//for heroku tests
const pg = require('pg');
const express = require('express');
const bp = require('body-parser');

const PORT = process.env.PORT || 3000;
const app = express();

const conString = 'postgres://amgranad:amber123@localhost:5432/cf301';

const client = new pg.Client(conString);

client.connect();

app.use(bp.json());
app.use(bp.urlencoded({extended: true}));
app.use(express.static('./public'));

//cool ascii test for heroku
app.get('/cool', function(request, response) {
  response.send(cool());
});

//heroku db
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM test_table', function(err, result) {
      done();
      if (err)
       { console.error(err); response.send("Error " + err); }
      else
       { response.render('pages/db', {results: result.rows} ); }
    });
  });
});

app.get('/', (request, response) => {
  response.sendFile('index.html', {root: './public'});
});

app.get('/account', (request, response) => {
  response.sendFile('account.html', {root: './public'});
});

app.get('/contacts', (request, response) => {
  client.query(`
    SELECT * FROM contacts;
    `
  ).then(function(results){
    response.send(results.rows);
  }).catch(err => {
    console.error(err);
  });
});

app.post('/contacts', function(request, response) {
  const contact = request.body;
  client.query(
    `INSERT INTO contacts
    (name, email, message)
    VALUES ('${contact.name}', '${contact.email}', '${contact.message}');
    `
  ).then(function() {
    response.send('insert complete');
  }).catch(err => {
    console.error(err);
  });
});

app.put('/contacts/:id', (request, response) => {
  client.query(
    `UPDATE contacts
    SET name=$1, email=$2, message=$3
    WHERE id=$4;
    `,
    [
      request.body.name,
      request.body.email,
      request.body.message,
      request.params.id
    ]
  )
    .then(() => {
      response.send('update complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete('/contacts/:id', (request, response) => {
  console.log('delete id: ' + request.params.id);
  client.query(
    `DELETE FROM contacts WHERE id=$1;`,
    [request.params.id]
  )
    .then(() => {
      response.send('Delete complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.listen(PORT, function() {
  console.log(`server started on: ${PORT}`);
});

function loadDB() {
  client.query(`
    CREATE TABLE IF NOT EXISTS
    contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      message TEXT
    );`
  )
    .catch(err => {
      console.error(err)
    });
}

loadDB();