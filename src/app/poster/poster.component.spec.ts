import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PokemonConstants, PokemonSpriteInfo } from '../@models';
import { LocalForageService } from '../localforage.service';
import { PosterComponent } from './poster.component';

describe('PosterComponent', () => {
  let component: PosterComponent;
  let fixture: ComponentFixture<PosterComponent>;
  let storage: jasmine.SpyObj<LocalForageService>;
  let originalUrl: string;

  beforeEach(async () => {
    originalUrl = window.location.href;
    window.history.replaceState(null, '', window.location.pathname);
    storage = jasmine.createSpyObj('LocalForageService', ['get', 'set']);
    storage.get.and.returnValue(Promise.resolve(null));
    storage.set.and.returnValue(Promise.resolve());
    await TestBed.configureTestingModule({
      declarations: [PosterComponent],
      imports: [FormsModule],
      providers: [
        PokemonConstants,
        PokemonSpriteInfo,
        { provide: LocalForageService, useValue: storage },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(PosterComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => window.history.replaceState(null, '', originalUrl));

  it('animates sprites only while hovered or focused', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const tile = fixture.nativeElement.querySelector('figure');
    const img = tile.querySelector('img');
    expect(img.getAttribute('src')).toContain('assets/sprite-stills/');
    tile.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    expect(img.getAttribute('src')).not.toContain('sprite-stills');
    tile.dispatchEvent(new Event('focus'));
    tile.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    expect(img.getAttribute('src')).not.toContain('sprite-stills');
    tile.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(img.getAttribute('src')).toContain('assets/sprite-stills/');
    component.selectedGeneration = 'Gen 1';
    component.onGenerationChange();
    expect(component.spriteSource(component.pokemonSprites[0])).not.toContain(
      'sprite-stills',
    );
  });

  it('loads default sprites when storage cannot be read', async () => {
    storage.get.and.callFake(() => Promise.reject(new Error('unavailable')));
    await component.ngOnInit();
    expect(component.selectedVersion).toBe('Crystal');
    expect(component.pokemonSprites.length).toBe(251);
    expect(component.storageMessage).toContain('unavailable');
  });

  it('validates stale settings against current generation definitions', async () => {
    storage.get.and.returnValue(
      Promise.resolve({
        selectedGeneration: 'Gen 3',
        selectedVersion: 'Crystal',
        selectedDex: 'Johto',
        currentGeneration: { versions: ['obsolete'] },
        density: 'invalid',
      }),
    );
    await component.ngOnInit();
    expect(component.selectedVersion).toBe('Ruby/Sapphire');
    expect(component.selectedDex).toBe('Hoenn');
    expect(component.pokemonSprites.length).toBeGreaterThan(0);
  });

  it('restores shared settings independently of saved preferences', async () => {
    storage.get.and.returnValue(
      Promise.resolve({ selectedGeneration: 'Gen 2', selectedVersion: 'Gold' }),
    );
    window.history.replaceState(
      null,
      '',
      '?generation=Gen+3&version=Emerald&dex=National&density=compact&crisp=false',
    );
    await component.ngOnInit();
    expect(component.selectedVersion).toBe('Emerald');
    expect(component.pokemonSprites.length).toBe(386);
    expect(component.pixelCrisp).toBeFalse();
  });

  it('keeps customization usable and updates the URL when saving fails', async () => {
    await component.ngOnInit();
    storage.set.and.callFake(() => Promise.reject(new Error('full')));
    component.selectedGeneration = 'Gen 1';
    component.onGenerationChange();
    await Promise.resolve();
    expect(component.pokemonSprites.length).toBe(151);
    expect(new URLSearchParams(window.location.search).get('generation')).toBe(
      'Gen 1',
    );
    expect(component.storageMessage).toContain('could not be saved');
  });

  it('provides an explicit button whose expanded state matches the options panel', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const button: HTMLButtonElement =
      fixture.nativeElement.querySelector('.logo-button');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(fixture.nativeElement.querySelector('#poster-options').hidden).toBeTrue();
  });

  it('dismisses the logo hint on activation and remembers it on the next visit', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.showLogoHint).toBeTrue();
    fixture.nativeElement.querySelector('.logo-button').click();
    fixture.detectChanges();
    expect(component.showLogoHint).toBeFalse();
    expect(component.displayPosterOptions).toBeFalse();
    const saved = storage.set.calls.mostRecent().args[1];
    expect(saved.logoClicked).toBeTrue();
    storage.get.and.returnValue(Promise.resolve(saved));
    const returning = new PosterComponent(
      new PokemonConstants(),
      new PokemonSpriteInfo(),
      storage,
    );
    await returning.ngOnInit();
    expect(returning.showLogoHint).toBeFalse();
  });

  it('reserves image space, defers later sprites, and handles broken images', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const images = fixture.nativeElement.querySelectorAll('.sprite-image');
    expect(images[0].getAttribute('width')).toBe('96');
    expect(images[0].getAttribute('loading')).toBe('eager');
    expect(images[36].getAttribute('loading')).toBe('lazy');
    images[0].dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sprite-fallback')).toBeTruthy();
  });
});
