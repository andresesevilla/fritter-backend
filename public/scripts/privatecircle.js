/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 */

function createPrivateCircle(fields) {
    fetch('/api/privatecircles', { method: 'POST', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
        .then(showResponse)
        .catch(showResponse);
}

function deletePrivateCircle(fields) {
    fetch(`/api/privatecircles/${fields.name}`, { method: 'DELETE' })
        .then(showResponse)
        .catch(showResponse);
}

function viewPrivateCircle(fields) {
    fetch(`/api/privatecircles/${fields.name}`)
        .then(showResponse)
        .catch(showResponse);
}

function viewPrivateCircles(fields) {
    fetch(`/api/privatecircles`)
        .then(showResponse)
        .catch(showResponse);
}

function updatePrivateCircle(fields) {
    fetch(`/api/privatecircles/${fields.name}`, { method: 'PATCH', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' }})
        .then(showResponse)
        .catch(showResponse);
}