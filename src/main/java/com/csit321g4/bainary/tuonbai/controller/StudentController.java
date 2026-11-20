package com.csit321g4.bainary.tuonbai.controller;

import com.csit321g4.bainary.tuonbai.entity.StudentEntity;
import com.csit321g4.bainary.tuonbai.service.StudentService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public StudentEntity postStudent(
        @Valid @RequestBody StudentEntity input
    ) {
        return studentService.postStudent(input);
    }

    // READ ALL
    @GetMapping
    public List<StudentEntity> getAllStudents() {
        return studentService.getAllStudents();
    }

    // READ ONE
    @GetMapping("/{id}")
    public StudentEntity getStudentById(@PathVariable("id") Long id) {
        return studentService.getStudentById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public StudentEntity putStudent(
        @PathVariable("id") Long id,
        @Valid @RequestBody StudentEntity input
    ) {
        return studentService.putStudent(id, input);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStudent(@PathVariable("id") Long id) {
        studentService.deleteStudent(id);
    }
}
