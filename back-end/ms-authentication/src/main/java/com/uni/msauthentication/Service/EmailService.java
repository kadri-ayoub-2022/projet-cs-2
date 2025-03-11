package com.uni.msauthentication.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger LOGGER = Logger.getLogger(EmailService.class.getName());
    private final JavaMailSender mailSender;
    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

//    public void sendPasswordResetEmail(String to, String token) {
//        String resetLink = frontendBaseUrl + "/reset-password?token=" + token;
//        String subject = "Password Reset Request";
//        String body = "Click the link to reset your password: " + resetLink + "\nThis link will expire in 1 hour.";
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(to);
//        message.setSubject(subject);
//        message.setText(body);
//
//        try {
//            mailSender.send(message);
//            LOGGER.info("Password reset email sent to: " + to);
//        } catch (Exception e) {
//            LOGGER.severe("Failed to send email to " + to + ": " + e.getMessage());
//            throw new RuntimeException("Failed to send reset email: " + e.getMessage(), e);
//        }
//    }
public void sendPasswordResetEmail(String to, String token) {
    String resetLink = frontendBaseUrl + "/reset-password?token=" + token;

    String subject = "Password Reset Request";

    String body = "<html><body>"
            + "<p>Click the button below to reset your password:</p>"
            + "<a href='" + resetLink + "' style='display: inline-block; padding: 10px 20px; font-size: 16px;"
            + "color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;'>"
            + "Reset Password</a>"
            + "<p>This link will expire in 1 hour.</p>"
            + "</body></html>";

    MimeMessage message = mailSender.createMimeMessage();
    try {
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true); // Enable HTML content
        mailSender.send(message);
        LOGGER.info("Password reset email sent to: " + to);
    } catch (MessagingException e) {
        LOGGER.severe("Failed to send email to " + to + ": " + e.getMessage());
        throw new RuntimeException("Failed to send reset email", e);
    }
}

}