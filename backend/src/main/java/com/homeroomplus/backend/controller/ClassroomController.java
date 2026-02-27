package com.homeroomplus.backend.controller;

import com.homeroomplus.backend.model.Classroom;
import com.homeroomplus.backend.model.Student;
import com.homeroomplus.backend.model.User;
import com.homeroomplus.backend.repository.ClassroomRepository;
import com.homeroomplus.backend.repository.StudentRepository;
import com.homeroomplus.backend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomRepository classroomRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Classroom>> getClassrooms(@RequestParam Long userId) {
        return ResponseEntity.ok(classroomRepository.findByUser_Id(userId));
    }

    @PostMapping
    public ResponseEntity<Classroom> createClassroom(@RequestBody CreateClassroomRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Classroom classroom = new Classroom();
        classroom.setName(request.getName());
        classroom.setUser(userOpt.get());

        return ResponseEntity.ok(classroomRepository.save(classroom));
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<Student>> getStudentsByClassroom(@PathVariable Long id) {
        if (!classroomRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(studentRepository.findByClassroom_Id(id));
    }

    @Data
    public static class CreateClassroomRequest {
        private String name;
        private Long userId;
    }
}
