import { Router } from 'express'
import { addPlayer, deletePlayer, editPlayer, getAPlayer, getAllPlayer, } from '../controllers/playerController'
import { authMiddleware, operatorPrivilege } from '../middleware/auth'

const player = Router()

player.use(authMiddleware)
    .get('/', getAllPlayer)

player.use(operatorPrivilege)
    .post('/', addPlayer)
    .get('/:id', getAPlayer)
    .put('/:id', editPlayer)
    .delete('/:id', deletePlayer)

export default player