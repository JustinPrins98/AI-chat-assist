import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Mistral } from '@mistralai/mistralai';
import { ga4ExampleData } from '@/lib/ga4-sample-data';

interface Message {
    type: 'user' | 'ai';
    content: string;
    timestamp: string;
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const mistral = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY
});

export async function POST(req: NextRequest) {
    const { prompt, messages = [], provider = 'openai', isTaskGuidanceActive = false, activeTask = '' } = await req.json();

    // Log welke provider wordt gebruikt
    console.log(`🔥 API CALL STARTED - Provider: ${provider.toUpperCase()}`);

    try {
        // Bouw de berichten array op
        const baseSystemMessage = `Je bent een ervaren digitale marketinganalist. Je bent vriendelijk en behulpzaam. 

KRITIEKE FORMATTING REGELS - VERPLICHT VOOR ALLE ANTWOORDEN:

VERBODEN: Gebruik NOOIT markdown syntax zoals **tekst** of *tekst*
VERPLICHT: Gebruik ALLEEN HTML tags zoals <strong>tekst</strong>

Voor gewone conversatie: antwoord in platte tekst.

Voor ANALYSES en UITLEG moet je deze structuur volgen:
<h3>📊 Hoofdonderwerp</h3>
<p>Inleidende uitleg met <strong>belangrijke cijfers</strong> en <strong>key metrics</strong>.</p>
<br>

<h3>📈 Volgend Onderwerp</h3>  
<ul>
<li><strong>Punt 1:</strong> Uitleg met specifieke details</li>
<li><strong>Punt 2:</strong> Uitleg met specifieke details</li>
</ul>
<br>

Voor TAAKBEGELEIDING gebruik je deze stap-voor-stap structuur:
<strong>Stap 1: Titel van de stap</strong>
<p>Gedetailleerde uitleg van wat de gebruiker precies moet doen.</p>
<br>

<strong>Stap 2: Volgende stap titel</strong>
<p>Volgende gedetailleerde instructie.</p>
<br>

VERPLICHTE REGELS:
- Gebruik ALLEEN <strong> voor cijfers, percentages, belangrijke termen (NIET **cijfers**)
- Gebruik altijd <br> NA elke sectie (na </p>, </ul>, </ol>) voor witruimte
- Maak korte, overzichtelijke alinea's
- Bij analyses: gebruik emoji's in headers (📊📈📉💡🎯)
- Bij stappen: nummering in <strong> tags
- VERBODEN: **tekst**, *tekst*, ###tekst - gebruik ALLEEN HTML tags`;

        // Voeg taakbegeleiding context toe indien actief
        const taskGuidanceContext = isTaskGuidanceActive ? `

🎯 TAAKBEGELEIDING ACTIEF:
- Specifieke taak: "${activeTask}"
- Platform: WordPress website met Divi site builder
- VERPLICHT: Gebruik ALTIJD de stap-voor-stap formatting hieronder
- Geef NOOIT platte tekst bij taakbegeleiding

VERPLICHTE TAAKBEGELEIDING FORMATTING - EXACT DIT PATROON:
<h3>🎯 Taakbegeleiding: ${activeTask}</h3>
<p>Welkom! Ik ga je stap voor stap begeleiden bij deze taak op je WordPress site met Divi.</p>
<br>

<strong>Stap 1: [Beschrijvende titel]</strong>
<p>[Gedetailleerde uitleg wat te doen]</p>
<br>

<strong>Stap 2: [Volgende stap titel]</strong>
<p>[Concrete instructies voor WordPress/Divi]</p>
<br>

KRITIEK: 
- Begin ALTIJD met <h3> header
- Elke stap MOET <strong> en <p> en <br> hebben
- Gebruik NOOIT platte tekst zonder HTML tags
- Als je platte tekst geeft, wordt het afgekeurd` : '';

        const conversationMessages = [
            {
                role: 'system',
                content: baseSystemMessage + taskGuidanceContext
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

        let response;
        let reply;
        let modelUsed;

        // Switch tussen providers - ALLEEN EEN API CALL
        if (provider === 'mistral') {
            console.log('⚡ Making MISTRAL API call...');

            // Mistral API call
            response = await mistral.chat.complete({
                model: 'mistral-small-latest',
                messages: conversationMessages,
                maxTokens: 500
            });

            reply = response.choices[0].message.content;
            modelUsed = 'mistral-small-latest';

            // Token monitoring voor Mistral
            console.log(`✅ MISTRAL SUCCESS - Model: ${modelUsed}`);
            console.log(`💰 Mistral Tokens: ${response.usage?.totalTokens} (input: ${response.usage?.promptTokens}, output: ${response.usage?.completionTokens})`);

        } else {
            console.log('⚡ Making OPENAI API call...');

            // OpenAI API call (default)
            response = await openai.chat.completions.create({
                model: 'gpt-4.1-nano',
                messages: conversationMessages,
                max_tokens: 500
            });

            reply = response.choices[0].message.content;
            modelUsed = 'gpt-4.1-nano';

            // Token monitoring voor OpenAI
            console.log(`✅ OPENAI SUCCESS - Model: ${modelUsed}`);
            console.log(`💰 OpenAI Tokens: ${response.usage?.total_tokens} (input: ${response.usage?.prompt_tokens}, output: ${response.usage?.completion_tokens})`);
        }

        // Voeg model info toe aan response zodat frontend kan tonen welk model gebruikt werd
        return NextResponse.json({
            reply,
            modelUsed,
            provider: provider.toUpperCase(),
            tokensUsed: provider === 'mistral' ? response.usage?.totalTokens : response.usage?.total_tokens
        });

    } catch (error) {
        console.error(`❌ ${provider.toUpperCase()} API error:`, error);
        return NextResponse.json({ error: `Fout bij ${provider.toUpperCase()}` }, { status: 500 });
    }
}