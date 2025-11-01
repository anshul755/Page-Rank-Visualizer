FROM eclipse-temurin:8-jdk-alpine

WORKDIR /app

RUN apk add --no-cache maven ca-certificates openssl && update-ca-certificates

COPY pom.xml ./

RUN MAVEN_OPTS="-Dhttps.protocols=TLSv1.2" mvn dependency:go-offline

COPY src ./src

RUN MAVEN_OPTS="-Dhttps.protocols=TLSv1.2" mvn clean package -DskipTests

ENV PORT=8080
EXPOSE 8080
CMD ["java", "-jar", "target/journalApp-0.0.1-SNAPSHOT.jar"]