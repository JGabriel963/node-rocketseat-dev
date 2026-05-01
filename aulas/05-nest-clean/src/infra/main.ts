import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { EnvService } from "./env/env.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvService);
  const port = configService.get("PORT");

  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}
bootstrap();
