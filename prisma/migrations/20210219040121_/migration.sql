/*
  Warnings:

  - The migration will remove the values [BOARDGAME] on the enum `Ad_categories`. If these variants are still used in the database, the migration will fail.

*/
-- AlterTable
ALTER TABLE `Ad` MODIFY `categories` ENUM('JEU', 'CUISINE', 'DIVERS', 'ELECTRONIQUE', 'LIVRE', 'MAISON', 'SERVICE', 'VETEMENT') NOT NULL DEFAULT 'DIVERS';
