import Auth from 'App/Models/Auth'

export default class AuthResource {
    public static transform(auth: Auth) {
        return {
            client_id: auth.clientId,
            created_at: auth.createdAt
        }
    }

    public static clientIdResponse(auth: Auth) {
        return {
            success: true,
            client_id: auth.clientId,
            message: 'Client ID generated successfully'
        }
    }
}
