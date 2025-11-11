import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { TelegramSettingsType } from '../../server/types/TelegramSettingsSchema';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class TelegramSettingsService
  extends LocalStorageService<TelegramSettingsType>
{
  override key = 'telegramSettings';

  stream$ = this.storageChanges.pipe(map((e) => e.newValue));
}
