import { Router } from 'express'
import profile from './profile/profile'
import signin from './profile/signin'
import user from './user'

const v1 = Router()

v1.use('/signin', signin)
v1.use('/profile', profile)
v1.use('/users', user)

export default v1