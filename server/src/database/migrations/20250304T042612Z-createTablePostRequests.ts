import type { Kysely } from 'kysely'
import { sql } from 'kysely'

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('post_requests')
    .ifNotExists()
    .addColumn('id', 'integer', (col) =>
      col.primaryKey().generatedAlwaysAsIdentity()
    )
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('requested_by', 'integer', (col) => col.references('users.id'))
    .addColumn('status', 'varchar(50)', (col) => col.defaultTo('pending'))
    .addColumn('admin_id', 'integer', (col) => col.references('users.id'))
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute()
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('post_requests').ifExists().execute()
}
