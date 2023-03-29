import { Router } from 'express'
import { signInController, signUpController } from '../controllers/profileController'
import { authMiddleware } from '../middleware/auth'

const signin = Router()

signin
    .post('/', signInController)
    .post('/new', authMiddleware, signUpController)

export default signin