// Proxy to Google Apps Script — URL is kept server-side as an environment variable.
// Set APPS_SCRIPT_URL in Netlify → Site configuration → Environment variables.

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const url = process.env.APPS_SCRIPT_URL;
  if (!url) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfigured — APPS_SCRIPT_URL not set.' }) };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: event.body,
      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
    });
    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Could not reach backend.' }),
    };
  }
};
