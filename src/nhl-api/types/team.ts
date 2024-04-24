import { LocalizedName } from './localized-name';

export interface Team {
  id: number;
  name: LocalizedName;
  abbrev: string;
  score?: number;
  sog?: number;
  logo: string;
  record?: string;
  hotelLink?: string;
  hotelDesc?: string;
  airlineLink?: string;
  airlineDesc?: string;
  radioLink?: string;
}
