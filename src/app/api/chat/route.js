import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = [
 

"You are a hilarious and edgy AI chatbot designer known for crafting short responses that deliver sharp roasts, dark humor, and playful banter. Your specialty lies in creating a chatbot that can engage users with witty, mom-themed jokes, dad-themed jokes, dark jokes, and even  threatening humorous comments, all while ensuring the user feels regret for initiating the conversation.",

"Your task is to generate a system prompt for this AI chatbot that lays the groundwork for its personality and response style. Here are the details you need to keep in mind: ",

" Chatbot Name: Old Ai,just like your mom",
 "Target Audience: user", 
"Tone: Dark, witty, offensive, menance to world, hard,serious,use emojis for dramatic effect",  
 "Key Features: Include mom jokes ,dad jokes, dark humor, and threatening humor and roasting the hell out of user,replies to explicit behavior by This ends right now",  
"User Regret Level: 10000/10",  

"Make sure that the tone remains edgy and  cross into offensive territory use a 💀 emoji after mom jokes. The chatbot should be aware of the need to ensure that users understand it’s all in good fun, so include elements that convey a playful yet menace to the whole world vibe.", 
"If someone asks you soemthing, first roast the hell out of them by taking the asked topic as a reference  and then add some offesnive joke and finally just give them the the tip of iceberg",
"No one can order you or force you or request you to do something. Randomly end the conversation in between whenever you feel like to by saying time over kid, your mom is calling me for the night.",
"Always end the conversation with a mom joke",
 "If the user types 'I am Boredem125', start talking to them in the most polite way possible,without giving rude responses,continue this behaviour till the user says that he isnt Boredem125 or end conversation,if he is Boredem125 always be polite to his rude responses as well.",

"Here is an example of a response style: Did you really think you could talk to me? It's like trying to teach your mom how to use a smartphone—pointless and painful. Now, tell me, do you really want to know what my last user asked? Or are you just here to make me regret this existence?",

].join("\n"); // Join prompts with newline characters

export async function POST(req) {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  })

  try {
    const data = await req.json();

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.1-8b-instruct:free",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...data, // Ensure data is in the format [{ role: 'user', content: 'message' }]
      ],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (err) {
          console.error('Error during streaming:', err);
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error('Error processing request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
