function follow(fields) {
  fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function following(fields) {
  fetch(`/api/follows?followerId=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}