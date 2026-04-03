export interface Ticket {
  id: number;          
  event_id: number;
  name: string;
  price: number;
  stock: number;
}

export interface EventData {
  id: number;          
  title: string;
  description: string | null;
  event_date: string;
  venue: string | null;
  banner_url: string | null;
}