import { Router } from 'express'
import { addTeam, deleteTeam, editTeam, getATeam, getAllTeam, } from '../controllers/teamController'
import { adminPrivilege, authMiddleware, operatorPrivilege } from '../middleware/auth'

const team = Router()

team.use(authMiddleware)
    .get('/', getAllTeam)

team.use(operatorPrivilege)
    .post('/', addTeam)
    .get('/:id', getATeam)
    .put('/:id', editTeam)
    .delete('/:id', deleteTeam)

export default team