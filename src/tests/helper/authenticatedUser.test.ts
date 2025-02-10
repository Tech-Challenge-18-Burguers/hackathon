import { getAuthenticatedUser } from "../../helper/authenticatedUser"

describe('authenticatedUser', () => {
    it('should be get authenticate user', () => {
        const event = { requestContext: { authorizer: { claims: { sub: 'user-id' } } } } as any
        const userId = getAuthenticatedUser(event)
        expect(userId).toBe('user-id')
    })
})