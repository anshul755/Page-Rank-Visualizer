FROM maven:3.9.11-eclipse-temurin-8-alpine AS builder
WORKDIR /app

COPY pom.xml ./

RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests

FROM eclipse-temurin:8-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "java -Djdk.tls.client.protocols=TLSv1.2 -Dserver.port=${PORT} -jar /app/app.jar"]