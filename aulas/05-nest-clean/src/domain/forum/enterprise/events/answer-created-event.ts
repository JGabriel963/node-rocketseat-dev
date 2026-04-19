import { DomainEvents } from "@/core/events/domain-events";
import { Answer } from "../entities/answer";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export class AnswerCreatedEvent implements DomainEvents {
  public ocurredAt: Date;
  public answer: Answer;

  constructor(answer: Answer) {
    this.answer = answer;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.answer.id;
  }
}
