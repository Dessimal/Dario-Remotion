export type Direction = 'bl-br' | 'br-bl' | 'tl-tr' | 'tr-tl';

export type Beat = {
  id: string;
  image: string;        // filename inside public/assets/keyed/
  direction: Direction; // enter corner → exit corner
  holdFrames: number;   // how long it stays on screen
  caption?: string;
};

export const BEATS: Beat[] = [
  
];
