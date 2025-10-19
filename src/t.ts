// src/cli/seed-users.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserRepository } from './user/entities/repositories/user.repository';
import { UserService } from './user/user.service';

async function bootstrap() {
  // 1️⃣ Create application context (no HTTP server)
  const appContext = await NestFactory.createApplicationContext(AppModule);

  try {
    // 2️⃣ Get a service from the DI container
    const usersService = appContext.get(UserService);

    // 3️⃣ Run your custom logic
    //usersService.findOne({ name: 'admin' });
    console.log(usersService.t());
  } catch (error) {
    console.error('❌ Error running command:', error);
  } finally {
    // 4️⃣ Close DB connections and other resources
    await appContext.close();
  }
}

bootstrap();
