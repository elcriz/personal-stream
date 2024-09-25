export type Language = 'nl' | 'en';

export type LanguageLabel = {
  [key: string]: { [key: string]: string }
};

export type Label = {
  [key: string]: string;
};

export type Position = {
  x: number;
  y: number;
};

export type GeoItem = {
  id: number;
  name: Label;
  position: Position;
};

export type Question = {
  item: GeoItem;
  options: number[];
};

export type Message = {
  variant: 'correct' | 'incorrect';
  text: string;
};

export type GameType =
  'countries' |
  'cities' |
  'mountainRanges' |
  'rivers' |
  'capitals' |
  'areas';
