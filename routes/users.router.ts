import { Router } from 'express'
import { getUsers, setUsers } from './users.controller'
const users = Router()

users
    .get('/', getUsers)
    .post('/', setUsers)

export default users