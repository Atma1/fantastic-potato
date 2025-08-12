import Message from 'App/Models/Message'

export default class MessageResource {
    public static transform(message: Message) {
        return {
            id: message.id,
            sender_type: message.senderType,
            message: message.message,
            created_at: message.createdAt,
            updated_at: message.updatedAt
        }
    }

    public static collection(messages: Message[]) {
        return messages.map(message => this.transform(message))
    }
}
