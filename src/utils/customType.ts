import { Role } from "@prisma/client"
import { Request, Response } from "express"

export interface iUser {
    id: number,
    username: string,
    email: string
    role: Role
}

export type iFunction = (req: Request, res: Response) => Promise<Response>