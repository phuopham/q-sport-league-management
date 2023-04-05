import { PrismaClient, Team } from "@prisma/client"
import { Request, Response } from "express"
import { Err } from "../utils/errorCode"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { iFunction } from "../utils/customType"

const prisma = new PrismaClient()

export const getAllTeam: iFunction = async (req: Request, res: Response) => {
    try {
        const teams = await prisma.team.findMany()
        return res.json(teams)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getATeam: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const team = await prisma.team.findFirstOrThrow({
            where: {
                id: id
            },
            include: {
                players: true,
                League: true
            }
        })
        return res.json(team)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const addTeam: iFunction = async (req: Request, res: Response) => {
    const { leagueId, shortName, name, description, players } = req.body
    try {
        const creatteam = prisma.team.create({
            data: {
                leagueId: leagueId,
                shortName: shortName,
                name: name,
                description: description,
                players: players //have issue here
            }
        })
        return res.json(creatteam)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const editTeam: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const { leagueId, shortName, name, description, players } = req.body
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const editteam = await prisma.team.update({
            where: {
                id: id
            },
            data: {
                leagueId: leagueId,
                shortName: shortName,
                name: name,
                description: description,
                players: players //have issue here
            }
        })
        return res.json(editteam)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const deleteTeam: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    if (isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const validate = await prisma.team.findFirstOrThrow({
            where: {
                id: id
            },
            include: {
                Home: true,
                Guest: true
            }
        })
        if (validate.Home.length > 0 || validate.Guest.length > 0) return res.status(400).json({ msg: Err.CANNOT_DELETE_TEAM })
        const team = await prisma.team.delete({
            where: {
                id: id
            }
        })
        return res.json(team)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getAllTeamInLeague: iFunction = async (req: Request, res: Response) => {
    const leagueId = Number(req.params.leagueId)
    if (isNaN(leagueId)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const teams = await prisma.team.findMany({
            where: {
                leagueId: leagueId
            }
        })
        return res.json(teams)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getATeamInLeague: iFunction = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const leagueId = Number(req.params.leagueId)
    if (isNaN(id) || isNaN(leagueId)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const team = await prisma.team.findFirstOrThrow({
            where: {
                id: id,
                leagueId: leagueId
            },
            include: {
                players: true
            }
        })
        return res.json(team)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}
