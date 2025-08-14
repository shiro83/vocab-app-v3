export interface Word {
  id: string;
  text: string;
  meaning: string;
  memorized: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}