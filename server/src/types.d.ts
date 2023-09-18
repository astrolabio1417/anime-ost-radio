/* eslint-disable @typescript-eslint/consistent-type-definitions */
declare namespace Express {
    export interface Request {
        session?: { token: string }
        user: UserJwtPayloadI & { isAuthenticated: boolean }
    }
}

interface UserJwtPayloadI {
    id: string
    username: string
}
