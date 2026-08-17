function endpointFor(domain, path) {
  const origin = domain === 'lark' ? 'https://open.larksuite.com' : 'https://open.feishu.cn';
  return new URL(path, origin);
}

async function jsonResponse(response, operation) {
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error(`${operation} returned a non-JSON response`);
  }
  if (!response.ok || body?.code !== 0) {
    throw new Error(`${operation} failed: ${body?.msg || `HTTP ${response.status}`}`);
  }
  return body;
}

/** Validate freshly provisioned credentials and read the bot identity. */
export async function verifyFeishuApp({
  appId,
  appSecret,
  domain = 'feishu',
  fetchImpl = fetch,
  timeoutMs = 15000,
}) {
  if (!appId || !appSecret) throw new Error('Feishu credentials are incomplete');
  const tokenResponse = await fetchImpl(endpointFor(domain, '/open-apis/auth/v3/tenant_access_token/internal'), {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ app_id: appId, app_secret: appSecret }),
    signal: AbortSignal.timeout(timeoutMs),
  });
  const tokenBody = await jsonResponse(tokenResponse, 'Feishu authentication');
  if (!tokenBody.tenant_access_token) {
    throw new Error('Feishu authentication returned no tenant access token');
  }

  const botResponse = await fetchImpl(endpointFor(domain, '/open-apis/bot/v3/info/'), {
    headers: { authorization: `Bearer ${tokenBody.tenant_access_token}` },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const botBody = await jsonResponse(botResponse, 'Feishu bot verification');
  const bot = botBody.bot ?? {};
  return Object.freeze({
    appId,
    name: bot.app_name ?? bot.bot_name ?? null,
    openId: bot.open_id ?? null,
    activated: bot.activate_status ?? null,
  });
}
