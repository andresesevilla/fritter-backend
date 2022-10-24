/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

function createUser(fields) {
  fetch('/api/users', { method: 'POST', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
    .then(showResponse)
    .catch(showResponse);
}

function changePassword(fields) {
  fetch('/api/users', { method: 'PUT', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
    .then(showResponse)
    .catch(showResponse);
}

function signIn(fields) {
  fetch('/api/users/session', { method: 'POST', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
    .then(showResponse)
    .catch(showResponse);
}

function signOut() {
  fetch('/api/users/session', { method: 'DELETE' })
    .then(showResponse)
    .catch(showResponse);
}

function viewAnxietyShieldStatus() {
  fetch(`/api/users/anxietyshield`)
    .then(showResponse)
    .catch(showResponse);
}

function toggleAnxietyShieldStatus() {
  fetch(`/api/users/anxietyshield`, { method: 'PUT' })
    .then(showResponse)
    .catch(showResponse);
}

function viewBriefingModeStatus() {
  fetch(`/api/users/briefingmode`)
    .then(showResponse)
    .catch(showResponse);
}

function toggleBriefingModeStatus() {
  fetch(`/api/users/briefingmode`, { method: 'PUT' })
    .then(showResponse)
    .catch(showResponse);
}

function setBriefingSize(fields) {
  fetch(`/api/users/briefingmode`, { method: 'PATCH', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
    .then(showResponse)
    .catch(showResponse);
}

function togglePersonalAnxietyReason(fields) {
  fetch(`/api/users/anxietyshield`, { method: 'PATCH', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
    .then(showResponse)
    .catch(showResponse);
}