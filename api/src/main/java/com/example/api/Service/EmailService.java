package com.example.api.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom("spectrumm@gmail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(body, true);

        mailSender.send(message);
    }



    // Specific method for registration emails
    public void sendRegistrationEmail(String to, String name) throws MessagingException {
        String subject = "Welcome to Spectrum Event";
        String body = "Dear " + name + ",\n\nYou have successfully registered for the Spectrum Event.\n\nThank you!";
        sendEmail(to, subject, body); // Reuse the generic sendEmail method
    }
}