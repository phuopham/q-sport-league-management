import { Request, Response } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import { compareSync, hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Err } from '../utils/errorCode';

const prisma = new PrismaClient();

export interface iUser {
    id: number,
    username: string,
    email: string
    role: Role
}

export const signInController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ msg: Err.NOTFOUND_USER })
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: email
            },
        })
        const profile: iUser = { id: user.id, username: user.username, email: user.email, role: user.Role }
        console.log(user)
        console.log(profile)
        if (!user) return res.status(400).json({ msg: Err.INVALID_USER })
        if (!compareSync(password, user.password)) return res.status(400).json({ msg: Err.INVALID_USER })

        const token = jwt.sign(profile, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 * 60 })
        return res.json({ profile, token })

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const signUpController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ msg: Err.NOTFOUND_USER })

    try {
        const result = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashSync(password, 10),
                Role: Role.JOURALIST
            }
        })
        const profile: iUser = { id: result.id, username: result.username, email: result.email, role: result.Role }
        const token = jwt.sign(profile, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 })

        res.status(200).json({ profile, token })

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getProfile = (req: Request, res: Response) => {
    res.status(200).json(req.user)
}

export const editProfile = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body
        const updateUser = await prisma.user.update({
            where: {
                id: req.user.id,
                username: username
            },
            data: {
                password: hashSync(password, 10),
                email: email,
            }
        })
        res.json(updateUser)
    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}
