FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

RUN apk add --no-cache maven ca-certificates && update-ca-certificates
ENV MAVEN_OPTS="-Djdk.tls.client.protocols=TLSv1.2"

COPY pom.xml ./

RUN mvn -B -Dhttps.protocols=TLSv1.2 dependency:go-offline

COPY src ./src
RUN mvn -B -Dhttps.protocols=TLSv1.2 clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "java -Djdk.tls.client.protocols=TLSv1.2 -Dserver.port=${PORT} -jar /app/app.jar"]