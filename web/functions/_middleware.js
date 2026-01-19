export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (url.pathname === '/counter/get') {
    return handleCounterGet(env);
  }

  if (url.pathname === '/counter/hit') {
    return handleCounterHit(env, request);
  }

  return context.next();
}

async function handleCounterGet(env) {
  try {
    const count = await env.TETHER_STORAGE.get('visitor_count');
    const value = count ? parseInt(count) : 0;

    return new Response(JSON.stringify({ value }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, value: 0 }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}

async function handleCounterHit(env, request) {
  try {
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ipKey = `ip_${ip}`;

    const lastVisit = await env.TETHER_STORAGE.get(ipKey);
    const now = Date.now();

    if (lastVisit && (now - parseInt(lastVisit)) < 3600000) {
      const count = await env.TETHER_STORAGE.get('visitor_count');
      const currentValue = count ? parseInt(count) : 0;

      return new Response(JSON.stringify({ value: currentValue, cached: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const count = await env.TETHER_STORAGE.get('visitor_count');
    const currentValue = count ? parseInt(count) : 0;
    const newValue = currentValue + 1;

    await env.TETHER_STORAGE.put('visitor_count', newValue.toString());
    await env.TETHER_STORAGE.put(ipKey, now.toString(), { expirationTtl: 3600 });

    return new Response(JSON.stringify({ value: newValue }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, value: 0 }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
}
