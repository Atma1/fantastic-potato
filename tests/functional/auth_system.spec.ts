import { test } from '@japa/runner'

test.group('Authentication System', () => {
    test('should generate a client ID', async ({ client, assert }) => {
        const response = await client
            .post('/api/auth/generate-client-id')

        response.assertStatus(201)

        const body = response.body()
        assert.isTrue(body.success)
        assert.exists(body.client_id)
        assert.equal(body.message, 'Client ID generated successfully')
        assert.isTrue(body.client_id.startsWith('client_'))
    })

    test('should reject conversation requests without authorization', async ({ client, assert }) => {
        const response = await client
            .get('/api/conversation')

        response.assertStatus(401)

        const body = response.body()
        assert.isFalse(body.success)
        assert.equal(body.error, 'Authorization header is required')
    })

    test('should reject conversation requests with invalid authorization format', async ({ client, assert }) => {
        const response = await client
            .get('/api/conversation')
            .header('Authorization', 'InvalidFormat')

        response.assertStatus(401)

        const body = response.body()
        assert.isFalse(body.success)
        assert.equal(body.error, 'Invalid authorization format. Use: Bearer <client_id>')
    })

    test('should reject conversation requests with invalid client ID', async ({ client, assert }) => {
        const response = await client
            .get('/api/conversation')
            .header('Authorization', 'Bearer invalid_client_id')

        response.assertStatus(401)

        const body = response.body()
        assert.isFalse(body.success)
        assert.equal(body.error, 'Invalid or inactive client ID')
    })

    test('should allow conversation requests with valid client ID', async ({ client, assert }) => {
        // First generate a client ID
        const authResponse = await client
            .post('/api/auth/generate-client-id')

        authResponse.assertStatus(201)
        const generatedClientId = authResponse.body().client_id

        // Then use it to access conversations
        const response = await client
            .get('/api/conversation')
            .header('Authorization', `Bearer ${generatedClientId}`)

        response.assertStatus(200)

        const body = response.body()
        assert.isTrue(body.success)
        assert.isArray(body.data)
        assert.equal(body.message, 'Conversations retrieved successfully')
    })

    test('should allow accessing specific conversation with valid client ID', async ({ client, assert }) => {
        // First generate a client ID
        const authResponse = await client
            .post('/api/auth/generate-client-id')

        authResponse.assertStatus(201)
        const generatedClientId = authResponse.body().client_id

        // Create a conversation first by asking a question
        const questionResponse = await client
            .post('/api/questions')
            .json({ question: 'Test question for auth' })

        questionResponse.assertStatus(200)
        const sessionId = questionResponse.body().session_id

        // Then try to access the conversation with auth
        const response = await client
            .get(`/api/conversation/${sessionId}`)
            .header('Authorization', `Bearer ${generatedClientId}`)

        response.assertStatus(200)

        const body = response.body()
        assert.isTrue(body.success)
        assert.exists(body.data)
        assert.equal(body.message, 'Conversation retrieved successfully')
    })
})
