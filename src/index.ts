import { Application } from 'express'
import dotenv from 'dotenv';
import App from './app'
import { iUser } from './controllers/profileController';
dotenv.config();

const port: number = + (process.env.PORT ?? 3000)

declare global {
    namespace Express {
        interface Request {
            user: iUser;
        }
    }
}

const main = async () => {
    const app = new App(port);
    app.listen();

}

main()

