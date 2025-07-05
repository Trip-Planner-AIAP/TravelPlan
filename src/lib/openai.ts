import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for demo - in production, use server-side
});

export interface ChecklistItem {
  category: 'documents' | 'clothing' | 'electronics' | 'health' | 'misc';
  name: string;
  priority: 1 | 2 | 3;
}

export interface LocalEssentials {
  sim_info: {
    provider: string;
    cost: string;
    coverage: string;
    purchase_location: string;
  };
  forex_info: {
    currency: string;
    exchange_rate: string;
    best_exchange_locations: string[];
    cash_recommendations: string;
  };
  safety_notes: {
    emergency_numbers: { [key: string]: string };
    safety_tips: string[];
    cultural_notes: string[];
    health_recommendations: string[];
  };
}

export const generateChecklist = async (
  destination: string,
  durationDays: number,
  season?: string,
  activities?: string[]
): Promise<{ items: ChecklistItem[]; tokensUsed: number }> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a travel expert. Generate a comprehensive packing checklist for a trip. Return ONLY a JSON object with this exact structure:
{
  "items": [
    {"category": "documents", "name": "Passport", "priority": 1},
    {"category": "clothing", "name": "Weather-appropriate clothing", "priority": 1},
    {"category": "electronics", "name": "Phone charger", "priority": 1},
    {"category": "health", "name": "Prescription medications", "priority": 1},
    {"category": "misc", "name": "Cash in local currency", "priority": 1}
  ]
}

Categories must be: documents, clothing, electronics, health, misc
Priority: 1=high, 2=medium, 3=low
Include 15-25 items total.`
        },
        {
          role: "user",
          content: `Generate a packing checklist for:
- Destination: ${destination}
- Duration: ${durationDays} days
- Season: ${season || 'unknown'}
- Activities: ${activities?.join(', ') || 'general tourism'}

Focus on destination-specific items and practical essentials.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = completion.choices[0]?.message?.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    console.error('OpenAI API Error:', error.message);
    
    // Handle quota exceeded error gracefully
    if (error.message?.includes('exceeded your current quota')) {
      throw new Error('AI service temporarily unavailable due to quota limits. Please try again later or contact support.');
    }
    
    // Handle other API errors
    if (error.message?.includes('API')) {
      throw new Error('AI service is currently unavailable. Please try again later.');
    }
    
    // Handle JSON parsing errors
    if (error.message?.includes('JSON')) {
      throw new Error('Failed to process AI response. Please try again.');
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
    if (!parsed.items || !Array.isArray(parsed.items)) {
      throw new Error('Invalid response format from OpenAI');
    }

    return {
      items: parsed.items,
      tokensUsed
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Preserve the original error message for better error handling
    throw error;
  }
};

export const getLocalEssentials = async (
  destination: string,
  currency?: string,
  travelDates?: string
): Promise<{ essentials: LocalEssentials; tokensUsed: number }> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a local travel expert. Provide essential travel information for a destination. Return ONLY a JSON object with this exact structure:
{
  "sim_info": {
    "provider": "Local provider name",
    "cost": "Cost per week/month",
    "coverage": "Coverage description",
    "purchase_location": "Where to buy"
  },
  "forex_info": {
    "currency": "Local currency code",
    "exchange_rate": "Current approximate rate",
    "best_exchange_locations": ["Location 1", "Location 2"],
    "cash_recommendations": "Cash usage advice"
  },
  "safety_notes": {
    "emergency_numbers": {"Police": "number", "Fire": "number", "Medical": "number"},
    "safety_tips": ["Tip 1", "Tip 2", "Tip 3"],
    "cultural_notes": ["Note 1", "Note 2", "Note 3"],
    "health_recommendations": ["Rec 1", "Rec 2", "Rec 3"]
  }
}`
        },
        {
          role: "user",
          content: `Provide essential local information for:
- Destination: ${destination}
- Currency: ${currency || 'local currency'}
- Travel dates: ${travelDates || 'general'}

Include current, accurate information about SIM cards, money exchange, safety, and cultural tips.`
        }
      ],
      temperature: 0.3,
      max_tokens: 1200
    });

    const content = completion.choices[0]?.message?.content;
    const tokensUsed = completion.usage?.total_tokens || 0;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    const parsed = JSON.parse(content);
    
    return {
      essentials: parsed,
      tokensUsed
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    // Preserve the original error message for better error handling
    throw error;
  }
};