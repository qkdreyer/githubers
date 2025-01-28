async function exchangeCode(code, redirect_uri) {
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Encoding': 'application/json',
    }),
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri,
      code,
    })
  })
  const { access_token } = response.status === 200 ? await response.json() : await response.text()
  return access_token
}

export async function GET(request, _context) {
  const url = new URL(request.url)
  const params = url.searchParams
  if (!params.has('code'))
    return new Response('Not Found', { status: 404 })

  const token = await exchangeCode(params.get('code'), url.origin + url.pathname)
  return new Response(`<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="refresh" content="0;url=\'%1$s\'" />

        <title>Redirecting to %1$s</title>
    </head>
    <body>
        Redirecting to <a href="%1$s">%1$s</a>.
    </body>
</html>`.replaceAll('%1$s', `${url.origin}?${new URLSearchParams({
  token: token,
  ...(params.has('state') && Object.fromEntries(new URLSearchParams(window.atob(params.get('state'))).entries())),
})}`), { headers: new Headers({
    'Content-Type': 'text/html',
  })})
}
