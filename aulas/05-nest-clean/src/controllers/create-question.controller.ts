import { Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

// const authenticateBodySchema = z.object({
//   email: z.email(),
//   password: z.string(),
// });

// type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  // @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async hanlde() {
    return "ok";
  }
}
