import { Component, OnInit } from '@angular/core';
import { 
  PokemonConstants,
  PokemonSpriteInfo,
  IPokemonSprite,
  IPokemonGenerationInfo,
  IPokemonConfig,
  ISpriteConfig
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

    let spriteConfig: ISpriteConfig = {
      pokemonList: [],
      folderName: '',
      filePrefix: '',
      extension: '',
    };

    this.height = '112px';
    this.width = '112px';
    this.widthNumber = 112;

    if (this.selectedGeneration == 'Gen 1') {
      spriteConfig = this.setGeneration1(spriteConfig);
    }

    if (this.selectedGeneration == 'Gen 2') {
      spriteConfig = this.setGeneration2(spriteConfig);
    }

    if (this.selectedGeneration == 'Gen 3') {
      spriteConfig = this.setGeneration3(spriteConfig);
    }

    if (this.selectedGeneration == 'Gen 4') {
      spriteConfig = this.setGeneration4(spriteConfig);
    }

    if (this.selectedGeneration == 'Gen 5') {
      spriteConfig = this.setGeneration5(spriteConfig);
    }

    this.setIconPaths(spriteConfig);

    this.allPokemonSprites = this.pokemonSprites;
    this.sortByDex();
  }

  private setIconPaths(spriteConfig: ISpriteConfig): void {
    for (let i = 0; i < spriteConfig.pokemonList.length; i++) {
      const sprite = spriteConfig.pokemonList[i];
      sprite.pokemonSprite = `assets/${spriteConfig.folderName}/${spriteConfig.filePrefix}${this.zeroPad(i+1, 3)}.${spriteConfig.extension}`;
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

  // Set Generations
  private setGeneration1(spriteConfig: ISpriteConfig): ISpriteConfig {
    spriteConfig.pokemonList = this.pokemon.PokemonGen1;

    if (!spriteConfig.pokemonList) {
      return;
    }

    if (this.selectedVersion === this.pokemonConstants.PokemonRedBlue.gameName) {
      spriteConfig.folderName = 'gen-1-red-blue';
      spriteConfig.filePrefix = 'Spr_1b_';
      spriteConfig.extension = 'png';
    }
    if (this.selectedVersion === this.pokemonConstants.PokemonRedGreen.gameName) {
      spriteConfig.folderName = 'gen-1-red-green';
      spriteConfig.filePrefix = 'Spr_1g_';
      spriteConfig.extension = 'png';
    }
    if (this.selectedVersion === this.pokemonConstants.PokemonYellow.gameName) {
      spriteConfig.folderName = 'gen-1-yellow';
      spriteConfig.filePrefix = 'Spr_1y_';
      spriteConfig.extension = 'png';
    }
    if (this.selectedVersion === this.pokemonConstants.PokemonLeafGreenFireRed.gameName) {
      spriteConfig.folderName = 'gen-1-leafgreen-firered';
      spriteConfig.filePrefix = '';
      spriteConfig.extension = 'png';
    }

    return spriteConfig;
  }

  private setGeneration2(spriteConfig: ISpriteConfig): ISpriteConfig {
    spriteConfig.pokemonList = this.pokemon.PokemonGen2;

    if (!spriteConfig.pokemonList) {
      return;
    }
    
    if (this.selectedVersion === this.pokemonConstants.PokemonSilver.gameName) {
      spriteConfig.folderName = 'gen-2-silver';
      spriteConfig.filePrefix = 'Spr_2s_';
      spriteConfig.extension = 'png';
    }
    if (this.selectedVersion === this.pokemonConstants.PokemonGold.gameName) {
      spriteConfig.folderName = 'gen-2-gold';
      spriteConfig.filePrefix = 'Spr_2g_';
      spriteConfig.extension = 'png';
    }
    if (this.selectedVersion === this.pokemonConstants.PokemonCrystal.gameName) {
      spriteConfig.folderName = 'gen-2-crystal';
      spriteConfig.filePrefix = 'Spr_2c_';
      spriteConfig.extension = 'png';
    }

    return spriteConfig;
  }

  private setGeneration3(spriteConfig: ISpriteConfig): ISpriteConfig {
    spriteConfig.pokemonList = this.pokemon.PokemonGen3;

    if (!spriteConfig.pokemonList) {
      return;
    }
    
    if (this.selectedVersion === this.pokemonConstants.PokemonRubySapphire.gameName) {
      spriteConfig.folderName = 'gen-3-ruby-sapphire';
      spriteConfig.filePrefix = '';
      spriteConfig.extension = 'png';
    }
    if (this.selectedVersion === this.pokemonConstants.PokemonEmerald.gameName) {
      spriteConfig.folderName = 'gen-3-emerald';
      spriteConfig.filePrefix = 'Spr_3e_';
      spriteConfig.extension = 'png';
    }

    return spriteConfig;
  }

  private setGeneration4(spriteConfig: ISpriteConfig): ISpriteConfig {
    spriteConfig.pokemonList = this.pokemon.PokemonGen4;

    if (!spriteConfig.pokemonList) {
      return;
    }

    this.height = '160px';
    this.width = '160px';
    this.widthNumber = 160;
    
    if (this.selectedVersion === this.pokemonConstants.PokemonDiamondPearlPlatinum.gameName) {
      spriteConfig.folderName = 'gen-4-diamond-pearl-platinum';
      spriteConfig.filePrefix = 'Spr_4d_';
      spriteConfig.extension = 'png';
    }

    return spriteConfig;
  }

  private setGeneration5(spriteConfig: ISpriteConfig): ISpriteConfig {
    spriteConfig.pokemonList = this.pokemon.PokemonGen5;

    if (!spriteConfig.pokemonList) {
      return;
    }

    this.height = '168px';
    this.width = '168px';
    this.widthNumber = 168;
    
    if (this.selectedVersion === this.pokemonConstants.PokemonBlackWhite.gameName) {
      spriteConfig.folderName = 'gen-5-black-white';
      spriteConfig.filePrefix = 'Spr_5b_';
      spriteConfig.extension = 'png';
    }

    return spriteConfig;
  }
}
