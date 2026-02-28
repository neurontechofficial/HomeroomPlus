package com.homeroomplus.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class MailerooService {

    @Value("${maileroo.api.key}")
    private String apiKey;

    @Value("${maileroo.from.email:noreply@homeroomplus.com}")
    private String fromEmail;

    @Value("${maileroo.from.name:HomeroomPlus}")
    private String fromName;

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String MAILEROO_API_URL = "https://smtp.maileroo.com/api/v2/emails";

    public void sendPointsEmail(String toEmail, String secretaryEmail, String studentName, int points,
            String description) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            return;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Api-Key", apiKey);

        Map<String, Object> payload = new HashMap<>();

        Map<String, String> fromMap = new HashMap<>();
        fromMap.put("address", fromEmail);
        fromMap.put("display_name", fromName);
        payload.put("from", fromMap);

        payload.put("to", java.util.Collections.singletonMap("address", toEmail));

        String action = points >= 0 ? "awarded" : "deducted";
        int absPoints = Math.abs(points);

        payload.put("subject", "Point Update for " + studentName);

        String emailBody = String.format(
                "Hello,\n\nYour student %s was just %s %d point(s) for the following reason:\n\n%s\n\n- HomeroomPlus",
                studentName,
                action,
                absPoints,
                description);
        payload.put("plain", emailBody);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(MAILEROO_API_URL, request, String.class);

            // If secretary email is configured, send a copy to them as well
            if (secretaryEmail != null && !secretaryEmail.trim().isEmpty() && !secretaryEmail.equals(toEmail)) {
                payload.put("to", java.util.Collections.singletonMap("address", secretaryEmail));
                payload.put("subject", "[SECRETARY COPY] " + payload.get("subject"));
                HttpEntity<Map<String, Object>> secretaryRequest = new HttpEntity<>(payload, headers);
                restTemplate.postForEntity(MAILEROO_API_URL, secretaryRequest, String.class);
            }
        } catch (Exception e) {
            System.err.println("Failed to send email via Maileroo: " + e.getMessage());
        }
    }
}
