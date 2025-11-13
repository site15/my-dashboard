import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TelegramSettingsType } from '../../server/types/TelegramSettingsSchema';
import { LocalStorageEnum, LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TelegramSettingsService extends LocalStorageService<TelegramSettingsType> {
  override key = 'telegramSettings';
  override type = LocalStorageEnum.client;

  stream$ = this.storageChanges.pipe(map((e) => e.newValue));
}
