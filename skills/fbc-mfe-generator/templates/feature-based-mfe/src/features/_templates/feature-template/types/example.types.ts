/**
 * Example Types
 * 
 * TODO: Define your feature's TypeScript types and interfaces here
 */

export interface ExampleData {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

export interface ExampleFormData {
  name: string;
  description: string;
}

export type ExampleStatus = 'pending' | 'active' | 'completed' | 'cancelled';

// TODO: Add more types as needed
