import { Router } from 'express'
import { getUsers, setUsers } from '../controllers/users'
const users = Router()

users
    .get('/', getUsers)
    .post('/', setUsers)

export default users