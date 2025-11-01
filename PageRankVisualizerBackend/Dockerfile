FROM eclipse-temurin:8-jdk-alpine

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw clean package -DskipTests

ENV PORT=8080
EXPOSE 8080

CMD ["java", "-jar", "target/*.jar"]