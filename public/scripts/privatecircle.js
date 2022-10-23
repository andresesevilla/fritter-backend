function createPrivateCircle(fields) {
    fetch('/api/privatecircles', { method: 'POST', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
        .then(showResponse)
        .catch(showResponse);
}