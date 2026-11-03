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

  public async set(key: string, value: any): Promise<void> {
    await localForage.setItem(key, value);
  }
}
