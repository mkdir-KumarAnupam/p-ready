// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  boolean as pgBoolean,
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `p-ready_${name}`);

export const folders = createTable("folder", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const images = createTable("image", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: varchar("name", { length: 256 }),
  url: varchar("url", { length: 1024 }).notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  favourited: pgBoolean("favourited").default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date()
  ),
});

export const imageShares = createTable("image_share", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  imageId: integer("image_id").notNull(),
  sharedWith: varchar("shared_with", { length: 256 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const imageFolders = createTable("image_folder", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  imageId: integer("image_id").notNull(),
  folderId: integer("folder_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

// Define relations
export const imagesRelations = relations(images, ({ many }) => ({
  shares: many(imageShares),
  folders: many(imageFolders),
}));

export const foldersRelations = relations(folders, ({ many }) => ({
  images: many(imageFolders),
}));

export const imageSharesRelations = relations(imageShares, ({ one }) => ({
  image: one(images, {
    fields: [imageShares.imageId],
    references: [images.id],
  }),
}));

export const imageFoldersRelations = relations(imageFolders, ({ one }) => ({
  image: one(images, {
    fields: [imageFolders.imageId],
    references: [images.id],
  }),
  folder: one(folders, {
    fields: [imageFolders.folderId],
    references: [folders.id],
  }),
}));


