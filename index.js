const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('./codigo/public/db/db.json')
const middlewares = jsonServer.defaults({ static: './codigo/public' })

server.use(middlewares)
server.use(router)

server.listen(3000, () => {
  console.log(`JSON Server is running em http://localhost:3000`)
})