function follow(fields) {
  fetch('/api/follow', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function following(fields) {
  fetch('/api/follow')
    .then(showResponse)
    .catch(showResponse);
}
