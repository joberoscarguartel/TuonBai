package com.csit321g4.bainary.tuonbai.controller;

import com.csit321g4.bainary.tuonbai.entity.QuestionSetEntity;
import com.csit321g4.bainary.tuonbai.service.QuestionSetService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/question-sets")
public class QuestionSetController {

    @Autowired
    private QuestionSetService questionSetService;

    // CREATE
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public QuestionSetEntity postQuestionSet(@Valid @RequestBody QuestionSetEntity input) {
        return questionSetService.postQuestionSet(input);
    }

    // READ ALL
    @GetMapping
    public List<QuestionSetEntity> getAllQuestionSets() {
        return questionSetService.getAllQuestionSets();
    }

    // READ ONE
    @GetMapping("/{id}")
    public QuestionSetEntity getQuestionSetById(@PathVariable("id") Long id) {
        return questionSetService.getQuestionSetById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public QuestionSetEntity putQuestionSet(
        @PathVariable("id") Long id, @Valid @RequestBody QuestionSetEntity input
    ) {
        return questionSetService.putQuestionSet(id, input);
    }

    // DELETE
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteQuestionSet(@PathVariable("id") Long id) {
        questionSetService.deleteQuestionSet(id);
    }
}
