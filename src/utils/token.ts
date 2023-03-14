import jwt from 'jsonwebtoken'
import { v4 as uuid } from 'uuid'

export const genToken = (user: string) => {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 })
    const refreshToken = uuid()

    return { accessToken, refreshToken }

}
