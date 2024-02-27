export interface Venue {
  default: string;
}

export interface Team {
  id: number;
  name: Venue;
  abbrev: string;
  score?: number;
  sog?: number;
  logo: string;
  record?: string;
  hotelLink?: string;
  hotelDesc?: string;
  score?: number;
  airlineLink?: string;
  airlineDesc?: string;
  radioLink?: string;
}
