FROM eclipse-temurin:8-jdk-alpine

WORKDIR /app

RUN apk add --no-cache maven ca-certificates openssl curl && update-ca-certificates \
    && curl -o /tmp/gts_r1.pem https://pki.goog/static/roots/GTS_Root_R1.pem \
    && curl -o /tmp/gts_r2.pem https://pki.goog/static/roots/GTS_Root_R2.pem \
    && curl -o /tmp/isrg_x1.pem https://letsencrypt.org/certs/isrgrootx1.pem \
    && keytool -importcert -trustcacerts -file /tmp/gts_r1.pem -alias gts-root-r1 -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt \
    && keytool -importcert -trustcacerts -file /tmp/gts_r2.pem -alias gts-root-r2 -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt \
    && keytool -importcert -trustcacerts -file /tmp/isrg_x1.pem -alias isrg-root-x1 -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt \
    && rm /tmp/*.pem

COPY pom.xml ./

RUN MAVEN_OPTS="-Dhttps.protocols=TLSv1.2" mvn dependency:go-offline

COPY src ./src

RUN MAVEN_OPTS="-Dhttps.protocols=TLSv1.2" mvn clean package -DskipTests

ENV PORT=8080
ENV JAVA_OPTS="-Djdk.tls.client.protocols=TLSv1.2"
EXPOSE 8080
CMD ["sh", "-c", "java $JAVA_OPTS -jar target/journalApp-0.0.1-SNAPSHOT.jar"]