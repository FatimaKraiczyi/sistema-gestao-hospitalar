# Etapa 1: build da aplicação
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Copia apenas o POM e baixa as dependências em cache
COPY pom.xml ./
RUN mvn dependency:go-offline

# Código será montado com volume (não precisa COPY . .)
EXPOSE 8080

CMD ["mvn", "spring-boot:run"]
