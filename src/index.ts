import { Application } from 'express'
import dotenv from 'dotenv';
import App from './app'
dotenv.config();

const port: number = + (process.env.PORT ?? 3000)

const main = async () => {
    const app = new App(port);
    app.listen();

}

main()

