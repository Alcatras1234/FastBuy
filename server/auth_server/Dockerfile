FROM maven:3.9.4-eclipse-temurin-21 AS build

WORKDIR /auth_service

COPY pom.xml /auth_service/
RUN mvn dependency:resolve
RUN mvn verify clean --fail-never

COPY src /auth_service/src/
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim


WORKDIR /app

COPY --from=build /auth_service/target/*.jar /app/auth.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "auth.jar"]