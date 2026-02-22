import { pgTable, text, integer, boolean, timestamp, jsonb, uuid } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  name: text('name'),
  avatarUrl: text('avatar_url'),
  plan: text('plan').notNull().default('free'),
  creditsBalance: integer('credits_balance').notNull().default(100),
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  isPublic: boolean('is_public').notNull().default(false),
  templateId: text('template_id'),
  forkedFromId: uuid('forked_from_id'),
  likeCount: integer('like_count').notNull().default(0),
  forkCount: integer('fork_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const files = pgTable('files', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  path: text('path').notNull(),
  content: text('content').notNull().default(''),
  language: text('language').notNull().default('html'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const branches = pgTable('branches', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull().default('main'),
  headSnapshotId: uuid('head_snapshot_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const snapshots = pgTable('snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  branchId: uuid('branch_id').references(() => branches.id),
  parentId: uuid('parent_id'),
  message: text('message').notNull().default('Snapshot'),
  fileManifest: jsonb('file_manifest').notNull().default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const deployments = pgTable('deployments', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  snapshotId: uuid('snapshot_id').references(() => snapshots.id),
  status: text('status').notNull().default('pending'),
  workerUrl: text('worker_url'),
  customDomain: text('custom_domain'),
  cfWorkerName: text('cf_worker_name'),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const creditLedger = pgTable('credit_ledger', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amount: integer('amount').notNull(),
  type: text('type').notNull(),
  description: text('description').notNull(),
  referenceId: text('reference_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const aiGenerations = pgTable('ai_generations', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  prompt: text('prompt').notNull(),
  model: text('model').notNull(),
  inputTokens: integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  creditsUsed: integer('credits_used').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type File = typeof files.$inferSelect
export type NewFile = typeof files.$inferInsert
export type Snapshot = typeof snapshots.$inferSelect
export type Deployment = typeof deployments.$inferSelect
export type CreditLedger = typeof creditLedger.$inferSelect
