import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization } = req.headers
        const token = String(authorization).substring(7)

        if (!token) return res.status(400).json({
            msg: 'Empty token provide!'
        })

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, log) => {
            if (err) return res.status(400).json({ msg: 'Unauthorized access!' })

            // req.user = log.user_id
            // req.role = log.role_id
            next()
        })

    } catch (error) {
        console.log(error)
    }
}