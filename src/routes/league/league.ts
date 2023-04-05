import { Router } from 'express'
import { getAllMatchesInLeague, getAMatchInLeague } from '../../controllers/matchController'
import { getAllTeamInLeague, getATeamInLeague } from '../../controllers/teamController'
import { adminPrivilege, authMiddleware, operatorPrivilege } from '../../middleware/auth'

const league = Router()

league.use(authMiddleware)
    // .get('/groups/',groupsInLeague)
    // .get('/groups/:id',groupInLeague)
    .get('/matches', getAllMatchesInLeague)
    .get('/matches/:id', getAMatchInLeague)
    .get('/teams/', getAllTeamInLeague)
    .get('/teams/:id', getATeamInLeague)

league.use(operatorPrivilege)
// .post('/teams',)
// .put('/teams/:id',)
// .delete('/teams/:id', )


export default league