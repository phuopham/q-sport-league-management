import { Router } from 'express'
import { editProfile, getProfile } from '../controllers/profileController'
import { authMiddleware } from '../middleware/auth'

const profile = Router()

profile
    .use(authMiddleware)
    .get('/', getProfile)
    .post('/', editProfile)

export default profile