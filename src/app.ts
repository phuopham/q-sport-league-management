import express, { Application } from 'express'
import cors = require('cors')
import bodyParser = require('body-parser')
import http from 'http'

import signin from './routes/profile/signin'
import profile from './routes/profile/profile'
import user from './routes/user'

export default class App {
    private app: Application

    constructor(private port: number) {
        this.app = express()
        this.setting()
        this.middleware()
        this.router()
    }
    setting() {
        this.app.set('port', this.port)
    }
    router() {
        this.app.use('/signin', signin)
        this.app.use('/profile', profile)
        this.app.use('/users', user)
    }
    middleware() {
        // this.app.use(json())
        this.app.use(bodyParser.urlencoded({ extended: false }))
        this.app.use(bodyParser.json())
        this.app.use(cors())
    }
    async listen() {
        const server = http.createServer(this.app)
        await server.listen(this.app.get('port'))
        console.log(`[INFO] Server is running on port:`, this.app.get('port'))
    }
}
