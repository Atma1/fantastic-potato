import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auth from 'App/Models/Auth'
import ApiResponseResource from 'App/Resources/ApiResponseResource'

export default class AuthMiddleware {
    public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
        try {
            // Get client ID from Authorization header
            const authHeader = ctx.request.header('Authorization')

            if (!authHeader) {
                return ctx.response.status(401).json(
                    ApiResponseResource.error('Authorization is required')
                )
            }

            // Extract client ID from "Bearer client_id" format
            const clientId = this.extractClientId(authHeader)

            if (!clientId) {
                return ctx.response.status(401).json(
                    ApiResponseResource.error('Authorization is required.')
                )
            }

            // Verify client ID exists and is active
            const auth = await Auth.query()
                .where('client_id', clientId)
                .first()

            if (!auth) {
                return ctx.response.status(401).json(
                    ApiResponseResource.error('Unauthorized.')
                )
            }


            // Store auth info for use in controllers (using meta)
            ctx.request.updateBody({ auth })

            await next()
        } catch (error) {
            console.error('Authentication middleware error:', error)
            return ctx.response.status(500).json(
                ApiResponseResource.error('Authentication failed', error.message)
            )
        }
    }

    private extractClientId(authHeader: string): string | null {
        const parts = authHeader.split(' ')

        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null
        }

        return parts[1]
    }
}
