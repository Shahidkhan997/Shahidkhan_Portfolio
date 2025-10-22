import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AiService {
    private apiUrl = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-small';
    private token = environment.huggingfaceToken;

    // Your profile data - customize this with your actual information
    private profileData = {
        name: 'Muhammad Shahid',
        role: 'Data Analyst/Engineer',
        experience: '5+ years in data analysis, machine learning, and business intelligence',
        skills: ['Python', 'SQL', 'Tableau', 'Power BI', 'Machine Learning', 'Data Visualization', 'R', 'Excel'],
        projects: [
            { name: 'Sales Dashboard', description: 'Interactive dashboard for sales data analysis using Tableau, increasing team efficiency by 30%' },
            { name: 'Customer Segmentation', description: 'ML model for customer segmentation using K-means clustering, improving marketing ROI by 25%' },
            { name: 'Predictive Analytics Tool', description: 'Built a predictive model for inventory forecasting using time series analysis' }
        ],
        education: 'Bachelor\'s in Computer Science from XYZ University',
        achievements: 'Certified in Google Data Analytics, Tableau Desktop Specialist',
        contact: 'Email: muhammad.shahid@example.com | LinkedIn: linkedin.com/in/muhammadshahid'
    };

    constructor() { }

    async generateResponse(userMessage: string, context?: string): Promise<string> {
        try {
            // Create a comprehensive prompt with your data
            const conversationHistory = context ? `Previous conversation: ${context}\n` : '';
            const profileContext = this.buildProfileContext();
            const fullPrompt = `${conversationHistory}${profileContext}\nYou are Muhammad Shahid's AI assistant. Answer questions about his profile, experience, skills, projects, education, and achievements naturally and helpfully.\nHuman: ${userMessage}\nAssistant:`;

            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`,
                },
                body: JSON.stringify({
                    inputs: fullPrompt,
                    parameters: {
                        max_new_tokens: 150,
                        temperature: 0.7,
                        do_sample: true,
                        top_p: 0.9,
                        return_full_text: false
                    }
                })
            });

            if (!response.ok) {
                console.error('Hugging Face API error:', response.status, response.statusText);
                if (response.status === 401) {
                    throw new Error('Invalid API token. Please check your Hugging Face token.');
                }
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            // Handle different response formats
            let botResponse = '';
            if (Array.isArray(data) && data[0]?.generated_text) {
                botResponse = data[0].generated_text.trim();
            } else if (data.generated_text) {
                botResponse = data.generated_text.trim();
            } else if (data[0]?.text) {
                botResponse = data[0].text.trim();
            }

            // Clean up the response
            botResponse = botResponse.replace(/^Assistant:\s*/i, '').trim();

            // Ensure we have a meaningful response
            if (!botResponse || botResponse.length < 3) {
                throw new Error('Empty or too short response from API');
            }

            return botResponse;
        } catch (error) {
            console.error('AI Service Error:', error);

            // Fallback to static response using your data
            return this.getStaticResponse(userMessage);
        }
    }

    private buildProfileContext(): string {
        return `Here is information about Muhammad Shahid:
        - Name: ${this.profileData.name}
        - Role: ${this.profileData.role}
        - Experience: ${this.profileData.experience}
        - Skills: ${this.profileData.skills.join(', ')}
        - Projects: ${this.profileData.projects.map(p => `${p.name}: ${p.description}`).join('; ')}
        - Education: ${this.profileData.education}
        - Achievements: ${this.profileData.achievements}
        - Contact: ${this.profileData.contact}

        Use this information to answer questions accurately.`;
    }

    private getStaticResponse(userMessage: string): string {
        const message = userMessage.toLowerCase();

        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return `Hello! I'm Muhammad Shahid's AI assistant. I can help you learn about his ${this.profileData.experience} as a ${this.profileData.role}. What would you like to know?`;
        } else if (message.includes('experience') || message.includes('background')) {
            return `Muhammad has ${this.profileData.experience}. He's skilled in ${this.profileData.skills.slice(0, 3).join(', ')}, and more.`;
        } else if (message.includes('skills')) {
            return `Muhammad's key skills include: ${this.profileData.skills.join(', ')}.`;
        } else if (message.includes('projects')) {
            return `Some notable projects: ${this.profileData.projects.map(p => p.name).join(', ')}. ${this.profileData.projects[0].name} ${this.profileData.projects[0].description}`;
        } else if (message.includes('education')) {
            return `Muhammad holds ${this.profileData.education}.`;
        } else if (message.includes('achievements') || message.includes('certifications')) {
            return `Muhammad has ${this.profileData.achievements}.`;
        } else if (message.includes('contact') || message.includes('reach') || message.includes('email')) {
            return `You can contact Muhammad at ${this.profileData.contact}.`;
        } else if (message.includes('name') || message.includes('who are you') || message.includes('who is muhammad')) {
            return `I'm assisting Muhammad Shahid, a ${this.profileData.role} with expertise in ${this.profileData.skills.slice(0, 2).join(' and ')}.`;
        } else {
            return `I can help with information about Muhammad Shahid's profile! Try asking about his experience, skills, projects, education, achievements, or contact details. For example: "What are Muhammad's skills?" or "Tell me about his projects."`;
        }
    }
}
