# Сборщик Docker для Ionic Capacitor

Этот каталог содержит конфигурацию Docker для сборки образа ionic-capacitor.

## Репозиторий Docker Hub

Образ Docker размещен на Docker Hub:
[endykaufman/ionic-capacitor](https://hub.docker.com/repository/docker/endykaufman/ionic-capacitor/tags/latest)

## Сборка образа Docker

Для локальной сборки образа Docker выполните:

```bash
docker build -t endykaufman/ionic-capacitor .
```

## Публикация образа Docker

Чтобы опубликовать образ Docker на Docker Hub:

1. Войдите в Docker Hub:
   ```bash
   docker login
   ```

2. Пометьте образ вашим именем пользователя на Docker Hub:
   ```bash
   docker tag endykaufman/ionic-capacitor your-dockerhub-username/ionic-capacitor:latest
   ```

3. Отправьте образ в Docker Hub:
   ```bash
   docker push your-dockerhub-username/ionic-capacitor:latest
   ```

Для автоматических сборок вы также можете использовать функцию автоматической сборки Docker Hub, подключив репозиторий GitHub.

## Детали образа Docker

Этот образ Docker содержит все необходимые инструменты и зависимости для сборки Android-приложений Ionic Capacitor:
- Базовый образ Ubuntu 22.04
- OpenJDK 21
- Android SDK и инструменты сборки
- Node.js 23.11.0
- Ionic CLI и Capacitor CLI
- Gradle 8.2.1

Образ предназначен для использования с монтированием томов для сборки Android-приложений в каталоге mobile.

Инструкции по использованию этого контейнера для сборки Android-приложений находятся в документации мобильного проекта:
- [Английская документация](../mobile/README.md)
- [Русская документация](../mobile/README_RU.md)