function createFollow(fields) {
  fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
  fetch('/api/follows', {method: 'DELETE', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowsByFollower(fields) {
  fetch(`/api/follows?followerId=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowsByFollowee(fields) {
  fetch(`/api/follows?followeeId=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowByUsernames(fields) {
  fetch(`/api/follows?followerId=${fields.follower_username}&followeeId=${fields.followee_username}`)
    .then(showResponse)
    .catch(showResponse);
}