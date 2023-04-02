import { LeagueStatus, PrismaClient, Role } from "@prisma/client"
import jwt from 'jsonwebtoken'
import { Request, Response } from "express"
import { Err } from "../utils/errorCode"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { iFunction } from "../utils/customType"

const prisma = new PrismaClient()

export const getAllLeague: iFunction = async (req: Request, res: Response) => {
    try {
        const leagues = await prisma.league.findMany()
        return res.json(leagues)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getALeague: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const league = await prisma.league.findFirstOrThrow({
            where: {
                id: id
            }
        })
        return res.json(league)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const addLeague: iFunction = async (req: Request, res: Response) => {
    const { shortName, longName, description, status, startDate } = req.body
    try {
        const creatLeague = prisma.league.create({
            data: {
                shortName: shortName,
                longName: longName,
                description: description,
                status: status,
                startDate: startDate
            }
        })
        return res.json(creatLeague)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const editLeague: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { shortName, longName, description, status, startDate } = req.body
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const editLeague = await prisma.league.update({
            where: {
                id: id
            },
            data: {
                shortName: shortName,
                longName: longName,
                description: description,
                status: status,
                startDate: startDate
            }
        })
        return res.json(editLeague)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const deleteLeague: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const league = await prisma.league.update({
            where: {
                id: id
            },
            data: {
                status: LeagueStatus.CANCELED
            }
        })
        return res.json(league)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

