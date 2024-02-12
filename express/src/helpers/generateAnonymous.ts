export default function generateAnonymous(): UserJwtPayloadI {
    return { username: 'Anonymous', id: '-1', isAuthenticated: false }
}
