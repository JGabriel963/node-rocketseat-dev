import { Controller, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/auth/current-user-decorator";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import type { UserPayload } from "src/auth/jwt.strategy";

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
  async hanlde(@CurrentUser() user: UserPayload) {
    console.log(user);

    return "ok";
  }
}
