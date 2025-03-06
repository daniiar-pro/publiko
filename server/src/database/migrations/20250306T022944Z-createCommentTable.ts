import type { Kysely } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('comment')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.generatedAlwaysAsIdentity())
    .addColumn('content', 'text', (col) => col.notNull())
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('comment').execute()
}
