import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDb() {
    if (process.env.NODE_ENV === 'production') return;

    const modelNames = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key !== 'constructor'
    );

    return Promise.all(
      modelNames.map((modelName) => {
        const model = this[modelName as keyof this] as any;
        if (model && typeof model.deleteMany === 'function') {
          return model.deleteMany();
        }
      })
    );
  }
}