import { PrismaClient, Role } from "@prisma/client"
import { hashSync } from "bcrypt"
import { iFunction, iUser } from "../utils/customType"
import jwt from 'jsonwebtoken'
import { Request, Response } from "express"
import { Err } from "../utils/errorCode"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"

const prisma = new PrismaClient()

export const getAllUser: iFunction = async (req: Request, res: Response) => {
    try {
        const allUser = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                password: false,
            }
        })
        return res.json(allUser)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getAUser: iFunction = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: id
            },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                password: false,
            }
        })
        return res.json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.INVALID_PATH })
    }
}

export const createUser: iFunction = async (req: Request, res: Response) => {
    const { username, email, password, role } = req.body
    if (!username || !email || !password) return res.status(400).json({ msg: Err.NOTFOUND_USER })
    try {
        const result = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashSync(password, 10),
                role: role as Role ?? Role.JOURNALIST
            }
        })
        const profile: iUser = { id: result.id, username: result.username, email: result.email, role: result.role }

        return res.status(200).json({ profile })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const editUser: iFunction = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
        const { username, password, email, role } = req.body
        const updateUser = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                username: username,
                password: hashSync(password, 10),
                email: email,
                role: role
            }
        })
        const profile: iUser = { id: updateUser.id, username: updateUser.username, email: updateUser.email, role: updateUser.role }
        return res.json(profile)
    } catch (err) {
        console.log(err)
        if ((err as PrismaClientKnownRequestError).code === 'P2002') return res.status(400).json({ msg: Err.NOT_UNIQUE_EMAIL_OR_USERNAME })
        return res.status(500).json({ msg: Err.SERVER_ERROR })

    }
}

export const deleteUser: iFunction = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id)
        if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })

        const deleteUser = await prisma.user.delete({
            where: {
                id: id
            }
        })
        console.log(deleteUser)
        return res.json(deleteUser)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

