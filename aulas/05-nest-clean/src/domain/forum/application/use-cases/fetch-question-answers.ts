import { Either, right } from "@/core/either";
import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswersRequest {
  questionId: string;
  page: number;
}

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private answersRespository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRespository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return right({ answers });
  }
}
