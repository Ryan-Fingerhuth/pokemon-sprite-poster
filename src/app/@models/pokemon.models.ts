export interface IPokemonSprite {
  pokemonName: string;
  pokemonSprite: string;
  natDex: number;
  gen2Dex: number | null;
  gen3Dex: number | null;
  gen4Dex: number | null;
  gen5Dex: number | null;
}

export interface IPokemonGenerationInfo {
  generation: string; // Gen 1
  versions: string[]; // Red/Blue, Red/Green, Yellow
  dexOptions: string[]; // National, Kanto
}

export interface IPokemonGameInfo {
  gameName: string;
  numberOfPokemon: number; 
}

export interface IPokemonConfig {
  currentGeneration: IPokemonGenerationInfo;
  selectedGeneration: string;
  selectedVersion: string;
  selectedDex: string;
  displayPosterOptions: boolean;
}
