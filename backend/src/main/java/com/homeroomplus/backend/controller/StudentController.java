package com.homeroomplus.backend.controller;

import com.homeroomplus.backend.model.BehaviorRecord;
import com.homeroomplus.backend.model.Classroom;
import com.homeroomplus.backend.model.Student;
import com.homeroomplus.backend.repository.BehaviorRecordRepository;
import com.homeroomplus.backend.repository.ClassroomRepository;
import com.homeroomplus.backend.repository.StudentRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentRepository studentRepository;
    private final ClassroomRepository classroomRepository;
    private final BehaviorRecordRepository behaviorRecordRepository;

    @PostMapping
    public ResponseEntity<Student> createStudent(@RequestBody CreateStudentRequest request) {
        Optional<Classroom> classroom = classroomRepository.findById(request.getClassroomId());
        if (classroom.isEmpty())
            return ResponseEntity.badRequest().build();

        Student student = new Student();
        student.setName(request.getName());
        student.setAvatarUrl(request.getAvatarUrl());
        student.setClassroom(classroom.get());

        return ResponseEntity.ok(studentRepository.save(student));
    }

    @PostMapping("/{id}/points")
    public ResponseEntity<Student> addPoint(@PathVariable Long id, @RequestBody AddPointRequest request) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (studentOpt.isEmpty())
            return ResponseEntity.notFound().build();

        Student student = studentOpt.get();

        BehaviorRecord record = new BehaviorRecord();
        record.setDescription(request.getDescription());
        record.setPoints(request.getPoints());
        record.setStudent(student);

        behaviorRecordRepository.save(record);

        // Refresh student to include new record in total points mapping
        return ResponseEntity.ok(studentRepository.findById(id).get());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable Long id) {
        if (!studentRepository.existsById(id))
            return ResponseEntity.notFound().build();
        studentRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @Data
    public static class CreateStudentRequest {
        private String name;
        private String avatarUrl;
        private Long classroomId;
    }

    @Data
    public static class AddPointRequest {
        private String description;
        private Integer points;
    }
}
