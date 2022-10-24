function createFollow(fields) {
  fetch('/api/follows', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFollow(fields) {
  fetch(`/api/follows/${fields.username}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowsByFollower(fields) {
  fetch(`/api/follows?followerUsername=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowsByFollowee(fields) {
  fetch(`/api/follows?followeeUsername=${fields.username}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewFollowByUsernames(fields) {
  fetch(`/api/follows?followerUsername=${fields.follower_username}&followeeUsername=${fields.followee_username}`)
    .then(showResponse)
    .catch(showResponse);
}