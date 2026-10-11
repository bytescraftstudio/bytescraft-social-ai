export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  // Read client credentials from environment variables
  const clientId = process.env.LINKEDIN_CLIENT_ID || '77d70wiqbu6mmk';
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET || '';
  const redirectUri = req.headers.host.includes('localhost')
    ? `http://${req.headers.host}/api/auth/linkedin-callback`
    : `https://${req.headers.host}/api/auth/linkedin-callback`;

  if (!clientSecret) {
    // If no secret in env, show the code to user so they can use it
    const html = `
      <!DOCTYPE html>
      <html><head><title>LinkedIn Auth</title>
      <style>
        body { font-family: system-ui; background: #0a0a1a; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; max-width: 500px; text-align: center; }
        .code { background: rgba(99,102,241,0.2); border: 1px solid #6366f1; border-radius: 8px; padding: 1rem; word-break: break-all; font-family: monospace; margin: 1rem 0; cursor: pointer; }
        .btn { background: #6366f1; color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; margin-top: 1rem; }
        h2 { color: #818cf8; }
      </style></head>
      <body><div class="card">
        <h2>✅ LinkedIn Connected!</h2>
        <p>Authorization code received. Copy this code and paste it in your app settings:</p>
        <div class="code" onclick="navigator.clipboard.writeText('${code}')" title="Click to copy">${code}</div>
        <p style="color: #94a3b8; font-size: 0.85rem;">Click the code above to copy it</p>
        <button class="btn" onclick="window.close()">Close Window</button>
      </div></body></html>
    `;
    return res.setHeader('Content-Type', 'text/html').status(200).send(html);
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret
      })
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.access_token) {
      // Success! Show the token to the user
      const html = `
        <!DOCTYPE html>
        <html><head><title>LinkedIn Connected!</title>
        <style>
          body { font-family: system-ui; background: #0a0a1a; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
          .card { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; max-width: 600px; text-align: center; }
          .token { background: rgba(34,197,94,0.15); border: 1px solid #22c55e; border-radius: 8px; padding: 1rem; word-break: break-all; font-family: monospace; margin: 1rem 0; font-size: 0.8rem; cursor: pointer; }
          .btn { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; margin-top: 1rem; }
          h2 { color: #22c55e; }
          .info { color: #94a3b8; font-size: 0.85rem; }
        </style></head>
        <body><div class="card">
          <h2>🎉 LinkedIn Successfully Connected!</h2>
          <p>Your access token (valid for 60 days):</p>
          <div class="token" onclick="navigator.clipboard.writeText('${tokenData.access_token}')" title="Click to copy">${tokenData.access_token}</div>
          <p class="info">Click the token to copy, then paste it in your BytesCraft Social AI app settings.</p>
          <p class="info">Expires in: ${tokenData.expires_in ? Math.floor(tokenData.expires_in / 86400) + ' days' : 'N/A'}</p>
          <script>
            // Auto-save token to localStorage if opened from same origin
            try {
              if (window.opener) {
                window.opener.postMessage({ type: 'LINKEDIN_TOKEN', token: '${tokenData.access_token}' }, '*');
              }
            } catch(e) {}
          </script>
          <button class="btn" onclick="navigator.clipboard.writeText('${tokenData.access_token}'); this.textContent='Copied!'">Copy Token</button>
        </div></body></html>
      `;
      return res.setHeader('Content-Type', 'text/html').status(200).send(html);
    } else {
      return res.status(400).json({ error: 'Token exchange failed', details: tokenData });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
