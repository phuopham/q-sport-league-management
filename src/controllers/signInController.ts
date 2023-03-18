import { Request, Response } from 'express'
import { PrismaClient, Role } from '@prisma/client'
import { compareSync, hashSync } from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient();

export interface iUser {
    id: number,
    username: string,
    email: string
}

export const signInController = async (req: Request, res: Response) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ msg: 'Email and password is required!' })
    try {
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: email
            },
            include: {
                Role: true
            },

        })
        const profile: iUser = { id: user.id, username: user.username, email: user.email }
        console.log(user)
        console.log(profile)
        if (!user) return res.status(400).json({ msg: 'email or password is incorrect' })
        if (!compareSync(password, user.password)) return res.status(400).json({ msg: 'Email or password is incorrect' })

        const token = jwt.sign(profile, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 })
        return res.json({ profile, token })

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Internal server error!' })
    }
}

export const signUpController = async (req: Request, res: Response) => {
    const { username, email, password } = req.body
    if (!username || !email || !password) return res.status(400).json({ msg: 'Email and Password is required !' })

    try {
        const result = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashSync(password, 10),
                Role: {
                    connect: { id: 1 }
                }
            }
        })
        const profile: iUser = { id: result.id, username: result.username, email: result.email }
        const token = jwt.sign(profile, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 })

        res.status(200).json({ profile, token })

    } catch (err) {
        console.log(err)
        res.status(500).json({ msg: 'Internal server error!' })
    }
}
