# Use OpenJDK 17 as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/ms-administration.jar app.jar

# Expose the port that the microservice runs on
EXPOSE 8081

# Set environment variables for database configuration
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/pfe
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=root

# Command to run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
