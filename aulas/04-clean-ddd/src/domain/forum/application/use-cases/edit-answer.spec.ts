import { expect, describe, it, beforeEach } from "vitest";

import { makeAnswer } from "../../../../../test/factories/make-answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { EditAnswerUseCase } from "./edit-answer";
import { InMemoryAnswersRepository } from "test/repositories/in-memory-answers-respository";

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe("Edit Answer", () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(inMemoryAnswersRepository);
  });

  it("should be able to edit a answer", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID("auhtor-1") },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    await sut.execute({
      answerId: newAnswer.id.toValue(),
      authorId: "auhtor-1",
      content: "Conteúdo teste",
    });

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: "Conteúdo teste",
    });
  });

  it("should not be able to edit a answer from another user", async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID("auhtor-1") },
      new UniqueEntityID("answer-1"),
    );

    await inMemoryAnswersRepository.create(newAnswer);

    expect(() => {
      return sut.execute({
        authorId: "auhtor-2",
        answerId: newAnswer.id.toValue(),
        content: "Conteúdo teste",
      });
    }).rejects.toBeInstanceOf(Error);
  });
});
