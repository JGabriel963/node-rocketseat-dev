import { Injectable } from "@nestjs/common";
import { HashComparer } from "@/domain/forum/application/cyptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cyptography/hash-generator";
import { compare, hash } from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private readonly HASH_SALT_LENGTH = 8;

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
