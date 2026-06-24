import { Arg, Mutation, Resolver } from "type-graphql";
import { RegisterInput } from "../dto/input/auth.input";
import { RegisterOutput } from "../dto/output/auth.output";
import { AuthService } from "../services/auth.service";

@Resolver()
export class AuthResolver {
  private authService = new AuthService();

  @Mutation(() => RegisterOutput)
  async register(
    @Arg("data", () => RegisterInput) data: RegisterInput,
  ): Promise<RegisterOutput> {
    return this.authService.register(data);
  }
}
