# Etapa 1: build da aplicação
FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Etapa 2: runtime
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

# Expor a porta em que a aplicação irá rodar (padrão do Spring Boot é 8080)
EXPOSE 8080

# Comando para iniciar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]
