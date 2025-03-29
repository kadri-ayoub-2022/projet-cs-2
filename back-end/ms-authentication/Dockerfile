# Use OpenJDK as the base image
FROM openjdk:17-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the built JAR file into the container
COPY target/ms-authentication.jar app.jar

# Expose the port your service runs on
EXPOSE 8082

# Set environment variables for mail configuration (Avoid hardcoding credentials)
ENV SPRING_MAIL_USERNAME=boukra.abdellah0@gmail.com
ENV SPRING_MAIL_PASSWORD=bfzfiehqsuhcyedk

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
