package com.csit321g4.bainary.tuonbai.controller;

import com.csit321g4.bainary.tuonbai.entity.QuestionEntity;
import com.csit321g4.bainary.tuonbai.service.QuestionService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionEntity postQuestion(@Valid @RequestBody QuestionEntity input) {
        return questionService.postQuestion(input);
    }

    // READ ALL
    @GetMapping
    public List<QuestionEntity> getAllQuestions() {
        return questionService.getAllQuestions();
    }

    // READ ONE
    @GetMapping("/{id}")
    public QuestionEntity getQuestionById(@PathVariable("id") Long id) {
        return questionService.getQuestionById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public QuestionEntity putQuestion(
        @PathVariable("id") Long id, @Valid @RequestBody QuestionEntity input
    ) {
        return questionService.putQuestion(id, input);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuestion(@PathVariable("id") Long id) {
        questionService.deleteQuestion(id);
    }
}
