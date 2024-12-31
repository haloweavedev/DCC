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