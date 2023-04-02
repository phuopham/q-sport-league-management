import { Request, Response } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import { compareSync, hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Err } from '../utils/errorCode';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { iFunction, iUser } from '../utils/customType'

const prisma = new PrismaClient();

export const signInController: iFunction = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ msg: Err.NOTFOUND_USER })
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: email
            },
        })
        const profile: iUser = { id: user.id, username: user.username, email: user.email, role: user.role }
        if (!user) return res.status(400).json({ msg: Err.INVALID_USER })
        if (!compareSync(password, user.password)) return res.status(400).json({ msg: Err.INVALID_USER })

        const token = jwt.sign(profile, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 * 60 })
        console.log(['Access granted to', profile])
        return res.json({ profile, token })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const signUpController: iFunction = async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ msg: Err.NOTFOUND_USER })

    try {
        const result = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashSync(password, 10),
                role: Role.ADMIN
            },
            select: {
                id: true,
                password: false,
                username: true,
                email: true,
                role: true,
            }
        })
        const profile: iUser = { id: result.id, username: result.username, email: result.email, role: result.role }
        const token = jwt.sign(profile, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 })

        return res.status(200).json({ profile, token })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getProfile: iFunction = async (req: Request, res: Response) => {
    return res.status(200).json(req.user)
}

export const editProfile: iFunction = async (req: Request, res: Response) => {
    try {
        const { username, password, email } = req.body
        if (username != req.user.username) return res.status(400).json({ msg: Err.INSUFFICIENT_CONTENT })
        const updateUser = await prisma.user.update({
            where: {
                id: req.user.id,
            },
            data: {
                password: hashSync(password, 10),
                email: email,
            }
        })
        const profile: iUser = { id: updateUser.id, username: updateUser.username, email: updateUser.email, role: updateUser.role }
        return res.json(profile)
    } catch (err) {
        console.log(err)
        if ((err as PrismaClientKnownRequestError).code === 'P2002') return res.status(400).json({ msg: Err.NOT_UNIQUE_EMAIL })
        return res.status(500).json({ msg: Err.SERVER_ERROR })

    }
}
