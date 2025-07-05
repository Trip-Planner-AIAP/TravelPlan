import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { generateChecklist as generateChecklistAI, getLocalEssentials as getLocalEssentialsAI } from '../lib/openai';
import OpenAI from 'openai';

interface ChecklistItem {
  id: string;
  trip_id: string;
  category: 'documents' | 'clothing' | 'electronics' | 'health' | 'misc';
  item_name: string;
  is_completed: boolean;
  priority: 1 | 2 | 3;
  created_at: string;
}

interface LocalEssentials {
  id: string;
  trip_id: string;
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
  created_at: string;
}

interface AIUsage {
  id: string;
  trip_id: string;
  function_name: string;
  tokens_used: number;
  created_at: string;
}

const TOKEN_LIMIT = 6000;
const ESTIMATED_TOKENS_PER_CALL = 1000; // More accurate estimate

export const useAIFeatures = (tripId: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check remaining tokens for the trip
  const checkTokenUsage = async (): Promise<{ remaining: number; canMakeCall: boolean }> => {
    try {
      const { data, error } = await supabase
        .from('ai_usage')
        .select('tokens_used')
        .eq('trip_id', tripId);

      if (error) throw error;

      const totalUsed = data?.reduce((sum, usage) => sum + usage.tokens_used, 0) || 0;
      const remaining = TOKEN_LIMIT - totalUsed;
      const canMakeCall = remaining >= ESTIMATED_TOKENS_PER_CALL;

      return { remaining, canMakeCall };
    } catch (err) {
      console.error('Error checking token usage:', err);
      return { remaining: TOKEN_LIMIT, canMakeCall: true };
    }
  };

  // Mock AI function call for checklist generation
  const generateChecklist = async (
    destination: string,
    durationDays: number,
    season?: string,
    activities?: string[]
  ): Promise<{ success: boolean; data?: ChecklistItem[]; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      // Check token usage first
      const { canMakeCall, remaining } = await checkTokenUsage();
      if (!canMakeCall) {
        throw new Error(`Token limit reached. ${remaining} tokens remaining`);
      }

      // Check if checklist already exists
      const { data: existingChecklist } = await supabase
        .from('checklist')
        .select('*')
        .eq('trip_id', tripId);

      if (existingChecklist && existingChecklist.length > 0) {
        return { success: true, data: existingChecklist };
      }

      // Call real OpenAI API
      let items, tokensUsed;
      
      try {
        const result = await generateChecklistAI(destination, durationDays, season, activities);
        items = result.items;
        tokensUsed = result.tokensUsed;
      } catch (apiError) {
        // If quota exceeded or other API error, fall back to mock data
        if ((apiError instanceof OpenAI.APIError && apiError.status === 429) || 
            (apiError instanceof Error && apiError.message.toLowerCase().includes('quota'))) {
          console.log('OpenAI quota exceeded, falling back to mock data');
          const mockItems = generateMockChecklist(destination, durationDays, season, activities);
          items = mockItems;
          tokensUsed = 0; // No tokens used for mock data
          setError(null); // Clear any error state since we're using fallback
        } else {
          throw apiError; // Re-throw other API errors
        }
      }

      // Insert checklist items
      const { data: insertedItems, error: insertError } = await supabase
        .from('checklist')
        .insert(
          items.map((item: any) => ({
            trip_id: tripId,
            category: item.category || item.item_name,
            item_name: item.name || item.item_name,
            priority: item.priority
          }))
        )
        .select();

      if (insertError) throw insertError;

      // Track AI usage
      await supabase
        .from('ai_usage')
        .insert({
          trip_id: tripId,
          function_name: 'generate_checklist',
          tokens_used: tokensUsed
        });

      return { success: true, data: insertedItems };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate checklist';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Mock AI function call for local essentials
  const getLocalEssentials = async (
    destination: string,
    currency?: string,
    travelDates?: string
  ): Promise<{ success: boolean; data?: LocalEssentials; error?: string }> => {
    setLoading(true);
    setError(null);

    try {
      // Check token usage first
      const { canMakeCall, remaining } = await checkTokenUsage();
      if (!canMakeCall) {
        throw new Error(`Token limit reached. ${remaining} tokens remaining`);
      }

      // Check if essentials already exist
      const { data: existingEssentials } = await supabase
        .from('essentials')
        .select('*')
        .eq('trip_id', tripId)
        .maybeSingle();

      if (existingEssentials) {
        return { success: true, data: existingEssentials };
      }

      // Call real OpenAI API
      let essentials, tokensUsed;
      
      try {
        const result = await getLocalEssentialsAI(destination, currency, travelDates);
        essentials = result.essentials;
        tokensUsed = result.tokensUsed;
      } catch (apiError) {
        // If quota exceeded or other API error, fall back to mock data
        if ((apiError instanceof OpenAI.APIError && apiError.status === 429) || 
            (apiError instanceof Error && apiError.message.toLowerCase().includes('quota'))) {
          console.log('OpenAI quota exceeded, falling back to mock data');
          essentials = generateMockEssentials(destination, currency);
          tokensUsed = 0; // No tokens used for mock data
          setError(null); // Clear any error state since we're using fallback
        } else {
          throw apiError; // Re-throw other API errors
        }
      }

      // Insert essentials
      const { data: insertedEssentials, error: insertError } = await supabase
        .from('essentials')
        .insert({
          trip_id: tripId,
          sim_info: essentials.sim_info,
          forex_info: essentials.forex_info,
          safety_notes: essentials.safety_notes
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Track AI usage
      await supabase
        .from('ai_usage')
        .insert({
          trip_id: tripId,
          function_name: 'get_local_essentials',
          tokens_used: tokensUsed
        });

      return { success: true, data: insertedEssentials };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get local essentials';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update checklist item completion status
  const updateChecklistItem = async (itemId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('checklist')
        .update({ is_completed: isCompleted })
        .eq('id', itemId);

      if (error) throw error;
      return { success: true };
    } catch (err) {
      console.error('Error updating checklist item:', err);
      return { success: false, error: err instanceof Error ? err.message : 'Update failed' };
    }
  };

  // Get checklist for trip
  const getChecklist = async (): Promise<ChecklistItem[]> => {
    try {
      const { data, error } = await supabase
        .from('checklist')
        .select('*')
        .eq('trip_id', tripId)
        .order('priority', { ascending: true })
        .order('category', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching checklist:', err);
      return [];
    }
  };

  // Get essentials for trip
  const getEssentials = async (): Promise<LocalEssentials | null> => {
    try {
      const { data, error } = await supabase
        .from('essentials')
        .select('*')
        .eq('trip_id', tripId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching essentials:', err);
      return null;
    }
  };

  return {
    loading,
    error,
    generateChecklist,
    getLocalEssentials,
    updateChecklistItem,
    getChecklist,
    getEssentials,
    checkTokenUsage
  };
};

// Mock checklist generation based on destination and trip details
function generateMockChecklist(
  destination: string,
  durationDays: number,
  season?: string,
  activities?: string[]
): Omit<ChecklistItem, 'id' | 'trip_id' | 'created_at' | 'is_completed'>[] {
  const baseItems = [
    // Documents (Priority 1 - High)
    { category: 'documents' as const, item_name: 'Passport', priority: 1 as const },
    { category: 'documents' as const, item_name: 'Travel insurance documents', priority: 1 as const },
    { category: 'documents' as const, item_name: 'Flight tickets/boarding passes', priority: 1 as const },
    { category: 'documents' as const, item_name: 'Hotel reservations', priority: 2 as const },
    { category: 'documents' as const, item_name: 'Emergency contact information', priority: 1 as const },
    
    // Electronics (Priority 2 - Medium)
    { category: 'electronics' as const, item_name: 'Phone charger', priority: 1 as const },
    { category: 'electronics' as const, item_name: 'Power bank', priority: 2 as const },
    { category: 'electronics' as const, item_name: 'Camera', priority: 2 as const },
    { category: 'electronics' as const, item_name: 'Universal power adapter', priority: 1 as const },
    
    // Health (Priority varies)
    { category: 'health' as const, item_name: 'Prescription medications', priority: 1 as const },
    { category: 'health' as const, item_name: 'First aid kit', priority: 2 as const },
    { category: 'health' as const, item_name: 'Sunscreen', priority: 2 as const },
    
    // Clothing (Priority 2-3)
    { category: 'clothing' as const, item_name: 'Comfortable walking shoes', priority: 1 as const },
    { category: 'clothing' as const, item_name: 'Weather-appropriate clothing', priority: 1 as const },
    { category: 'clothing' as const, item_name: 'Underwear and socks', priority: 1 as const },
    { category: 'clothing' as const, item_name: 'Sleepwear', priority: 2 as const },
    
    // Misc
    { category: 'misc' as const, item_name: 'Cash in local currency', priority: 1 as const },
    { category: 'misc' as const, item_name: 'Credit/debit cards', priority: 1 as const },
    { category: 'misc' as const, item_name: 'Toiletries', priority: 1 as const },
    { category: 'misc' as const, item_name: 'Travel pillow', priority: 3 as const }
  ];

  // Add destination-specific items
  const destinationLower = destination.toLowerCase();
  
  if (destinationLower.includes('japan')) {
    baseItems.push(
      { category: 'documents' as const, item_name: 'JR Pass (if applicable)', priority: 2 as const },
      { category: 'misc' as const, item_name: 'Pocket WiFi device', priority: 2 as const },
      { category: 'clothing' as const, item_name: 'Modest clothing for temples', priority: 2 as const }
    );
  }
  
  if (destinationLower.includes('europe')) {
    baseItems.push(
      { category: 'documents' as const, item_name: 'European travel insurance', priority: 1 as const },
      { category: 'electronics' as const, item_name: 'European power adapter', priority: 1 as const }
    );
  }
  
  if (destinationLower.includes('tropical') || destinationLower.includes('bali') || destinationLower.includes('thailand')) {
    baseItems.push(
      { category: 'health' as const, item_name: 'Insect repellent', priority: 1 as const },
      { category: 'clothing' as const, item_name: 'Swimwear', priority: 1 as const },
      { category: 'clothing' as const, item_name: 'Light, breathable clothing', priority: 1 as const },
      { category: 'health' as const, item_name: 'Anti-diarrheal medication', priority: 2 as const }
    );
  }

  // Add duration-specific items
  if (durationDays > 7) {
    baseItems.push(
      { category: 'misc' as const, item_name: 'Laundry detergent packets', priority: 2 as const },
      { category: 'clothing' as const, item_name: 'Extra clothing for longer stay', priority: 2 as const }
    );
  }

  // Add season-specific items
  if (season === 'winter') {
    baseItems.push(
      { category: 'clothing' as const, item_name: 'Warm jacket/coat', priority: 1 as const },
      { category: 'clothing' as const, item_name: 'Gloves and hat', priority: 2 as const },
      { category: 'health' as const, item_name: 'Lip balm', priority: 2 as const }
    );
  } else if (season === 'summer') {
    baseItems.push(
      { category: 'clothing' as const, item_name: 'Hat/cap', priority: 2 as const },
      { category: 'clothing' as const, item_name: 'Sunglasses', priority: 2 as const },
      { category: 'health' as const, item_name: 'High SPF sunscreen', priority: 1 as const }
    );
  }

  return baseItems;
}

// Mock essentials generation based on destination
function generateMockEssentials(destination: string, currency?: string): Omit<LocalEssentials, 'id' | 'trip_id' | 'created_at'> {
  const destinationLower = destination.toLowerCase();
  
  // Default essentials structure
  let essentials = {
    sim_info: {
      provider: 'Local Telecom',
      cost: '$20-30/week',
      coverage: 'Nationwide',
      purchase_location: 'Airport or convenience stores'
    },
    forex_info: {
      currency: currency || 'USD',
      exchange_rate: '1 USD = 1.00 Local',
      best_exchange_locations: ['Banks', 'Official exchange counters'],
      cash_recommendations: 'Carry some cash for small vendors'
    },
    safety_notes: {
      emergency_numbers: {
        'Police': '911',
        'Fire/Medical': '911'
      },
      safety_tips: [
        'Keep copies of important documents',
        'Stay aware of your surroundings',
        'Use official transportation'
      ],
      cultural_notes: [
        'Respect local customs and traditions',
        'Dress modestly when visiting religious sites'
      ],
      health_recommendations: [
        'Drink bottled water',
        'Carry hand sanitizer'
      ]
    }
  };

  // Customize based on destination
  if (destinationLower.includes('japan') || destinationLower.includes('tokyo')) {
    essentials = {
      sim_info: {
        provider: 'SoftBank or NTT Docomo',
        cost: '¥3,000-5,000/week',
        coverage: 'Excellent nationwide coverage',
        purchase_location: 'Airport counters, electronics stores, or online'
      },
      forex_info: {
        currency: 'Japanese Yen (JPY)',
        exchange_rate: '1 USD ≈ 150 JPY',
        best_exchange_locations: ['7-Eleven ATMs', 'Post office ATMs', 'Airport exchange counters'],
        cash_recommendations: 'Japan is cash-heavy. Carry ¥10,000-20,000 daily'
      },
      safety_notes: {
        emergency_numbers: {
          'Police': '110',
          'Fire/Ambulance': '119',
          'Tourist Hotline': '050-3816-2787'
        },
        safety_tips: [
          'Japan is very safe, but stay alert in crowded areas',
          'Keep cash secure - crime is low but prevention is key',
          'Learn basic Japanese phrases for emergencies'
        ],
        cultural_notes: [
          'Bow when greeting people',
          'Remove shoes when entering homes/temples',
          'Don\'t eat or drink while walking',
          'Be quiet on public transportation',
          'Don\'t tip - it\'s not customary'
        ],
        health_recommendations: [
          'Tap water is safe to drink',
          'Carry a small towel (not provided in restrooms)',
          'Pharmacies have limited English - bring translations'
        ]
      }
    };
  } else if (destinationLower.includes('paris') || destinationLower.includes('france')) {
    essentials = {
      sim_info: {
        provider: 'Orange or SFR',
        cost: '€15-25/week',
        coverage: 'Excellent in cities, good in rural areas',
        purchase_location: 'Airport, Orange stores, or tabac shops'
      },
      forex_info: {
        currency: 'Euro (EUR)',
        exchange_rate: '1 USD ≈ 0.92 EUR',
        best_exchange_locations: ['Banks', 'Bureau de change', 'ATMs'],
        cash_recommendations: 'Cards widely accepted, carry €50-100 cash'
      },
      safety_notes: {
        emergency_numbers: {
          'Police': '17',
          'Fire/Medical': '18',
          'European Emergency': '112'
        },
        safety_tips: [
          'Watch for pickpockets in tourist areas and metro',
          'Avoid displaying expensive items',
          'Stay in well-lit areas at night'
        ],
        cultural_notes: [
          'Greet with "Bonjour/Bonsoir" when entering shops',
          'Learn basic French phrases - locals appreciate effort',
          'Dress well - appearance matters in France',
          'Lunch is typically 12-2pm, dinner after 7pm'
        ],
        health_recommendations: [
          'Tap water is safe to drink',
          'Pharmacies (green cross) for minor health issues',
          'European Health Insurance Card if from EU'
        ]
      }
    };
  } else if (destinationLower.includes('bali') || destinationLower.includes('indonesia')) {
    essentials = {
      sim_info: {
        provider: 'Telkomsel or XL Axiata',
        cost: 'Rp 50,000-100,000/week',
        coverage: 'Good in tourist areas, limited in remote areas',
        purchase_location: 'Airport, convenience stores, or official stores'
      },
      forex_info: {
        currency: 'Indonesian Rupiah (IDR)',
        exchange_rate: '1 USD ≈ 15,000 IDR',
        best_exchange_locations: ['Authorized money changers', 'Banks', 'ATMs'],
        cash_recommendations: 'Carry cash for local markets and small vendors'
      },
      safety_notes: {
        emergency_numbers: {
          'Police': '110',
          'Fire': '113',
          'Medical': '118',
          'Tourist Police': '+62 361 224111'
        },
        safety_tips: [
          'Use registered taxis or ride-sharing apps',
          'Be cautious with street food if you have a sensitive stomach',
          'Watch for strong currents when swimming'
        ],
        cultural_notes: [
          'Dress modestly, especially at temples',
          'Use right hand for eating and greeting',
          'Remove shoes before entering temples',
          'Bargaining is common at markets'
        ],
        health_recommendations: [
          'Drink bottled water',
          'Use mosquito repellent (dengue risk)',
          'Consider travel insurance for medical coverage',
          'Bring anti-diarrheal medication'
        ]
      }
    };
  }

  return essentials;
}