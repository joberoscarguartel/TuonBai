package com.csit321g4.bainary.tuonbai.service;

import com.csit321g4.bainary.tuonbai.entity.QuestionEntity;
import com.csit321g4.bainary.tuonbai.repository.QuestionRepository;
import com.csit321g4.bainary.tuonbai.repository.QuestionSetRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionSetRepository questionSetRepository;

    // CREATE
    public QuestionEntity postQuestion(QuestionEntity input) {
        validateParents(input);
        QuestionEntity question = new QuestionEntity(
            input.getQuestionText(), input.getQuestionSetId()
        );
        return questionRepository.save(question);
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<QuestionEntity> getAllQuestions() {
        return questionRepository.findAll();
    }

    // READ ONE
    @Transactional(readOnly = true)
    public QuestionEntity getQuestionById(Long id) {
        return questionRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Question not found"
            ));
    }

    // UPDATE
    public QuestionEntity putQuestion(Long id, QuestionEntity input) {
        QuestionEntity question = getQuestionById(id);
        validateParents(input);
        question.setQuestionText(input.getQuestionText());
        question.setQuestionSetId(input.getQuestionSetId());
        return questionRepository.save(question);
    }

    // DELETE
    public void deleteQuestion(Long id) {
        QuestionEntity question = getQuestionById(id);
        questionRepository.delete(question);
    }

    private void validateParents(QuestionEntity input) {
        if (!questionSetRepository.existsById(input.getQuestionSetId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Question set not found");
        }
    }
}
