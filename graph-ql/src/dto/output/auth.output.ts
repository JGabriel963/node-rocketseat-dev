import { Field, ObjectType } from "type-graphql";
import { UserModel } from "../../models/user.model";

@ObjectType()
export class RegisterOutput {
  @Field(() => String)
  token!: string;

  @Field(() => UserModel)
  user!: UserModel;
}
