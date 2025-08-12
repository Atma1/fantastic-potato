export default class ApiResponseResource {
    public static success<T>(data: T, message?: string, meta?: any) {
        return {
            success: true,
            ...(message && { message }),
            data,
            ...(meta && { meta }),
        }
    }

    public static error(message: string, details?: any) {
        return {
            success: false,
            error: message,
            ...(details && { details })
        }
    }

    public static validationError(errors: any) {
        return {
            success: false,
            error: 'Validation failed',
            messages: errors
        }
    }
}
