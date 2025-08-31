import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from "openai";
import env from '@/lib/env';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const niche = formData.get('niche') as string;
    const videoDescription = formData.get('videoDescription') as string;
    const imageFile = formData.get('image') as File;

    if (!niche || !videoDescription || !imageFile) {
      return NextResponse.json(
        { error: 'Missing required fields: niche, videoDescription, and image are required' },
        { status: 400 }
      );
    }

    // Convert uploaded image to base64
    const imageBuffer = await imageFile.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');
    const imageMimeType = imageFile.type;

    // Initialize GoogleGenAI with API key
    const ai = new GoogleGenAI({
      apiKey: env.GEMINI_API_KEY,
    });

    const system_prompt = `The image resolution should be minimum 1920 X 1080, the thumbnail should be made as to telling a story, It must include keywords related to the video which you will to know about the video description which is this : ${videoDescription}, make the thumbnail such that it gives the viewers a reason to click the video. but always keep the thumbnails SIMPLE, don't use no more than 2 3 objects in the thumbnail but all of them should stand out, keep the title text text short and simple. Max character limit : 45 characters. If you could communicate the video better without title text then remove it, use these ideas depending on niche : ${niche} and description : ${videoDescription} : 1) Question or tension 2) FOMO or fear of missing out 3) Idea on hyperdrive, use the given image in the thumbnail on either side or center depending on which would look better depending on the niche: ${niche} and video description: ${videoDescription}. Make the thumbnail based on this questions : 1) what is the video getting out of this video for example if it is a education video about React library the viewer is getting information and learning out of this video another example is if it is a cooking video the user is getting out a recipe of a particular dish, if text is there is should be big enough, clear and visible so that it is eye catching and visible on all screen sizes but it should not ignore the simplisity critiria`

    // Create thumbnail generation prompt (keeping your original prompt)
    

const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });

const responsegpt = await openai.responses.create({
    model: "gpt-5-nano",
    input: `You are a professional prompt writer, write a prompt for creating a thumbnail for youtube, I have the image of a person and the description of the video, the description of the video is : ${videoDescription}, the video category and niche is ${niche}, using the first description find out what elements you can add to make the video thumbnail appealing and clickable but simple and tell it in the prompt which you will return, so for example if the niche is education and videoDescription is 'react library' so you will give a prompt to create a thumbnail for it which will include picture elements which will signify and imply that this video is about react library`
});

    // Prepare contents array with text prompt and image
    const contents = [
      {
        role : "model",
        parts : [
          { text: system_prompt }
        ],
      },
      {
        role: 'user',
        parts: [
          { text: responsegpt.output_text || '' },
          {
            inlineData: {
              mimeType: imageMimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ];

    // Generate thumbnail using gemini-2.5-flash-image-preview
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: contents,
    });

    let generatedImages: Array<{ data: string; mimeType: string }> = [];

    // Process response parts
    if (response?.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.text) {
          console.log('Generated text:', part.text);
        } else if (part.inlineData) {
          generatedImages.push({
            data: part.inlineData.data || '',
            mimeType: part.inlineData.mimeType || 'image/png',
          });
        }
      }
    }

    if (generatedImages.length === 0) {
      return NextResponse.json(
        { error: 'No thumbnail images were generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      thumbnails: generatedImages,
      prompt: responsegpt.output_text,
    });

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate thumbnail', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}