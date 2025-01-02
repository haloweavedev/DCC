export interface Coach {
    id: number;
    name: string;
    specialty: string;
    bio: string;
    imageUrl: string;
    expertise: string[];
    rating: number;
    totalSessions: number;
    about?: string;
    approach?: string;
    availability?: string[];
    testimonials?: {
      text: string;
      author: string;
      role: string;
    }[];
  }

  export interface KnowledgeBase {
    id: string;
    title: string;
    content: string;
    type: string;
    sourceUrl?: string;
    addedBy: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export type SubscriptionTier = 'free' | 'basic' | 'premium';