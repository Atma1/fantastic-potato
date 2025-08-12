# Chatbot API Application

This AdonisJS application implements a ### GET /api/conversation/:sessionId
Get a specific conversation by session ID. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <client_id>
```

**Response:**bot API that stores conversations in PostgreSQL and communicates with an external chatbot service.

## Application Flow

The application follows this specific flow as shown in the diagram:

1. **Actor** posts a question via API
2. **AdonisJS API Server** stores the question in PostgreSQL database
3. **AdonisJS API Server** calls the external API chatbot
4. **External API chatbot** responds with an answer
5. **AdonisJS API Server** stores the chatbot response in PostgreSQL database
6. **AdonisJS API Server** returns the response result to the Actor

## API Endpoints

### Authentication

#### POST /api/auth/generate-client-id
Generate a new client ID for API access.

**Request Body:** None

**Response:**
```json
{
  "success": true,
  "client_id": "client_abc123_def456",
  "message": "Client ID generated successfully"
}
```

### Protected Endpoints

The following endpoints require authentication via the `Authorization` header:
- `GET /api/conversation` - List all conversations
- `GET /api/conversation/:sessionId` - Get specific conversation

**Authentication Header:**
```
Authorization: Bearer <client_id>
```

### POST /api/questions
Send a question to the chatbot.

**Request Body:**
```json
{
  "question": "What is the weather like today?",
  "clientId": "client_abc123_def456",
  "additionalContext": "optional additional context",
  "conversationId": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "session_abc123_1643723400000",
    "question": "What is the weather like today?",
    "response": "I'm sorry, I don't have access to real-time weather data...",
    "conversationId": 1
  },
  "message": "Successfully created question"
}
```

### PUT /api/questions/:id
Update a message by ID.

**Request Body:**
```json
{
  "question": "Updated message content"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "sender_type": "user",
    "message": "Updated message content",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:01.000Z"
  },
  "message": "Message updated successfully"
}
```

### DELETE /api/questions/:id
Delete a message by ID.

**Response:**
```json
{
  "success": true,
  "data": "Conversation deleted successfully"
}
```

### GET /api/conversations/:sessionId
Get a specific conversation by session ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "session_id": "session_abc123_1643723400000",
    "last_message": "What is the weather like today?",
    "created_at": "2025-01-01T10:00:00.000Z",
    "updated_at": "2025-01-01T10:00:00.000Z",
    "messages": [
      {
        "id": 1,
        "sender_type": "user",
        "message": "What is the weather like today?",
        "created_at": "2025-01-01T10:00:00.000Z"
      },
      {
        "id": 2,
        "sender_type": "bot",
        "message": "I'm sorry, I don't have access to real-time weather data...",
        "created_at": "2025-01-01T10:00:01.000Z"
      }
    ]
  },
  "message": "Conversation retrieved successfully"
}
```

### GET /api/conversation
Get all conversations. **Requires authentication.**

**Headers:**
```
Authorization: Bearer <client_id>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "session_id": "session_abc123_1643723400000",
      "last_message": "What is the weather like today?",
      "created_at": "2025-01-01T10:00:00.000Z",
      "updated_at": "2025-01-01T10:00:00.000Z",
      "message_count": 2
    }
  ],
  "message": "Conversations retrieved successfully"
}
```

### GET /api/conversations
Get all conversations.

**Response:**
```json
{
  "success": true,
  "conversations": [
    {
      "id": 1,
      "session_id": "session_abc123_1643723400000",
      "last_message": "What is the weather like today?",
      "created_at": "2025-01-01T10:00:00.000Z",
      "updated_at": "2025-01-01T10:00:00.000Z",
      "message_count": 2
    }
  ]
}
```

## Database Schema

### auth table
- `id` (string, primary key, UUID)
- `client_id` (string)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### conversations table
- `id` (string, primary key, UUID)
- `session_id` (string, unique)
- `client_id` (string)
- `messages_id` (string, nullable, UUID)
- `last_messages` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### messages table
- `id` (string, primary key, UUID)
- `sender_type` (enum: 'user', 'bot')
- `message` (text)
- `conversation_id` (string, foreign key to conversations, UUID)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## External API Integration

The application integrates with an external chatbot API:
- **URL:** `https://api.majadigidev.jatimprov.go.id/api/external/chatbot/send-message`
- **Method:** POST
- **Payload:** 
  ```json
  {
    "question": "user question",
    "session_id": "session identifier"
  }
  ```

## Architecture

### Resource Classes
The application uses dedicated resource classes for consistent API responses:

- **`QuestionResponseResource`**: Formats responses for question submissions
- **`ConversationResource`**: Handles conversation data transformation with full details and summary views
- **`MessageResource`**: Manages message data formatting
- **`ApiResponseResource`**: Provides standardized success/error response formatting

### Benefits of Resource-based Approach
1. **Consistency**: All API responses follow the same structure
2. **Maintainability**: Response formatting logic is centralized
3. **Reusability**: Resources can be reused across different controllers
4. **Type Safety**: Better TypeScript support for response structures

## Key Features

1. **Session Management**: Each conversation is tracked by a unique session ID
2. **Message Persistence**: Both user questions and bot responses are stored in the database
3. **Error Handling**: Comprehensive error handling for API failures and database operations
4. **Conversation History**: Full conversation history is maintained and retrievable
5. **Robust External API Integration**: Handles various response formats and network errors
6. **Resource-based Response Formatting**: Consistent and maintainable API responses

## Setup and Running

1. Install dependencies: `npm install`
2. Configure database connection in `config/database.ts`
3. Run migrations: `node ace migration:run`
4. Start the server: `npm run dev`

The API will be available at `http://localhost:3333/api/`
