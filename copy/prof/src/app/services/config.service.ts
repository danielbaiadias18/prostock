import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private static ready = false
  private static _settings: IAppSettings;
  constructor(private http: HttpClient) { }
  load() {
    const jsonFile = `${environment.ConfigFile}`;
    return new Promise<void>((resolve, reject) => {
      this.http.get(jsonFile).toPromise().then((response: IAppSettings) => {
        ConfigService._settings = <IAppSettings>response;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }

  public async Ready(onReadyCallback: (config: IAppSettings) => void) {
    if (ConfigService.ready) onReadyCallback(ConfigService._settings);
    await this.load();
    ConfigService.ready = true;
    onReadyCallback(ConfigService._settings);
  }
}

export interface IAppSettings {
  app_name: string;
  api_url: string;
  tokenLink: string;
  url_imagens: string;
}