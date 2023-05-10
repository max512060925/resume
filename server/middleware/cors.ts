export default defineEventHandler(event => {
  const origin = getRequestHeaders(event).origin || ''
  if (/maxwinnie.xyz/.test(origin)) {
    if (getMethod(event) === 'OPTIONS') {
      setResponseHeaders(event, {
        'Access-Control-Allow-Methods':
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers':
          'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',
        'Access-Control-Expose-Headers': '*',
        'Access-Control-Max-Age': 600,
      })
      return (event.node.res.statusCode = 204)
    }
    setResponseHeaders(event, {
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers':
        'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE',
      'Access-Control-Expose-Headers': '*',
    })
  }
})
