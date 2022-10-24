function viewAnxietyShieldStatus() {
    fetch(`/api/anxietyshield`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function togglePersonalAnxietyReason(fields) {
    fetch(`/api/anxietyshield`, { method: 'PATCH', body: JSON.stringify(fields), headers: { 'Content-Type': 'application/json' } })
      .then(showResponse)
      .catch(showResponse);
  }