import { Migration } from '@mikro-orm/migrations';

export class Migration20210416134216 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      create table "users" (
        "id" serial primary key,
        "first_name" text not null,
        "last_name" text not null,
        "password" text not null,
        "is_active" bool not null default true,
        "created_at" timestamptz(0) not null default CURRENT_TIMESTAMP,
        "updated_at" timestamptz(0) not null default CURRENT_TIMESTAMP
      );
    `);
  }

  async down(): Promise<void> {
    this.addSql('drop table "users";');
  }
}
