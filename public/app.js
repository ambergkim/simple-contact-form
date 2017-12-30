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