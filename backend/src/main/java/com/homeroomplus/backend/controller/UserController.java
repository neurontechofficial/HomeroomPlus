package com.homeroomplus.backend.controller;

import com.homeroomplus.backend.model.User;
import com.homeroomplus.backend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @PutMapping("/{id}/settings")
    public ResponseEntity<User> updateSettings(@PathVariable Long id, @RequestBody SettingsRequest request) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        user.setSecretaryEmail(request.getSecretaryEmail());

        return ResponseEntity.ok(userRepository.save(user));
    }

    @Data
    public static class SettingsRequest {
        private String secretaryEmail;
    }
}
