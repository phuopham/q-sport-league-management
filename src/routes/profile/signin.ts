import { Router } from 'express'
import { signInController, signUpController } from '../../controllers/profileController'
import { authMiddleware } from '../../middleware/auth'

const signin = Router()

signin
    .post('/', signInController)
// init only 
//  .post('/new', signUpController)

export default signin