// netlify/functions/patreon-profile.js

exports.handler = async function(event) {
  const token = event.headers.authorization?.split("Bearer ")[1];
  if (!token) {
    return { statusCode: 400, body: "Missing token" };
  }

  try {
    const res = await fetch("https://www.patreon.com/api/oauth2/v2/identity?fields[user]=image_url,full_name", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch Patreon profile", details: err.message })
    };
  }
};
