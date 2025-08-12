import { test } from '@japa/runner'

test.group('Chatbot API Flow with Resources', () => {
    test('should return properly formatted response using QuestionResponseResource', async ({ client, assert }) => {
        const questionPayload = {
            question: 'What is the weather like today?'
        }

        const response = await client
            .post('/api/questions')
            .json(questionPayload)

        response.assertStatus(200)

        const body = response.body()
        // Test QuestionResponseResource structure
        assert.isTrue(body.success)
        assert.exists(body.session_id)
        assert.equal(body.question, questionPayload.question)
        assert.exists(body.response)
        assert.exists(body.conversation_id)
    })

    test('should return properly formatted conversation using ConversationResource', async ({ client, assert }) => {
        // First create a conversation
        const questionPayload = {
            question: 'Test question for conversation resource'
        }

        const questionResponse = await client
            .post('/api/questions')
            .json(questionPayload)

        questionResponse.assertStatus(200)
        const sessionId = questionResponse.body().session_id

        // Then retrieve the conversation
        const conversationResponse = await client
            .get(`/api/conversations/${sessionId}`)

        conversationResponse.assertStatus(200)

        const body = conversationResponse.body()
        // Test ApiResponseResource + ConversationResource structure
        assert.isTrue(body.success)
        assert.exists(body.data)
        assert.equal(body.message, 'Conversation retrieved successfully')

        const conversation = body.data
        assert.exists(conversation.id)
        assert.equal(conversation.session_id, sessionId)
        assert.exists(conversation.last_message)
        assert.isArray(conversation.messages)
        assert.equal(conversation.messages.length, 2) // user + bot message
    })

    test('should return properly formatted conversations list using ConversationResource collection', async ({ client, assert }) => {
        const response = await client.get('/api/conversations')

        response.assertStatus(200)

        const body = response.body()
        // Test ApiResponseResource + ConversationResource collection structure
        assert.isTrue(body.success)
        assert.isArray(body.data)
        assert.equal(body.message, 'Conversations retrieved successfully')

        if (body.data.length > 0) {
            const conversation = body.data[0]
            assert.exists(conversation.id)
            assert.exists(conversation.session_id)
            assert.exists(conversation.message_count)
        }
    })

    test('should return properly formatted validation error using ApiResponseResource', async ({ client, assert }) => {
        const response = await client
            .post('/api/questions')
            .json({})

        response.assertStatus(422)

        const body = response.body()
        // Test ApiResponseResource validation error structure
        assert.isFalse(body.success)
        assert.equal(body.error, 'Validation failed')
        assert.exists(body.messages)
    })

    test('should return properly formatted 404 error using ApiResponseResource', async ({ client, assert }) => {
        const response = await client
            .get('/api/conversations/non-existent-session')

        response.assertStatus(404)

        const body = response.body()
        // Test ApiResponseResource error structure
        assert.isFalse(body.success)
        assert.equal(body.error, 'Conversation not found')
    })
})