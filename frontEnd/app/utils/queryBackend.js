async function postBackend(address, body) {
  const response = await fetch(
    process.env.REACT_APP_API_ADDRESS + address,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: body,
    },
  );
  const jsonResponse = await response.json();
  if (!response.ok) {
    alert(
      jsonResponse.error.status +
        ': ' +
        jsonResponse.error.title +
        '\n' +
        jsonResponse.error.message,
    );
    return false;
  } else {
    return jsonResponse;
  }
}