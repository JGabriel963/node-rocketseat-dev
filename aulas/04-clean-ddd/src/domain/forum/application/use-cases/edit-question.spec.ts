import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryQuestionsRepository } from "test/repositories/in-memory-questions-repository";
import { makeQuestion } from "test/factories/make-question";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditQuestionUseCase } from "./edit-question";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe("Edit Question", () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository);
  });

  it("should be able to edit a question", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("auhtor-1") },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    await sut.execute({
      questionId: newQuestion.id.toValue(),
      authorId: "auhtor-1",
      title: "Pergunta teste",
      content: "Conteúdo teste",
    });

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: "Pergunta teste",
      content: "Conteúdo teste",
    });
  });

  it("should not be able to edit a question from another user", async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID("auhtor-1") },
      new UniqueEntityID("question-1"),
    );

    await inMemoryQuestionsRepository.create(newQuestion);

    expect(() => {
      return sut.execute({
        authorId: "auhtor-2",
        questionId: newQuestion.id.toValue(),
        title: "Pergunta teste",
        content: "Conteúdo teste",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
