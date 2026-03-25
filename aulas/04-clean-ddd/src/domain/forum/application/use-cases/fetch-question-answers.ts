import { Answer } from "../../enterprise/entities/answer";
import { AnswersRepository } from "../repositories/answers-repository";

interface FetchQuestionAnswersRequest {
  questionId: string;
  page: number;
}

interface FetchQuestionAnswersResponse {
  answers: Answer[];
}

export class FetchQuestionAnswersUseCase {
  constructor(private answersRespository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.answersRespository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return {
      answers,
    };
  }
}
