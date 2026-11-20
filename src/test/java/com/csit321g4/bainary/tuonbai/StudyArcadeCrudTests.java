package com.csit321g4.bainary.tuonbai;

import com.csit321g4.bainary.tuonbai.repository.GameSessionRepository;
import com.csit321g4.bainary.tuonbai.repository.QuestionRepository;
import com.csit321g4.bainary.tuonbai.repository.QuestionSetRepository;
import com.csit321g4.bainary.tuonbai.repository.StudentRepository;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class StudyArcadeCrudTests {

    @LocalServerPort
    private int port;

    @Autowired
    private GameSessionRepository gameSessions;
    @Autowired
    private QuestionRepository questions;
    @Autowired
    private QuestionSetRepository questionSets;
    @Autowired
    private StudentRepository students;

    private final HttpClient client = HttpClient.newHttpClient();
    private final JsonMapper json = JsonMapper.builder().build();

    @BeforeEach
    void clearTestDatabase() {
        gameSessions.deleteAll();
        questions.deleteAll();
        questionSets.deleteAll();
        students.deleteAll();
    }

    @Test
    void createsReadsUpdatesAndDeletesAllThreeResources() throws Exception {
        long student = createStudent();
        long otherStudent = createStudent();
        long set = create("question-sets", setBody("Math", student), "questionSetId");
        long otherSet = create("question-sets", setBody("Science", student), "questionSetId");
        long question = create("questions", questionBody("What is 2 + 2?", set), "questionId");
        long session = create("game-sessions", sessionBody(student, set, 0, "IN_PROGRESS"), "gameSessionId");

        assertListed("question-sets", "questionSetId", set);
        assertListed("questions", "questionId", question);
        assertListed("game-sessions", "gameSessionId", session);

        JsonNode updatedSet = body(request("PUT", "question-sets/" + set, setBody("Algebra", otherStudent), 200));
        assertThat(updatedSet.get("questionSetId").asLong()).isEqualTo(set);
        assertThat(updatedSet.get("studentId").asLong()).isEqualTo(otherStudent);
        JsonNode updatedQuestion = body(request("PUT", "questions/" + question, questionBody("What is 3 + 3?", otherSet), 200));
        assertThat(updatedQuestion.get("questionId").asLong()).isEqualTo(question);
        assertThat(updatedQuestion.get("questionSetId").asLong()).isEqualTo(otherSet);
        request("PUT", "game-sessions/" + session, sessionBody(otherStudent, otherSet, 20, "COMPLETED"), 200);

        assertThat(body(request("GET", "question-sets/" + set, null, 200)).get("title").asText()).isEqualTo("Algebra");
        assertThat(body(request("GET", "questions/" + question, null, 200)).get("questionText").asText()).isEqualTo("What is 3 + 3?");
        JsonNode savedSession = body(request("GET", "game-sessions/" + session, null, 200));
        assertThat(savedSession.get("studentId").asLong()).isEqualTo(otherStudent);
        assertThat(savedSession.get("questionSetId").asLong()).isEqualTo(otherSet);
        assertThat(savedSession.get("score").asInt()).isEqualTo(20);
        assertThat(savedSession.get("status").asText()).isEqualTo("COMPLETED");
        assertThat(savedSession.has("student")).isFalse();
        assertThat(savedSession.has("questionSet")).isFalse();

        request("DELETE", "game-sessions/" + session, null, 204);
        request("DELETE", "questions/" + question, null, 204);
        request("DELETE", "question-sets/" + set, null, 204);
        request("DELETE", "question-sets/" + otherSet, null, 204);
        for (String path : new String[] {"question-sets/" + set, "questions/" + question, "game-sessions/" + session}) {
            request("GET", path, null, 404);
            request("DELETE", path, null, 404);
        }
    }

    @Test
    void rejectsMissingParentsAndRollsBackInvalidUpdates() throws Exception {
        long missing = Long.MAX_VALUE;
        long student = createStudent();
        long set = create("question-sets", setBody("Math", student), "questionSetId");
        long question = create("questions", questionBody("Original question", set), "questionId");
        long session = create("game-sessions", sessionBody(student, set, 0, "IN_PROGRESS"), "gameSessionId");

        request("POST", "question-sets", setBody("Missing owner", missing), 404);
        request("POST", "questions", questionBody("Missing set", missing), 404);
        request("POST", "game-sessions", sessionBody(missing, set, 0, "IN_PROGRESS"), 404);
        request("POST", "game-sessions", sessionBody(student, missing, 0, "IN_PROGRESS"), 404);
        request("PUT", "question-sets/" + set, setBody("Should not change", missing), 404);
        request("PUT", "questions/" + question, questionBody("Should not change", missing), 404);
        request("PUT", "game-sessions/" + session, sessionBody(student, missing, 99, "COMPLETED"), 404);

        assertThat(questionSets.count()).isEqualTo(1);
        assertThat(questions.count()).isEqualTo(1);
        assertThat(gameSessions.count()).isEqualTo(1);
        assertThat(body(request("GET", "question-sets/" + set, null, 200)).get("title").asText()).isEqualTo("Math");
        assertThat(body(request("GET", "questions/" + question, null, 200)).get("questionText").asText()).isEqualTo("Original question");
        assertThat(body(request("GET", "game-sessions/" + session, null, 200)).get("score").asInt()).isZero();
        request("PUT", "question-sets/" + missing, setBody("Math", student), 404);
        request("PUT", "questions/" + missing, questionBody("Question", set), 404);
        request("PUT", "game-sessions/" + missing, sessionBody(student, set, 0, "IN_PROGRESS"), 404);
    }

    @Test
    void validatesRequestsAndSuppliesGameSessionDefaults() throws Exception {
        long student = createStudent();
        long set = create("question-sets", setBody("Math", student), "questionSetId");
        request("POST", "question-sets", setBody(" ", student), 400);
        request("POST", "question-sets", setBody("a".repeat(201), student), 400);
        request("POST", "question-sets", "{\"title\":\"Missing student\"}", 400);
        request("POST", "questions", questionBody(" ", set), 400);
        request("POST", "questions", questionBody("a".repeat(2001), set), 400);
        request("POST", "questions", questionBody("Invalid set", -1), 400);
        request("POST", "game-sessions", sessionBody(student, set, -1, "IN_PROGRESS"), 400);
        request("POST", "game-sessions", sessionBody(student, set, 0, "UNKNOWN"), 400);
        request("POST", "game-sessions", "{\"studentId\":" + student + ",\"questionSetId\":" + set + ",\"score\":null}", 400);
        request("POST", "game-sessions", "{}", 400);

        JsonNode defaults = body(request("POST", "game-sessions",
            "{\"studentId\":" + student + ",\"questionSetId\":" + set + "}", 201));
        assertThat(defaults.get("score").asInt()).isZero();
        assertThat(defaults.get("status").asText()).isEqualTo("IN_PROGRESS");
        assertThat(questionSets.count()).isEqualTo(1);
        assertThat(questions.count()).isZero();
        assertThat(gameSessions.count()).isEqualTo(1);
    }

    @Test
    void preventsDeletingReferencedStudentsAndQuestionSets() throws Exception {
        long creator = createStudent();
        long player = createStudent();
        long set = create("question-sets", setBody("Math", creator), "questionSetId");
        long question = create("questions", questionBody("What is 2 + 2?", set), "questionId");
        long session = create("game-sessions", sessionBody(player, set, 0, "IN_PROGRESS"), "gameSessionId");

        request("DELETE", "students/" + creator, null, 409);
        request("DELETE", "students/" + player, null, 409);
        request("DELETE", "question-sets/" + set, null, 409);
        request("DELETE", "questions/" + question, null, 204);
        request("DELETE", "question-sets/" + set, null, 409);
        request("DELETE", "game-sessions/" + session, null, 204);
        request("DELETE", "students/" + player, null, 204);
        request("DELETE", "question-sets/" + set, null, 204);
        request("DELETE", "students/" + creator, null, 204);
    }

    private long createStudent() throws Exception {
        return create("students", "{\"name\":\"Test Student\",\"email\":\"test@example.com\"}", "studentId");
    }

    private long create(String path, String input, String idField) throws Exception {
        return body(request("POST", path, input, 201)).get(idField).asLong();
    }

    private void assertListed(String path, String idField, long id) throws Exception {
        JsonNode list = body(request("GET", path, null, 200));
        boolean found = false;
        for (JsonNode item : list) {
            if (item.get(idField).asLong() == id) { found = true; }
        }
        assertThat(found).as("%s includes %s", path, id).isTrue();
    }

    private JsonNode body(HttpResponse<String> response) {
        return json.readTree(response.body());
    }

    private HttpResponse<String> request(String method, String path, String input, int status) throws Exception {
        HttpRequest request = HttpRequest.newBuilder(URI.create("http://localhost:" + port + "/api/" + path))
            .header("Content-Type", "application/json")
            .method(method, input == null ? HttpRequest.BodyPublishers.noBody() : HttpRequest.BodyPublishers.ofString(input))
            .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        assertThat(response.statusCode()).as("%s %s: %s", method, path, response.body()).isEqualTo(status);
        return response;
    }

    private String setBody(String title, long studentId) {
        return "{\"title\":\"" + title + "\",\"description\":\"Practice\",\"studentId\":" + studentId + "}";
    }

    private String questionBody(String text, long questionSetId) {
        return "{\"questionText\":\"" + text + "\",\"questionSetId\":" + questionSetId + "}";
    }

    private String sessionBody(long studentId, long questionSetId, int score, String status) {
        return "{\"studentId\":" + studentId + ",\"questionSetId\":" + questionSetId
            + ",\"score\":" + score + ",\"status\":\"" + status + "\"}";
    }
}
