import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const getUsers = async (req: Request, res: Response) => {
    console.log('here')
    const users = await prisma.user.findMany();
    res.json(users);
}

export const setUsers = async (req: Request, res: Response) => {
    try {
        const newUser = req.body
        const user = await prisma.user.create({
            data: newUser
        })
        res.json(user);
    } catch (error) {
        res.json({ 'msg': error })
    }
}
