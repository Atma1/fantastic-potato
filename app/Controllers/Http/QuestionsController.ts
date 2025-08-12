import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ChatbotService from 'App/Services/ChatbotService'
import Conversation from 'App/Models/Conversation'
import Message from 'App/Models/Message'
import SendQuestionValidator from 'App/Validators/SendQuestionValidator'
import QuestionResponseResource from 'App/Resources/QuestionResponseResource'
import ApiResponseResource from 'App/Resources/ApiResponseResource'
import MessageResource from 'App/Resources/MessageResource'
import { v4 as uuidv4 } from 'uuid'
import IdRouteParamsValidator from 'App/Validators/IdRouteParamsValidator'
import UpdateMessageValidator from 'App/Validators/UpdateMessageValidator'

export default class QuestionsController {
    private readonly chatbotService: ChatbotService

    constructor() {
        this.chatbotService = new ChatbotService()
    }

    public async store({ request, response }: HttpContextContract) {
        try {
            const payload = await request.validate(SendQuestionValidator)
            const { question, clientId, additionalContext, conversationId } = payload

            let conversation: Conversation

            if (conversationId) {
                const foundConversation = await Conversation.find(conversationId)
                if (!foundConversation) {
                    return response.status(404).json(
                        ApiResponseResource.error('Conversation not found')
                    )
                }
                conversation = foundConversation
            } else {
                conversation = await Conversation.create({
                    sessionId: this.generateSessionId(),
                    lastMessages: question,
                    clientId: clientId,
                })

            }

            const userMessage = await Message.create({
                senderType: 'user',
                message: question,
                conversationId: conversation.id,
            })

            conversation.messagesId = userMessage.id
            await conversation.save()

            const botResponseText = await this.chatbotService.sendMessage(question, conversation.sessionId, additionalContext)

            const botMessage = await Message.create({
                senderType: 'bot',
                message: botResponseText,
                conversationId: conversation.id,
            })

            await conversation.merge({ messagesId: botMessage.id, lastMessages: botResponseText }).save()

            return response.status(200).json(
                ApiResponseResource.success(
                    QuestionResponseResource.transform({
                        sessionId: conversation.sessionId,
                        question,
                        response: botResponseText,
                        conversationId: conversation.id
                    }),
                    'Successfully created question',
                )
            )
        } catch (error) {
            console.error('Error in post:', error)
            if (error.messages) {
                return response.status(422).json(
                    ApiResponseResource.validationError(error.messages)
                )
            }
            return response.status(500).json(
                ApiResponseResource.error('Failed to process question', error.message)
            )
        }
    }

    public async update({ request, response }: HttpContextContract) {
        try {
            const { id } = await request.validate(IdRouteParamsValidator)
            const { question } = await request.validate(UpdateMessageValidator)

            const existing = await Message.find(id)
            if (!existing) {
                return response.status(404).json(
                    ApiResponseResource.error('Message not found')
                )
            }

            existing.message = question
            await existing.save()

            return response.status(200).json(
                ApiResponseResource.success(
                    MessageResource.transform(existing),
                    'Message updated successfully'
                )
            )
        } catch (error) {
            console.error('Error in update:', error)
            if (error.messages) {
                return response.status(422).json(
                    ApiResponseResource.validationError(error.messages)
                )
            }
            return response.status(500).json(
                ApiResponseResource.error('Failed to update message', error.message)
            )
        }
    }

    public async destroy({ params, response }: HttpContextContract) {
        try {
            const messageId = params.id
            const message = await Message.find(messageId)

            if (!message) {
                return response.status(404).json(
                    ApiResponseResource.error('Conversation not found')
                )
            }

            await message.delete()

            return response.status(200).json(
                ApiResponseResource.success('Conversation deleted successfully')
            )
        } catch (error) {
            console.error('Error in destroy:', error)
            return response.status(500).json(
                ApiResponseResource.error('Failed to delete conversation', error.message)
            )
        }
    }

    private generateSessionId(): string {
        return 'session_' + uuidv4()
    }
}