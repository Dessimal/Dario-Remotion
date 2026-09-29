export type Direction = 'bl-br' | 'br-bl' | 'tl-tr' | 'tr-tl';

export type Beat = {
  id: string;
  image: string;
  direction: Direction;
  startWordId: string; // e.g. 'word_142'
  endWordId: string;   // e.g. 'word_158'
  sfx?: 'standard' | 'impact';
  caption?: string;
};

export const BEATS: Beat[] = [
  
];
