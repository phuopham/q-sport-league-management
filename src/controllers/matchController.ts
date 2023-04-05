import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import { Err } from "../utils/errorCode"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime"
import { iFunction } from "../utils/customType"

const prisma = new PrismaClient()

export const getAllMatchesInLeague: iFunction = async (req: Request, res: Response) => {
    const leagueId = Number(req.params.leagueId)
    if (isNaN(leagueId)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const matches = await prisma.match.findMany({
            where: {
                leagueId: leagueId
            }
        })
        return res.json(matches)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}

export const getAMatchInLeague: iFunction = async (req: Request, res: Response) => {
    const leagueId = Number(req.params.leagueId)
    const id = Number(req.params.id)
    if (isNaN(leagueId)||!isNaN(id)) return res.status(400).json({ msg: Err.INVALID_PATH })
    try {
        const matches = await prisma.match.findFirstOrThrow({
            where: {
                id:id,
                leagueId: leagueId
            }
        })
        return res.json(matches)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ msg: Err.SERVER_ERROR })
    }
}