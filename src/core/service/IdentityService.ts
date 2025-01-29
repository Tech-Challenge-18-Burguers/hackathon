export type CreateUserInput = {
    name: string
    username: string
    password: string
}

export type CreateUserOutput = {
    userId: string
}

export type AuthenticationInput = {
    username: string
    password: string
}

export type AuthenticationOutput = {
    token: string
    type: string
    expireIn?: number
}

export type PermanentPasswordInput = {
    username: string
    password: string
}

export default interface IdentityService {

    createUser(input: CreateUserInput): Promise<CreateUserOutput>

    authenticate(input: AuthenticationInput): Promise<AuthenticationOutput>

    setPermanentPassword(input: PermanentPasswordInput): Promise<void>
}