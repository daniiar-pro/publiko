import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('reports')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('post_id', 'integer', (col) => col.references('posts.id'))
    .addColumn('reported_by', 'integer', (col) => col.references('users.id'))
    .addColumn('reason', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('reports').ifExists().execute()
}
