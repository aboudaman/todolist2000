const jsonServer = require('json-server')

const server = jsonServer.create()

const middlewares = jsonServer.defaults({
    static: './build'
})

const router = jsonServer.router('db.json')

server.use(middlewares)
server.use(router)
const port = process.env.Port || 4000
server.listen(port, () => {
    console.log(`JSON Server is running on port ${port}`)
})