package com.homeroomplus.backend.controller;

import com.homeroomplus.backend.model.Classroom;
import com.homeroomplus.backend.model.Student;
import com.homeroomplus.backend.repository.ClassroomRepository;
import com.homeroomplus.backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classrooms")
@RequiredArgsConstructor
public class ClassroomController {

    private final ClassroomRepository classroomRepository;
    private final StudentRepository studentRepository;

    @GetMapping
    public List<Classroom> getAllClassrooms() {
        return classroomRepository.findAll();
    }

    @PostMapping
    public Classroom createClassroom(@RequestBody Classroom classroom) {
        return classroomRepository.save(classroom);
    }

    @GetMapping("/{id}/students")
    public ResponseEntity<List<Student>> getStudentsByClassroom(@PathVariable Long id) {
        if (!classroomRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(studentRepository.findByClassroom_Id(id));
    }
}
