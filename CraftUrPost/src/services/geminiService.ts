import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface GenerationOptions {
  prompt: string;
  style: string;
  category: string;
  aspectRatio: "1:1" | "4:5" | "16:9" | "9:16";
  logoBase64?: string;
  logoMimeType?: string;
  referenceUrl?: string;
}

export async function analyzeReferenceUrl(url: string, language: string = 'English'): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash",
    contents: `Analyze the visual style of this social media post: ${url}. 
    Provide a detailed technical description for an image generation model. 
    Focus on:
    1. Lighting (type, direction, intensity)
    2. Color Palette (primary colors, accents, saturation)
    3. Composition (framing, depth of field, perspective)
    4. Materiality (textures, finishes)
    5. Overall Aesthetic (mood, era, brand positioning)
    Be concise but highly descriptive.
    
    IMPORTANT: If you provide any human-readable summary, it MUST be in ${language}.`,
    config: {
      tools: [{ urlContext: {} }]
    }
  });

  return response.text || "";
}

export interface TrendItem {
  title: string;
  description: string;
  url: string;
  platform: string;
  tags: string[];
  imageUrl: string;
}

export interface MusicTrend {
  rank: number;
  title: string;
  artist: string;
  isCopyrightFree: boolean;
  usageCount: string;
  trendReason: string;
  coverUrl: string;
}

export async function searchTrends(query: string, language: string = 'English'): Promise<TrendItem[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find at least 10 highly specific and latest visual trends and top performing social media posts related to "${query}". 
    Focus on niche aesthetics, specific content formats, and viral hooks on platforms like Instagram, Pinterest, and TikTok. 
    Return the results as a list of items, each with a title, a detailed description of why it's trending right now, its source URL, and a relevant high-quality image URL that represents the trend visually.
    
    IMPORTANT: The title and description MUST be in ${language}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            url: { type: Type.STRING },
            platform: { type: Type.STRING },
            imageUrl: { type: Type.STRING, description: "A high-quality image URL relevant to the trend topic." },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
          },
          required: ["title", "description", "url", "platform", "tags", "imageUrl"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse trends JSON", e);
    return [];
  }
}

export async function getTrendingMusic(language: string = 'English'): Promise<MusicTrend[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide a ranking of the top 10 most used songs on social media (TikTok, Instagram Reels) right now. 
    Include both mainstream hits (copyrighted) and popular copyright-free/royalty-free tracks used by creators.
    For each song, provide: rank, title, artist, whether it is copyright-free (boolean), estimated usage count/popularity, a brief reason why it's trending, and a high-quality square cover image URL for the song.
    
    IMPORTANT: The descriptions MUST be in ${language}.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            rank: { type: Type.NUMBER },
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            isCopyrightFree: { type: Type.BOOLEAN },
            usageCount: { type: Type.STRING },
            trendReason: { type: Type.STRING },
            coverUrl: { type: Type.STRING, description: "A high-quality square cover image URL for the song." },
          },
          required: ["rank", "title", "artist", "isCopyrightFree", "usageCount", "trendReason", "coverUrl"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse music trends JSON", e);
    return [];
  }
}

export async function analyzeSocialPost(fileBase64: string, mimeType: string, goals: string, platform: string, language: string = 'English'): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        {
          inlineData: {
            data: fileBase64,
            mimeType: mimeType
          }
        },
        {
          text: `You are a world-class Social Media Marketer with 15+ years of experience in digital strategy, content creation, and growth hacking. 
          Analyze this ${mimeType.startsWith('video') ? 'video' : 'image/graphic'} for a ${platform} post.
          The user's goals are: ${goals}.
          
          Provide a comprehensive, actionable audit. Use Markdown for formatting.
          Structure your response with the following sections:
          
          # 🎯 Analisi Obiettivi
          (Evaluate if the content meets the user's goals)
          
          # 👁️ Impatto Visivo
          (Composition, colors, and "thumb-stop" ability)
          
          # 📈 Engagement & Hook
          (What will make people comment, share, or save?)
          
          # 📱 Ottimizzazione Platform
          (Is this optimized for ${platform}?)
          
          # ⚡ Quick Wins (Azioni Immediate)
          (List 3-5 immediate changes to improve the post)
          
          # 🚀 Strategia a Lungo Termine
          (Advice for future content)
          
          # ⭐ Voto Finale
          (Give a score from 1 to 10 with a brief justification)
          
          Be direct, professional, and slightly edgy - like a high-paid consultant.
          
          IMPORTANT: You MUST respond in ${language}.`
        }
      ]
    }
  });

  return response.text || "I couldn't analyze the post at this moment. Please try again.";
}

export async function chatWithMarketer(history: { role: 'user' | 'model'; text: string }[], message: string, fileBase64?: string, mimeType?: string, language: string = 'English') {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const contents = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }]
  }));

  const userParts: any[] = [{ text: message }];
  if (fileBase64 && mimeType) {
    userParts.unshift({
      inlineData: {
        data: fileBase64,
        mimeType: mimeType
      }
    });
  }

  contents.push({
    role: 'user',
    parts: userParts
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents,
    config: {
      systemInstruction: `You are a world-class Social Media Marketer. You are continuing a conversation about an audit you just performed. Be helpful, strategic, and professional. Keep your answers concise and actionable. 
      IMPORTANT: You MUST respond in ${language}.`,
    }
  });

  return response.text || "I'm sorry, I couldn't process that request.";
}

export async function generateBrandPost({ prompt, style, category, aspectRatio, logoBase64, logoMimeType, referenceUrl }: GenerationOptions, language: string = 'English') {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = "gemini-2.5-flash-image";
  
  let styleContext = "";
  if (referenceUrl) {
    try {
      styleContext = await analyzeReferenceUrl(referenceUrl, language);
    } catch (e) {
      console.error("Failed to analyze URL, falling back to selected style", e);
    }
  }

  const stylePrompts: Record<string, string> = {
    minimalist: "Clean, minimalist aesthetic, lots of negative space, elegant typography, soft lighting, high-end product photography style.",
    brutalist: "Bold brutalist design, high contrast, raw textures, thick borders, neon accents, experimental layout, urban vibe.",
    luxury: "Luxury brand aesthetic, deep blacks and golds, silk textures, moody lighting, sophisticated and exclusive feel.",
    organic: "Warm organic feel, earthy tones, natural textures, soft sunlight, approachable and human-centric design.",
    tech: "Futuristic tech aesthetic, blue and purple glows, holographic elements, sleek surfaces, high-precision look.",
    vibrant: "Pop art vibrant style, saturated colors, energetic composition, playful and eye-catching.",
    retro: "Vintage 70s/80s aesthetic, grain textures, warm retro color palette, nostalgic feel, classic typography.",
    cyberpunk: "Cyberpunk aesthetic, high-tech low-life, neon pink and cyan, rainy streets, futuristic urban atmosphere.",
    pastel: "Soft pastel colors, dreamy atmosphere, gentle lighting, airy and light feel, cute and approachable.",
    editorial: "High-end magazine editorial style, dramatic lighting, sharp focus, professional fashion photography composition.",
    streetwear: "Urban streetwear vibe, gritty textures, graffiti elements, dynamic angles, raw and authentic."
  };

  const categoryContext: Record<string, string> = {
    general: "A professional commercial product shot.",
    sport: "Dynamic athletic environment, motion blur, high energy, fitness-focused lighting.",
    fashion: "High-fashion runway or studio setting, focus on fabric textures and style, elegant posing.",
    food: "Appetizing food photography, macro shots, fresh ingredients, warm kitchen or restaurant lighting.",
    beauty: "Soft beauty lighting, focus on skin textures and product details, clean and polished aesthetic.",
    tech_gadgets: "Sleek tech showcase, clean surfaces, focus on hardware details and innovation.",
    travel: "Scenic travel background, adventurous atmosphere, natural lighting, wide-angle feel."
  };

  // Dynamic enhancement based on style + category
  const getTailoredEnhancement = (s: string, c: string) => {
    const enhancements: Record<string, Record<string, string>> = {
      minimalist: {
        fashion: "minimalist fashion photography, clean product shots, neutral tones",
        beauty: "clean beauty aesthetic, minimalist skincare photography",
        food: "minimalist food styling, clean table setting, top-down minimalist shot",
        tech_gadgets: "minimalist product design, clean tech surfaces, sleek hardware photography",
        sport: "minimalist athletic gear, clean gym environment, focused minimalist composition"
      },
      luxury: {
        fashion: "luxury fashion editorial, high-end couture photography, premium studio lighting",
        beauty: "premium luxury beauty shots, sophisticated lighting, high-end cosmetic aesthetic",
        food: "fine dining luxury food photography, elegant plating, moody restaurant atmosphere",
        tech_gadgets: "luxury tech showcase, premium materials, high-end industrial design photography",
        travel: "luxury travel destination, exclusive resort aesthetic, premium vacation vibe"
      },
      brutalist: {
        fashion: "brutalist fashion shoot, raw industrial background, high-contrast edgy style",
        tech_gadgets: "raw tech brutalism, industrial hardware design, bold tech aesthetic",
        sport: "raw brutalist gym, high-intensity industrial workout vibe"
      },
      organic: {
        food: "organic farm-to-table food photography, natural sunlit kitchen, rustic textures",
        beauty: "natural organic beauty, soft botanical elements, clean green beauty aesthetic",
        fashion: "organic sustainable fashion, natural outdoor setting, soft earthy tones"
      },
      tech: {
        tech_gadgets: "futuristic tech innovation, holographic hardware display, sleek digital surfaces",
        sport: "high-tech athletic performance, futuristic gym equipment, neon-lit fitness",
        fashion: "futuristic techwear fashion, digital aesthetic, high-tech fabric textures"
      }
    };
    return enhancements[s]?.[c] || "";
  };

  const tailoredEnhancement = getTailoredEnhancement(style, category);

  const fullPrompt = `Create a professional high-end commercial brand post.
  Category: ${categoryContext[category] || category}.
  Subject: ${prompt}. 
  ${tailoredEnhancement ? `Tailored Enhancement: ${tailoredEnhancement}.` : ""}
  ${referenceUrl && styleContext ? `MANDATORY STYLE REFERENCE: Replicate the exact visual DNA of this style: ${styleContext}` : `Style: ${stylePrompts[style] || style}.`}
  The design MUST be optimized for a ${aspectRatio} aspect ratio. 
  ${logoBase64 ? "Incorporate the provided brand logo seamlessly into the design. The logo should look like it was professionally placed by a graphic designer, respecting the lighting and perspective of the scene." : "Ensure the design has a clear, aesthetically pleasing area where a brand logo could be placed."}
  Technical specs: Professional studio lighting, 8k resolution, commercial photography, sharp focus, clean composition, high-end post-production.`;

  const contents: any = {
    parts: [
      { text: fullPrompt }
    ]
  };

  if (logoBase64 && logoMimeType) {
    contents.parts.unshift({
      inlineData: {
        data: logoBase64,
        mimeType: logoMimeType
      }
    });
  }

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      imageConfig: {
        aspectRatio: aspectRatio
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image was generated");
}
