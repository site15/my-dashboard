# Сборка мобильного приложения через Docker

## Демо

Веб-приложение развернуто и доступно по адресу: https://site15-my-dashboard.vercel.app

## Docker контейнер

Документация по сборке Docker контейнера была перенесена в каталог [ionic_capacitor](../ionic_capacitor):
- [Документация по сборке Docker контейнера (на английском)](../ionic_capacitor/README.md)
- [Документация по сборке Docker контейнера (на русском)](../ionic_capacitor/README_RU.md)

## Сообщество

Присоединяйтесь к нашему Telegram-чату разработчиков для обсуждений, обновлений и поддержки:
- [Telegram-чат разработчиков](https://t.me/site15_community)

## Уведомления о релизах

Информация о релизах и обновлениях автоматически публикуется в нашем Telegram-чате сообщества:
- [Уведомления о релизах в Telegram](https://t.me/site15_community/3)

## Управление плагинами Capacitor

При добавлении или удалении плагинов Capacitor необходимо выполнить следующую команду для синхронизации плагинов с проектом Android:

```bash
npx cap sync android
```

Эта команда обновляет нативный проект Android с последними конфигурациями плагинов и должна выполняться после любой установки или удаления плагинов.

## Запуск сборки с монтированием тома

Чтобы собрать APK для Android с помощью Docker с монтированием тома:

```bash
docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor:latest
```

## Рабочий процесс GitHub Actions

Рабочий процесс GitHub Actions автоматически:
1. Собирает образ Docker
2. Запускает процесс сборки Android
3. Загружает файлы APK как артефакты

Файлы APK будут доступны в артефактах GitHub Actions по адресу:
`/app/android/app/build/outputs/apk/release/`

Чтобы использовать параметры хранилища ключей через секреты GitHub, необходимо установить следующие секреты в вашем репозитории:
- `KEYSTORE` - закодированный в base64 файл хранилища ключей
- `KEYSTORE_PASSWORD` - пароль для хранилища ключей
- `KEYSTORE_ALIAS` - псевдоним для хранилища ключей
- `KEYSTORE_ALIAS_PASSWORD` - пароль для псевдонима хранилища ключей

Чтобы сгенерировать закодированный в base64 файл хранилища ключей:
```bash
base64 my-dashboard.jks > keystore.txt
```

Затем скопируйте содержимое файла keystore.txt в секрет `KEYSTORE` в настройках репозитория GitHub.

## Процесс ручной сборки

1. Сгенерируйте хранилище ключей (если у вас его нет):
   ```bash
   keytool -genkey -v -keystore my-dashboard.jks -keyalg RSA -keysize 2048 -storepass 12345678 -keypass 12345678 -validity 10000 -alias my-dashboard -dname "CN=Ilshat Khamitov, OU=My Dashboard, O=Site15, L=Ufa, ST=Unknown, C=ru"
   ```

2. Запустите контейнер Docker:
   ```bash
   docker run --rm -v "$(pwd)":/app endykaufman/ionic-capacitor:latest
   ```

3. APK будет сгенерирован по адресу:
   `android/app/build/outputs/apk/release/app-release.apk`

## Разработка

- Запустите `ionic serve` чтобы увидеть ваше приложение в браузере
- Запустите `ionic capacitor add` чтобы добавить нативный проект iOS или Android с помощью Capacitor
- Сгенерируйте иконку и заставку вашего приложения с помощью `cordova-res --skip-config --copy`
- Изучите документацию Ionic для компонентов, руководств и другого: https://ion.link/docs
- Создаете корпоративное приложение? У Ionic есть поддержка и функции для предприятий: https://ion.link/enterprise-edition