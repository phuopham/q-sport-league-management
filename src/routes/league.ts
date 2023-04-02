import { Router } from 'express'
import { addLeague, deleteLeague, editLeague, getALeague, getAllLeague, } from '../controllers/leagueController'
import { adminPrivilege, authMiddleware, operatorPrivilege } from '../middleware/auth'

const user = Router()

user.use(authMiddleware)
    .get('/', getAllLeague)

user.use(operatorPrivilege)
    .post('/', addLeague)
    .get('/:id', getALeague)
    .put('/:id', editLeague)
    .delete('/:id', deleteLeague)

export default user