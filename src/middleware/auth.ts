import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { iUser } from '../controllers/profileController'
import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    const token = String(authorization).substring(7)

    if (!token) return res.status(400).json({
        msg: 'Empty token provide!'
    })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, log) => {
        if (err) return res.status(400).json({ msg: 'Unauthorized access!' })
        const temp = log as iUser
        const user = prisma.user.findFirstOrThrow({
            where: {
                id: temp.id
            }
        }).then((user) => {
            if (temp.role !== user.Role) res.status(400).json({ msg: 'Invalid access token!' })
            req.user = { id: user.id, username: user.username, email: user.email, role: user.Role }
            next()
        }).catch((error) => {
            console.log(error)
            res.status(500).json({ msg: 'Internal server error!' })
        })
    })
}