import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Auth from 'App/Models/Auth'
import AuthResource from 'App/Resources/AuthResource'
import ApiResponseResource from 'App/Resources/ApiResponseResource'
import { v4 as uuidv4 } from 'uuid'

export default class AuthController {
    public async store({ response }: HttpContextContract) {
        try {
            const clientId = this.generateUniqueClientId()

            const auth = await Auth.create({
                clientId: clientId,
            })

            return response.status(201).json(
                AuthResource.clientIdResponse(auth)
            )
        } catch (error) {
            console.error('Error generating client ID:', error)

            if (error.messages) {
                return response.status(422).json(
                    ApiResponseResource.validationError(error.messages)
                )
            }

            return response.status(500).json(
                ApiResponseResource.error('Failed to generate client ID', error.message)
            )
        }
    }

    private generateUniqueClientId(): string {
        const uuid = uuidv4();
        return `client_${uuid}`
    }
}
