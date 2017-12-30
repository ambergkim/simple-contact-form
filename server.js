'use strict';

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

app.get('/', (request, response) => {
  response.sendFile('index.html', {root: './public'});
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

app.get('/contacts/:id', (request, response) => {
  client.query(`
    SELECT * FROM contacts WHERE id=${request.params.id};
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

app.put('/contacts/update/:id', (request, response) => {
  client.query(
    `UPDATE contacts
    SET
      name=$1, email=$2, message=$3;
    `,
    [
      request.body.name,
      request.body.email,
      request.body.message,
    ]
  )
    .then(() => {
      response.send('update complete')
    })
    .catch(err => {
      console.error(err);
    });
});

app.delete('/contacts/delete/:id', (request, response) => {
  console.log('delete id: ' + request.params.id);
  client.query(
    `DELETE FROM contacts WHERE id=${request.params.id};`
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