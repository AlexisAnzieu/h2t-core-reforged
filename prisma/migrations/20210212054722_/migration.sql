/*
  Warnings:

  - The migration will change the primary key for the `Ad` table. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `Ad` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);
