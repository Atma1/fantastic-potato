export default class QuestionResponseResource {
    public static transform(data: {
        sessionId: string,
        question: string,
        response: string,
        conversationId: string
    }) {
        return {
            session_id: data.sessionId,
            question: data.question,
            response: data.response,
            conversation_id: data.conversationId
        }
    }
}
