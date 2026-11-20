package com.csit321g4.bainary.tuonbai.service;

import com.csit321g4.bainary.tuonbai.entity.QuestionSetEntity;
import com.csit321g4.bainary.tuonbai.repository.QuestionSetRepository;
import com.csit321g4.bainary.tuonbai.repository.StudentRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class QuestionSetService {

    @Autowired
    private QuestionSetRepository questionSetRepository;

    @Autowired
    private StudentRepository studentRepository;

    // CREATE
    public QuestionSetEntity postQuestionSet(QuestionSetEntity input) {
        validateParents(input);
        QuestionSetEntity questionSet = new QuestionSetEntity(
            input.getTitle(), input.getDescription(), input.getStudentId()
        );
        return questionSetRepository.save(questionSet);
    }

    // READ ALL
    @Transactional(readOnly = true)
    public List<QuestionSetEntity> getAllQuestionSets() {
        return questionSetRepository.findAll();
    }

    // READ ONE
    @Transactional(readOnly = true)
    public QuestionSetEntity getQuestionSetById(Long id) {
        return questionSetRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Question set not found"
            ));
    }

    // UPDATE
    public QuestionSetEntity putQuestionSet(Long id, QuestionSetEntity input) {
        QuestionSetEntity questionSet = getQuestionSetById(id);
        validateParents(input);
        questionSet.setTitle(input.getTitle());
        questionSet.setDescription(input.getDescription());
        questionSet.setStudentId(input.getStudentId());
        return questionSetRepository.save(questionSet);
    }

    // DELETE
    public void deleteQuestionSet(Long id) {
        QuestionSetEntity questionSet = getQuestionSetById(id);
        questionSetRepository.delete(questionSet);
    }

    private void validateParents(QuestionSetEntity input) {
        if (!studentRepository.existsById(input.getStudentId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
        }
    }
}
