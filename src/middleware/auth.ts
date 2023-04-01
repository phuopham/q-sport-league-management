import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { iUser } from '../utils/customType'
import { PrismaClient, Role } from '@prisma/client'
import { Err } from '../utils/errorCode'

const prisma = new PrismaClient()

type iMiddleware = (req: Request, res: Response, next: NextFunction) => Response | NextFunction | undefined

export const authMiddleware: iMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    const token = String(authorization).substring(7)

    if (!token) return res.status(400).json({
        msg: Err.NOTFOUND_TOKEN
    })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, log) => {
        if (err) return res.status(400).json({ msg: Err.INSUFFICIENT_TOKEN })
        const temp = log as iUser
        prisma.user.findFirstOrThrow({
            where: {
                id: temp.id
            }
        }).then((user) => {
            if (temp.role !== user.role) return res.status(400).json({ msg: Err.INSUFFICIENT_TOKEN })
            req.user = { id: user.id, username: user.username, email: user.email, role: user.role }
            return next()
        }).catch((error) => {
            console.log(error)
            return res.status(500).json({ msg: Err.SERVER_ERROR })
        })
    })
}

export const adminPrivilege: iMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    const token = String(authorization).substring(7)

    if (!token) return res.status(400).json({
        msg: Err.NOTFOUND_TOKEN
    })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, log) => {
        if (err) return res.status(400).json({ msg: Err.INSUFFICIENT_TOKEN })
        const temp = log as iUser
        prisma.user.findFirstOrThrow({
            where: {
                id: temp.id
            }
        }).then((user) => {
            if (temp.role === Role.ADMIN && user.role === Role.ADMIN) {
                req.user = { id: user.id, username: user.username, email: user.email, role: user.role }
                return next()
            }
            return res.status(400).json({ msg: Err.INSUFFICIENT_PRIVILEGE })
        }).catch((error) => {
            console.log(error)
            return res.status(500).json({ msg: Err.SERVER_ERROR })
        })
    })
}

export const operatorPrivilege: iMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers
    const token = String(authorization).substring(7)

    if (!token) return res.status(400).json({
        msg: Err.NOTFOUND_TOKEN
    })

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, log) => {
        if (err) return res.status(400).json({ msg: Err.INSUFFICIENT_TOKEN })
        const temp = log as iUser
        prisma.user.findFirstOrThrow({
            where: {
                id: temp.id
            }
        }).then((user) => {
            if (temp.role === Role.ADMIN && user.role === Role.ADMIN) {
                req.user = { id: user.id, username: user.username, email: user.email, role: user.role }
                return next()
            }
            return res.status(400).json({ msg: Err.INSUFFICIENT_PRIVILEGE })
        }).catch((error) => {
            console.log(error)
            return res.status(500).json({ msg: Err.SERVER_ERROR })
        })
    })
}