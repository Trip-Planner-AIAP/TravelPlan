import type { TripTemplate } from '../types';

export const tripTemplates: TripTemplate[] = [
  {
    id: 'tokyo_adventure',
    title: 'Tokyo Adventure',
    destination: 'Tokyo, Japan',
    duration_days: 5,
    estimated_budget: 1200,
    image_url: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Experience the perfect blend of traditional and modern Japan',
    days: [
      {
        day_number: 1,
        activities: [
          {
            title: 'Arrive at Narita Airport',
            description: 'International flight arrival',
            activity_type: 'flight',
            estimated_cost: 450,
            duration_minutes: 180,
            order_index: 0
          },
          {
            title: 'Check-in at Shibuya Hotel',
            description: 'Modern hotel in the heart of Tokyo',
            activity_type: 'hotel',
            estimated_cost: 120,
            duration_minutes: 60,
            order_index: 1
          },
          {
            title: 'Explore Shibuya Crossing',
            description: 'World\'s busiest pedestrian crossing',
            activity_type: 'attraction',
            estimated_cost: 0,
            duration_minutes: 120,
            order_index: 2
          }
        ]
      },
      {
        day_number: 2,
        activities: [
          {
            title: 'Visit Senso-ji Temple',
            description: 'Tokyo\'s oldest temple in Asakusa',
            activity_type: 'attraction',
            estimated_cost: 0,
            duration_minutes: 180,
            order_index: 0
          },
          {
            title: 'Lunch at Tsukiji Market',
            description: 'Fresh sushi and seafood',
            activity_type: 'meal',
            estimated_cost: 35,
            duration_minutes: 90,
            order_index: 1
          },
          {
            title: 'Tokyo Skytree Observatory',
            description: 'Panoramic city views',
            activity_type: 'attraction',
            estimated_cost: 25,
            duration_minutes: 120,
            order_index: 2
          }
        ]
      }
    ]
  },
  {
    id: 'paris_romance',
    title: 'Paris Romance',
    destination: 'Paris, France',
    duration_days: 4,
    estimated_budget: 980,
    image_url: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'A romantic getaway through the City of Light',
    days: [
      {
        day_number: 1,
        activities: [
          {
            title: 'Arrive at Charles de Gaulle',
            description: 'International flight arrival',
            activity_type: 'flight',
            estimated_cost: 380,
            duration_minutes: 180,
            order_index: 0
          },
          {
            title: 'Seine River Cruise',
            description: 'Romantic evening cruise',
            activity_type: 'attraction',
            estimated_cost: 45,
            duration_minutes: 120,
            order_index: 1
          },
          {
            title: 'Dinner at Le Comptoir',
            description: 'Traditional French bistro',
            activity_type: 'meal',
            estimated_cost: 85,
            duration_minutes: 120,
            order_index: 2
          }
        ]
      }
    ]
  },
  {
    id: 'bali_escape',
    title: 'Bali Escape',
    destination: 'Bali, Indonesia',
    duration_days: 7,
    estimated_budget: 800,
    image_url: 'https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Tropical paradise with beaches, temples, and culture',
    days: [
      {
        day_number: 1,
        activities: [
          {
            title: 'Arrive at Ngurah Rai Airport',
            description: 'International flight arrival',
            activity_type: 'flight',
            estimated_cost: 320,
            duration_minutes: 180,
            order_index: 0
          },
          {
            title: 'Check-in at Ubud Resort',
            description: 'Luxury resort in rice terraces',
            activity_type: 'hotel',
            estimated_cost: 80,
            duration_minutes: 60,
            order_index: 1
          },
          {
            title: 'Sunset at Tanah Lot Temple',
            description: 'Iconic temple on the sea',
            activity_type: 'attraction',
            estimated_cost: 15,
            duration_minutes: 180,
            order_index: 2
          }
        ]
      }
    ]
  }
];