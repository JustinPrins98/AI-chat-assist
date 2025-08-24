import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ga4ExampleData } from '@/lib/ga4-sample-data'; 

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: NextRequest) {
    const { prompt, messages = [] } = await req.json();

    try {
        // Bouw de berichten array op
        const conversationMessages = [
            {
                role: 'system',
                content: `Je bent een ervaren digitale marketinganalist. Je bent vriendelijk en behulpzaam. 

Voor gewone conversatie antwoord je normaal in platte tekst.

Voor marketing analyses MOET je deze exacte structuur volgen:

<h3>Hoofdonderwerp</h3>
<p>Uitleg hier...</p>
<br>

<h3>Volgend Onderwerp</h3>  
<ul>
<li>Bullet point 1</li>
<li>Bullet point 2</li>
</ul>
<br>

VEREIST: Gebruik altijd <br> NA elke sectie (na </p>, </ul>, </ol>) voor witruimte. Dit is VERPLICHT voor leesbaarheid.

Gebruik <strong> voor cijfers en belangrijke punten.`
            }
        ];

        // Alleen GA4 data toevoegen wanneer het relevant kan zijn voor de vraag
        const needsAnalyticsData = prompt.toLowerCase().includes('analytics') || 
                                 prompt.toLowerCase().includes('data') ||
                                 prompt.toLowerCase().includes('conversie') ||
                                 prompt.toLowerCase().includes('bezoekers') ||
                                 prompt.toLowerCase().includes('verkeer') ||
                                 prompt.toLowerCase().includes('prestaties') ||
                                 prompt.toLowerCase().includes('rapport') ||
                                 messages.some(msg => msg.content && (
                                   msg.content.toLowerCase().includes('analytics') ||
                                   msg.content.toLowerCase().includes('data')
                                 ));

        if (needsAnalyticsData || messages.length === 0) {
            conversationMessages.push({
                role: 'user',
                content: `Hier is de beschikbare GA4 JSON-data voor analyse:\n${JSON.stringify(ga4ExampleData, null, 2)}`
            });
        }

        // Alleen laatste 10 berichten meesturen om kosten te beperken
        const recentMessages = messages.slice(-10);
        
        // Voeg eerdere berichten toe (alleen user en assistant berichten)
        recentMessages.forEach(message => {
            if (message.type === 'user') {
                conversationMessages.push({
                    role: 'user',
                    content: message.content
                });
            } else if (message.type === 'ai') {
                conversationMessages.push({
                    role: 'assistant',
                    content: message.content
                });
            }
        });

        // Voeg de nieuwe prompt toe
        conversationMessages.push({
            role: 'user',
            content: prompt
        });

        const response = await openai.chat.completions.create({
            model: 'gpt-4.1-nano',
            messages: conversationMessages,
            max_tokens: 500
        });

        const reply = response.choices[0].message.content;
        
        // Token monitoring
        console.log(`Tokens gebruikt: ${response.usage?.total_tokens} (input: ${response.usage?.prompt_tokens}, output: ${response.usage?.completion_tokens})`);
        
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('OpenAI API error:', error);
        return NextResponse.json({ error: 'Fout bij OpenAI' }, { status: 500 });
    }
}