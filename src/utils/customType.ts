import { Role } from "@prisma/client"
import { Request, Response } from "express"

export interface iUser {
    id: number,
    username: string,
    email: string
    role: Role
}

export type iFunction = (req: Request, res: Response) => Promise<Response>

export enum MatchAction {
    GAMESTART = 'start',
    GAMEEND = 'end',
    SCORE = 'score',
    FAULT = 'fault'
}

export type iMatchEvent = Array<{
    player: number,
    action: MatchAction,
    timestamp: number,
}>