import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SendQuestionValidator {
    constructor(protected ctx: HttpContextContract) { }

    /*
     * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
     */
    public schema = schema.create({
        question: schema.string({}, [
            rules.maxLength(1000)
        ]),
        clientId: schema.string(),
        additionalContext: schema.string.optional(),
        conversationId: schema.string.optional({}, [
            rules.uuid()
        ])
    })

    /**
     * Custom messages for validation failures.
     */
    public messages: CustomMessages = {
        'question.required': 'Question is required',
        'question.maxLength': 'Question cannot exceed 5000 characters',
        'clientId.required': 'ClientId is required.',
        'conversationId.number': 'Conversation ID must be a valid number',
    }
}
