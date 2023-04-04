import { Router } from 'express'
import { addLeague, deleteLeague, editLeague, getALeague, getAllLeague, } from '../../controllers/leagueController'
import { adminPrivilege, authMiddleware, operatorPrivilege } from '../../middleware/auth'

const leagues = Router()

leagues.use(authMiddleware)
    .get('/', getAllLeague)
    .get('/:id', getALeague)

leagues.use(operatorPrivilege)
    .post('/', addLeague)
    .put('/:id', editLeague)
    .delete('/:id', deleteLeague)


export default leagues