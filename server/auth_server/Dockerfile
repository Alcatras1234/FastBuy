# 1. Этап сборки с Maven
FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /auth_service

# Копирование pom.xml и установка зависимостей
COPY pom.xml /auth_service/
RUN mvn dependency:resolve

# Копирование исходников
COPY src /auth_service/src/

# Очистка и сборка проекта с тестами
RUN mvn clean install -DskipTests

# 2. Этап для запуска приложения с JDK
FROM openjdk:21-jdk-slim AS server_app

WORKDIR /app

# Установка curl (если нужно для проверки)
RUN apt-get update && apt-get install -y curl

# Копирование собранного JAR файла
COPY --from=build /auth_service/target/*.jar /app/auth.jar

# Копирование ресурсов
COPY --from=build /auth_service/src/main/resources/templates /app/src/main/resources/templates

# Открытие порта приложения
EXPOSE 8080

# Запуск приложения
ENTRYPOINT ["java", "-jar", "auth.jar"]
