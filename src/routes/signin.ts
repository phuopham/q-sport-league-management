import { Router } from 'express'
import { signInController, signUpController } from '../controllers/signInController'

const signin = Router()

signin
    .post('/', signInController)
    .post('/new', signUpController)

export default signin