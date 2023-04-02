import { LeagueStatus, PlayerStatus, PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { Err } from "../utils/errorCode"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { iFunction } from "../utils/customType"

const prisma = new PrismaClient()

export const getAllPlayer: iFunction = async (req: Request, res: Response) => {
    try {
        const players = await prisma.player.findMany()
        return res.json(players)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getAPlayer: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const player = await prisma.player.findFirstOrThrow({
            where: {
                id: id
            }
        })
        return res.json(player)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const addPlayer: iFunction = async (req: Request, res: Response) => {
    const { name } = req.body
    try {
        const createplayer = prisma.player.create({
            data: {
                name: name,
                scoreDetail: {}
            }
        })
        return res.json(createplayer)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const editPlayer: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { name, status } = req.body
    if (!Object.values(PlayerStatus).includes(status)) return res.status(400).json({ msg: Err.INVALID_PLAYERSTATUS })
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const editplayer = await prisma.player.update({
            where: {
                id: id
            },
            data: {
                name: name,
                status: status
            }
        })
        return res.json(editplayer)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const deletePlayer: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const validate = await prisma.player.findMany({
            where: {
                id: id,
                Team: {
                    some: {
                        League: {
                            OR: [
                                { status: LeagueStatus.REGISTRATION, },
                                { status: LeagueStatus.TOURAMENT, },
                                { status: LeagueStatus.GROUPS, },
                                { status: LeagueStatus.ELIMINATE, },
                                { status: LeagueStatus.FINAL },
                            ]
                        }
                    },
                },
            },
        })
        if (validate.length > 0) return res.status(400).json({ msg: Err.CANNOT_DELETE_PLAYER })
        const player = await prisma.player.delete({
            where: {
                id: id
            }
        })
        return res.json(player)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

