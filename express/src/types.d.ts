declare namespace Express {
    export interface Request {
        session?: { token: string }
        user: UserJwtPayloadI
    }
}

interface UserJwtPayloadI {
    id: string
    username: string
    isAuthenticated: boolean
}
