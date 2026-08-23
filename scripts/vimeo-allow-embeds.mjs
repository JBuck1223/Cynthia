/**
 * Allow course embeds on cynthiamusic.com and localhost.
 *
 * Create a token at https://developer.vimeo.com/apps
 * Scopes: private, edit
 *
 *   VIMEO_ACCESS_TOKEN=xxxxx npm run vimeo:allow-embeds
 */
const IDS = [
  '539393476', '539393586', '539393635', '539394653', '539395221',
  '539395810', '539418710', '539398343', '539400379', '539400829',
  '539415272', '539415613', '539415680', '539416361', '539416510',
  '539397097', '539419588', '539419623', '539419658', '539419714',
  '539419816', '539419918', '539420038', '539420387', '539424160',
  '539420484', '539421922', '539423429',
]

const DOMAINS = ['cynthiamusic.com', 'www.cynthiamusic.com', 'localhost']

const token = process.env.VIMEO_ACCESS_TOKEN
if (!token) {
  console.error('Set VIMEO_ACCESS_TOKEN. https://developer.vimeo.com/apps — scopes: private, edit')
  process.exit(1)
}

async function api(method, path, body) {
  const res = await fetch(`https://api.vimeo.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.vimeo.*+json;version=3.4',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(`${method} ${path} ${res.status} ${text.slice(0, 300)}`)
  }
  return text ? JSON.parse(text) : null
}

async function allow(id) {
  await api('PATCH', `/videos/${id}`, { privacy: { embed: 'whitelist' } })
  for (const domain of DOMAINS) {
    await api('PUT', `/videos/${id}/privacy/domains/${domain}`)
  }
  console.log('ok', id)
}

const me = await api('GET', '/me')
console.log('Vimeo user', me.name || me.uri)

for (const id of IDS) {
  try {
    await allow(id)
  } catch (err) {
    console.error('fail', id, err.message)
  }
}
