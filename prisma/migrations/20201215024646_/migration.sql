/*
  Warnings:

  - You are about to drop the column `accepted` on the `Invitation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Invitation` DROP COLUMN `accepted`,
    ADD COLUMN     `sent` VARCHAR(191) NOT NULL DEFAULT 'false';
