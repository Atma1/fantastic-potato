export default class QuestionResponseResource {
    public static transform(data: {
        sessionId: string,
        question: string,
        response: string,
        conversationId: string
        userMessageId: string
    }) {
        return {
            session_id: data.sessionId,
            question: data.question,
            response: data.response,
            conversation_id: data.conversationId,
            user_message_id: data.userMessageId
        }
    }
}
