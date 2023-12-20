export interface Team {
  id: number;
  name: Venue;
  abbrev: string;
  score?: number;
  sog?: number;
  logo: string;
  record?: string;
  odds?: Odd[];
  hotelLink?: string;
  hotelDesc?: string;
  score?: number;
  airlineLink?: string;
  airlineDesc?: string;
  radioLink?: string;
}
