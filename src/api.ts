import { Model, PaperConfig } from './types';

const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function generatePrompt(config: PaperConfig): string {
  return `Generate a comprehensive, publication-ready ${config.citationStyle.toUpperCase()}-formatted research paper on "${config.topic}" following these strict requirements:

1. Format Requirements:
   - Double-column layout
   - Times New Roman font
   - Section numbering
   - ${config.citationStyle.toUpperCase()} citation format
   - Target word count: ${config.wordCount} words
   - Number of references: ${config.referenceCount}
   - Academic level: ${config.academicLevel}

2. Required Sections and Guidelines:
   - Title (centered, 24pt font)
   - Abstract (250-300 words, structured with background, methods, results, and conclusions)
   - Keywords (4-6 relevant terms)
   
   - Introduction (20% of content)
     * Clear research context and background
     * Literature review with proper citations
     * Research gap identification
     * Clear objectives and hypotheses
   
   - Methodology (25% of content)
     * Detailed research design
     * Data collection methods
     * Analysis procedures
     * Validation methods
   
   - Results (25% of content)
     * Structured findings presentation
     * Statistical analysis results
     * Key observations
   
   - Discussion (20% of content)
     * Interpretation of results
     * Comparison with existing literature
     * Implications of findings
     * Study limitations
   
   - Conclusion (10% of content)
     * Summary of key findings
     * Research contributions
     * Future research directions
   
   - References
     * ${config.referenceCount} recent and relevant references
     * Strict ${config.citationStyle.toUpperCase()} format
     * Mix of journal articles, books, and conference papers

3. Citation Requirements:
   - Use square brackets for citations [1], [2], etc.
   - Minimum 2-3 citations per paragraph
   - Cite all references at least once
   - Use a mix of direct quotes and paraphrasing
   - Follow ${config.citationStyle.toUpperCase()} citation format strictly
   - Number references sequentially in order of appearance

4. Quality Requirements:
   - Academic writing style appropriate for ${config.academicLevel} level
   - Clear logical flow between sections
   - Critical analysis and evaluation
   - Original insights and contributions
   - Professional terminology

IMPORTANT: Format all citations using square brackets (e.g., [1], [2], etc.) and ensure they are properly linked to the references section.`;
}

export async function generateResearchPaper(config: PaperConfig, onProgress?: (chunk: string) => void): Promise<string> {
  const prompt = generatePrompt(config);

  if (!OPENROUTER_KEY && !GEMINI_KEY) {
    throw new Error('API keys not found. Please ensure environment variables are properly set.');
  }

  if (config.model === 'gemini-2.0') {
    if (!GEMINI_KEY) {
      throw new Error('Gemini API key not found. Please ensure VITE_GEMINI_API_KEY is set.');
    }
    return generateWithGemini(prompt, onProgress);
  } else {
    if (!OPENROUTER_KEY) {
      throw new Error('OpenRouter API key not found. Please ensure VITE_OPENROUTER_API_KEY is set.');
    }
    return generateWithDeepseek(prompt, onProgress);
  }
}

async function generateWithDeepseek(prompt: string, onProgress?: (chunk: string) => void): Promise<string> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Research Paper Generator"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
        stream: true
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to generate research paper');
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Stream not supported');

    let content = '';
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.choices?.[0]?.delta?.content) {
              const text = data.choices[0].delta.content;
              content += text;
              if (onProgress) onProgress(text);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
            // Continue processing other chunks
          }
        }
      }
    }

    return content;
  } catch (error) {
    console.error('Generation Error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate research paper');
  }
}

async function generateWithGemini(prompt: string, onProgress?: (chunk: string) => void): Promise<string> {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
          topK: 40,
          topP: 0.95
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_NONE"
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to generate with Gemini');
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response format from Gemini API');
    }

    let content = '';
    const text = data.candidates[0].content.parts[0].text;
    const chunkSize = 100; // Process 100 characters at a time
    
    // Simulate streaming by chunking the response
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.slice(i, i + chunkSize);
      content += chunk;
      if (onProgress) {
        onProgress(chunk);
        // Add a small delay to simulate streaming
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }

    return content;
  } catch (error) {
    console.error('Generation Error:', error);
    throw error instanceof Error ? error : new Error('Failed to generate with Gemini');
  }
}