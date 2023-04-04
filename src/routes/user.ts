import { Router } from 'express'
import { getAllUser, createUser, getAUser, editUser, deleteUser } from '../controllers/userController'
import { adminPrivilege } from '../middleware/auth'

const user = Router()

user.use(adminPrivilege)
    .get('/', getAllUser)
    .get('/:id', getAUser)
    .post('/', createUser)
    .put('/:id', editUser)
    .delete('/:id', deleteUser)

export default user