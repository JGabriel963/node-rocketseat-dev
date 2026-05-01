import { Encrypter } from "@/domain/forum/application/cyptography/encrypter";
import { JwtEncrypter } from "./jwt-encrypter";
import { BcryptHasher } from "./bcrypt-hasher";
import { Module } from "@nestjs/common";
import { HashComparer } from "@/domain/forum/application/cyptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cyptography/hash-generator";

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
