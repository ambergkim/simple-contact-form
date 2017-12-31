'use strict';

$('#contact-form').on('submit', function(e) {
  e.preventDefault();
  console.log('submission detected');
  let name = $('#name').val();
  let email = $('#email').val();
  let message = $('#message').val();
  $.post('/contacts', {
    name,
    email,
    message
  }).then(results => {
    console.log('post results', results);
  });
});

function loadContacts() {
  $('#contacts').empty();
  $.get('/contacts').then(results => {
    $.each(results, function(index, value) {
      $.each(value, function(key, item) {
        $('#contacts').append('<div>').append(item);
      });
    });
  });
}

$('#load-contacts').on('click', loadContacts);

function updateContacts(id, name, email, message) {
  $.ajax({
    url: `/contacts/${id}`,
    method: 'PUT',
    data: {
      name: `${name}`,
      email: `${email}`,
      message: `${message}`
    }
  }).then(data => {
    console.log('put data: ' + data);
  });
}

$('#update-contacts').on('submit', function(e) {
  e.preventDefault();
  updateContacts($('#id').val(), $('#name').val(), $('#email').val(), $('#message').val());
});

function deleteContact(id) {
  $.ajax({
    url: `/contacts/${id}`,
    method: 'DELETE'
  }).then(data => {
    console.log(data);
  });
}

$('#delete-contact').on('submit', function(e) {
  console.log('delete attempt detected');
  e.preventDefault();
  deleteContact($('#delete-id').val());
});