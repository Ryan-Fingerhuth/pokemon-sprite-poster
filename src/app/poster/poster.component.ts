import { Component, OnInit } from '@angular/core';
import { PokemonConstants, PokemonSpriteInfo, IPokemonSprite, IPokemonGenerationInfo } from '../@models';

@Component({
  selector: 'app-poster',
  templateUrl: './poster.component.html',
  styleUrls: ['./poster.component.css']
})
export class PosterComponent implements OnInit {
  private allPokemonSprites: IPokemonSprite[] = [];
  public pokemonSprites: IPokemonSprite[] = [];
  public displayPosterOptions: boolean = false;

  public pokemonGameVersionHeaderImage: string = 'assets/pokemon-logo.png';

  public height: string = '112px';
  public width: string = '112px';
  public widthNumber: number = 112;

  public currentGeneration: IPokemonGenerationInfo;

  public selectedGeneration: string;
  public selectedVersion: string;
  public selectedDex: string;

  public generationOptions: string[];
  public versionOptions: string[];
  public dexOptions: string[];

  constructor(
    public pokemonConstants: PokemonConstants,
    private pokemon: PokemonSpriteInfo
  ) {
  }

  ngOnInit(): void {
    this.currentGeneration = this.pokemonConstants.generations[1];

    this.selectedGeneration = this.currentGeneration.generation;
    this.selectedVersion = this.currentGeneration.versions[2];
    this.selectedDex = this.currentGeneration.dexOptions[0];

    this.generationOptions = this.pokemonConstants.generationOptions;
    this.versionOptions = this.currentGeneration.versions;
    this.dexOptions = this.currentGeneration.dexOptions;

    this.getSprites();
  }


  private getSprites(): void {
    this.pokemonSprites = [];

    if(!this.selectedGeneration) {
      return;
    }

    let pokemonList: IPokemonSprite[] = [];
    let folderName: string;
    let filePrefix: string;
    let extension: string;

    this.height = '112px';
    this.width = '112px';
    this.widthNumber = 112;

    if (this.selectedGeneration == 'Gen 1') {
      pokemonList = this.pokemon.PokemonGen1;

      if (!pokemonList) {
        return;
      }

      if (this.selectedVersion === this.pokemonConstants.PokemonRedBlue.gameName) {
        folderName = 'gen-1-red-blue';
        filePrefix = 'Spr_1b_';
        extension = 'png';
      }
      if (this.selectedVersion === this.pokemonConstants.PokemonRedGreen.gameName) {
        folderName = 'gen-1-red-green';
        filePrefix = 'Spr_1g_';
        extension = 'png';
      }
      if (this.selectedVersion === this.pokemonConstants.PokemonYellow.gameName) {
        folderName = 'gen-1-yellow';
        filePrefix = 'Spr_1y_';
        extension = 'png';
      }
      if (this.selectedVersion === this.pokemonConstants.PokemonLeafGreenFireRed.gameName) {
        folderName = 'gen-1-leafgreen-firered';
        filePrefix = '';
        extension = 'png';
      }
    }

    if (this.selectedGeneration == 'Gen 2') {
      pokemonList = this.pokemon.PokemonGen2;

      if (!pokemonList) {
        return;
      }
      
      if (this.selectedVersion === this.pokemonConstants.PokemonSilver.gameName) {
        folderName = 'gen-2-silver';
        filePrefix = 'Spr_2s_';
        extension = 'png';
      }
      if (this.selectedVersion === this.pokemonConstants.PokemonGold.gameName) {
        folderName = 'gen-2-gold';
        filePrefix = 'Spr_2g_';
        extension = 'png';
      }
      if (this.selectedVersion === this.pokemonConstants.PokemonCrystal.gameName) {
        folderName = 'gen-2-crystal';
        filePrefix = 'Spr_2c_';
        extension = 'png';
      }
    }

    if (this.selectedGeneration == 'Gen 3') {
      pokemonList = this.pokemon.PokemonGen3;

      if (!pokemonList) {
        return;
      }
      
      if (this.selectedVersion === this.pokemonConstants.PokemonRubySapphire.gameName) {
        folderName = 'gen-3-ruby-sapphire';
        filePrefix = '';
        extension = 'png';
      }
      if (this.selectedVersion === this.pokemonConstants.PokemonEmerald.gameName) {
        folderName = 'gen-3-emerald';
        filePrefix = 'Spr_3e_';
        extension = 'png';
      }
    }

    if (this.selectedGeneration == 'Gen 4') {
      pokemonList = this.pokemon.PokemonGen4;

      if (!pokemonList) {
        return;
      }

      this.height = '160px';
      this.width = '160px';
      this.widthNumber = 160;
      
      if (this.selectedVersion === this.pokemonConstants.PokemonDiamondPearlPlatinum.gameName) {
        folderName = 'gen-4-diamond-pearl-platinum';
        filePrefix = 'Spr_4d_';
        extension = 'png';
      }
    }

    if (this.selectedGeneration == 'Gen 5') {
      pokemonList = this.pokemon.PokemonGen5;

      if (!pokemonList) {
        return;
      }

      this.height = '168px';
      this.width = '168px';
      this.widthNumber = 168;
      
      if (this.selectedVersion === this.pokemonConstants.PokemonBlackWhite.gameName) {
        folderName = 'gen-5-black-white';
        filePrefix = 'Spr_5b_';
        extension = 'png';
      }
    }

    // Get Icon Paths
    for (let i = 0; i < pokemonList.length; i++) {
      const sprite = pokemonList[i];
      sprite.pokemonSprite = `assets/${folderName}/${filePrefix}${this.zeroPad(i+1, 3)}.${extension}`;
      this.pokemonSprites.push(sprite);
    }

    this.allPokemonSprites = this.pokemonSprites;
    this.sortByDex();
  }

  public showHidePosterOptions(): void {
    this.displayPosterOptions = !this.displayPosterOptions;
  }

  public onGenerationChange(): void {
    if (!this.selectedGeneration) {
      return;
    }

    const genIndex = this.pokemonConstants.generations.findIndex(x => x.generation == this.selectedGeneration);

    if (genIndex < 0) {
      return;
    }

    this.currentGeneration = this.pokemonConstants.generations[genIndex];
    this.versionOptions = this.currentGeneration.versions;
    this.dexOptions = this.currentGeneration.dexOptions;

    this.selectedVersion = this.versionOptions[0];
    this.selectedDex = this.dexOptions[0];

    this.getSprites();
  }

  public onVersionChange(): void {
    this.getSprites();
  }

  public onDexChange(): void {
    this.sortByDex();
  }

  private sortByDex(): void {
    this.pokemonSprites = this.allPokemonSprites;

    if (this.selectedDex === 'Kanto') {
      this.pokemonSprites.sort((a, b) => a.natDex - b.natDex);
    }
    else if (this.selectedDex === 'National') {
      this.pokemonSprites.sort((a, b) => a.natDex - b.natDex);
    }
    else if (this.selectedDex === 'Johto') {
      this.pokemonSprites.sort((a, b) => a.gen2Dex - b.gen2Dex);
    }
    else if (this.selectedDex === 'Hoenn') {
      this.pokemonSprites = this.pokemonSprites.filter(x => x.gen3Dex != null);
      this.pokemonSprites.sort((a, b) => a.gen3Dex - b.gen3Dex);
    }
    else if (this.selectedDex === 'Sinnoh') {
      this.pokemonSprites = this.pokemonSprites.filter(x => x.gen4Dex != null);
      this.pokemonSprites.sort((a, b) => a.gen4Dex - b.gen4Dex);
    }
    else if (this.selectedDex === 'Unova') {
      this.pokemonSprites = this.pokemonSprites.filter(x => x.gen5Dex != null);
      this.pokemonSprites.sort((a, b) => a.gen5Dex - b.gen5Dex);
    }
    else {
      this.pokemonSprites.sort((a, b) => a.natDex - b.natDex);
    }
  }

  private zeroPad = (num, places) => String(num).padStart(places, '0');
}
