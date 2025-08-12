import Conversation from 'App/Models/Conversation'
import MessageResource from './MessageResource'

export default class ConversationResource {
    public static transform(conversation: Conversation) {
        return {
            id: conversation.id,
            session_id: conversation.sessionId,
            last_message: conversation.lastMessages,
            created_at: conversation.createdAt,
            updated_at: conversation.updatedAt,
            messages: conversation.messages ? MessageResource.collection(conversation.messages) : []
        }
    }

    public static summary(conversation: Conversation) {
        return {
            id: conversation.id,
            session_id: conversation.sessionId,
            last_message: conversation.lastMessages,
            created_at: conversation.createdAt,
            updated_at: conversation.updatedAt,
        }
    }

    public static collection(conversations: Conversation[]) {
        return conversations.map(conversation => this.transform(conversation))
    }

    public static summaryCollection(conversations: Conversation[]) {
        return conversations.map(conversation => this.summary(conversation))
    }
}
