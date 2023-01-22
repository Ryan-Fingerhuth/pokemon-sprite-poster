import * as localForage from 'localforage';

export class LocalForageService {
  constructor() {
    localForage.config({
      name: 'pokemon-sprite-poster',
      version: 1.0,
    });
  }

  public get<T>(key: string): Promise<T> {
    return localForage.getItem(key);
  }

  public set(key: string, value: any): void {
    localForage.setItem(key, value);
  }
}
