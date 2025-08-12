import Env from '@ioc:Adonis/Core/Env'
import axios from 'axios';

export default class ChatbotService {
    private readonly apiUrl: string = Env.get('CHATBOT_API_URL')

    public async sendMessage(question: string, sessionId: string, additionalContext?: string): Promise<any> {

        try {
            const response = await axios.post(this.apiUrl, {
                question: question,
                session_id: sessionId,
                additional_context: additionalContext || ""
            });

            return this.processResponse(response.data)
        } catch (error) {
            console.error('Error sending message to chatbot API:', error.message);
            if (error.response) {
                console.error('API Error Response:', error.response.status, error.response.data);
                throw new Error(`External API error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
            } else if (error.request) {
                throw new Error('No response received from external API. Please check network connectivity.');
            } else {
                throw new Error('Error setting up request to external API: ' + error.message);
            }
        }
    }

    public processResponse(response: any): string {
        try {
            // Handle different possible response formats
            if (response?.data?.message && Array.isArray(response.data.message) && response.data.message.length > 0) {
                return response.data.message[0].text || response.data.message[0];
            } else if (response?.data?.message && typeof response.data.message === 'string') {
                return response.data.message;
            } else if (response?.message) {
                if (Array.isArray(response.message) && response.message.length > 0) {
                    return response.message[0].text || response.message[0];
                } else if (typeof response.message === 'string') {
                    return response.message;
                }
            } else if (response?.data && typeof response.data === 'string') {
                return response.data;
            }

            console.error('Unexpected response format:', JSON.stringify(response, null, 2));
            throw new Error('Invalid response format from external API');
        } catch (error) {
            console.error('Error processing response:', error.message);
            throw new Error('Failed to process chatbot response: ' + error.message);
        }
    }
}
