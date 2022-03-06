export interface Pokemon {
  id: number;
  name: string;
  image: null | string;
  type: PokemonType;
  hp: number;
  attack: number;
  defense: number;
  idAuthor: number;
  created_at: Date;
  updated_at: Date;
}

export const pokTypes = ['normal', 'poison', 'water', 'fire', 'bug'] as const;
export type PokemonType = typeof pokTypes[number];
