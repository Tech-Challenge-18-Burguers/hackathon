export default class UnauthorizedException extends Error {
    constructor(message?: string) {
        super(message || 'Unauthorized')
        this.name = this.constructor.name
        if(Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}