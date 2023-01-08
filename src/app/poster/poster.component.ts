import { Component, OnInit } from '@angular/core';
import { 
  PokemonConstants,
  PokemonSpriteInfo,
  IPokemonSprite,
  IPokemonGenerationInfo,
  IPokemonConfig
} from '../@models';
import { LocalForageService } from '../localforage.service';

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
    private pokemon: PokemonSpriteInfo,
    private localForageService: LocalForageService
  ) { }

  ngOnInit(): void {
    this.localForageService.get<IPokemonConfig>('config').then(config => {
      if (config) {
        this.currentGeneration = config.currentGeneration;

        this.selectedGeneration = config.selectedGeneration;
        this.selectedVersion = config.selectedVersion;
        this.selectedDex = config.selectedDex;
        this.displayPosterOptions = config.displayPosterOptions;
      } else {
        this.displayPosterOptions = true;
        this.currentGeneration = this.pokemonConstants.generations[1];

        this.selectedGeneration = this.currentGeneration.generation;
        this.selectedVersion = this.currentGeneration.versions[2];
        this.selectedDex = this.currentGeneration.dexOptions[0];
    
        this.setConfigValues();
      }

      this.setDropdownOptions();
    }).catch(err => {
      console.log(err);
    });
  }

  private setDropdownOptions(): void {
    this.generationOptions = this.pokemonConstants.generationOptions;
    this.versionOptions = this.currentGeneration.versions;
    this.dexOptions = this.currentGeneration.dexOptions;

    this.getSprites();
  }

  private setConfigValues(): void {
    const config: IPokemonConfig = {
      currentGeneration: this.currentGeneration,
      selectedGeneration: this.selectedGeneration,
      selectedVersion: this.selectedVersion,
      selectedDex: this.selectedDex,
      displayPosterOptions: this.displayPosterOptions
    };

    this.localForageService.set('config', config);
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
      this.setGeneration1(pokemonList, folderName, filePrefix, extension);
    }

    if (this.selectedGeneration == 'Gen 2') {
      this.setGeneration2(pokemonList, folderName, filePrefix, extension);
    }

    if (this.selectedGeneration == 'Gen 3') {
      this.setGeneration3(pokemonList, folderName, filePrefix, extension);
    }

    if (this.selectedGeneration == 'Gen 4') {
      this.setGeneration4(pokemonList, folderName, filePrefix, extension);
    }

    if (this.selectedGeneration == 'Gen 5') {
      this.setGeneration5(pokemonList, folderName, filePrefix, extension);
    }

    // Get Icon Paths
    this.setIconPaths(pokemonList, folderName, filePrefix, extension);

    this.allPokemonSprites = this.pokemonSprites;
    this.sortByDex();
  }

  private setGeneration1(pokemonList: IPokemonSprite[], folderName: string, filePrefix: string, extension: string): void {
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

  private setGeneration2(pokemonList: IPokemonSprite[], folderName: string, filePrefix: string, extension: string): void {
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

  private setGeneration3(pokemonList: IPokemonSprite[], folderName: string, filePrefix: string, extension: string): void {
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

  private setGeneration4(pokemonList: IPokemonSprite[], folderName: string, filePrefix: string, extension: string): void {
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

  private setGeneration5(pokemonList: IPokemonSprite[], folderName: string, filePrefix: string, extension: string): void {
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

  private setIconPaths(pokemonList: IPokemonSprite[], folderName: string, filePrefix: string, extension: string): void {
    for (let i = 0; i < pokemonList.length; i++) {
      const sprite = pokemonList[i];
      sprite.pokemonSprite = `assets/${folderName}/${filePrefix}${this.zeroPad(i+1, 3)}.${extension}`;
      this.pokemonSprites.push(sprite);
    }
  }

  public showHidePosterOptions(): void {
    this.displayPosterOptions = !this.displayPosterOptions;
    this.setConfigValues();
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
    this.setConfigValues();
  }

  public onVersionChange(): void {
    this.getSprites();
    this.setConfigValues();
  }

  public onDexChange(): void {
    this.sortByDex();
    this.setConfigValues();
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
