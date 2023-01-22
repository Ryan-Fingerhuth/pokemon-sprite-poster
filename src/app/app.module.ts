import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PosterComponent } from './poster/poster.component';
import { PokemonConstants, PokemonSpriteInfo } from './@models/pokemon.constants';
import { CommonModule } from '@angular/common';
import { LocalForageService } from './localforage.service';

@NgModule({
  declarations: [AppComponent, PosterComponent],
  imports: [BrowserModule, AppRoutingModule, CommonModule, FormsModule],
  providers: [PokemonConstants, PokemonSpriteInfo, LocalForageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
