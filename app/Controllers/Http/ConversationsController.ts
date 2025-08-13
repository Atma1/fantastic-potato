import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Conversation from 'App/Models/Conversation'
import ConversationResource from 'App/Resources/ConversationResource'
import Message from 'App/Models/Message'
import ApiResponseResource from 'App/Resources/ApiResponseResource'
import IdRouteParamsValidator from 'App/Validators/IdRouteParamsValidator'

export default class ConversationsController {

    public async index({ request, response }: HttpContextContract) {
        try {
            const page = request.input('page', 1)
            const limit = request.input('limit', 10)
            const lastMessage = request.input('last_message')

            const query = Conversation.query().orderBy('updated_at', 'desc')

            if (lastMessage) {
                query.where('last_message', 'like', `%${lastMessage}%`)
            }

            const conversations = await query.paginate(page, limit)

            return response.status(200).json(
                ApiResponseResource.success(
                    ConversationResource.summaryCollection(conversations.all()),
                    'Conversations retrieved successfully',
                    conversations.getMeta()
                )
            )
        } catch (error) {
            console.error('Error in index conversation controller:', error)
            return response.status(500).json(
                ApiResponseResource.error('Failed to retrieve conversations', error.message)
            )
        }
    }

    public async show({ request, response }: HttpContextContract) {
        try {

            const { id } = await request.validate(IdRouteParamsValidator)

            const conversation = await Conversation.query()
                .where('id', id)
                .preload('messages', (query) => {
                    query.orderBy('created_at', 'asc')
                })
                .first()

            if (!conversation) {
                return response.status(404).json(
                    ApiResponseResource.error('Conversation not found')
                )
            }

            return response.status(200).json(
                ApiResponseResource.success(
                    ConversationResource.transform(conversation),
                    'Conversation retrieved successfully'
                )
            )
        } catch (error) {
            console.error('Error in show Conversation:', error)
            if (error.messages) {
                return response.status(422).json(
                    ApiResponseResource.validationError(error.messages)
                )
            }
            return response.status(500).json(
                ApiResponseResource.error('Failed to retrieve conversation', error.message)
            )
        }
    }

    public async destroy({ request, response }: HttpContextContract) {
        try {
            const { id } = await request.validate(IdRouteParamsValidator)
            const conversation = await Conversation.find(id)

            if (!conversation) {
                return response.status(404).json(
                    ApiResponseResource.error('Conversation not found')
                )
            }

            await Message.query().where('conversationId', id).delete()

            await conversation.delete()

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
}
