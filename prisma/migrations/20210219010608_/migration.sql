/*
  Warnings:

  - You are about to alter the column `description` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.

*/
-- AlterTable
ALTER TABLE `Ad` MODIFY `description` VARCHAR(191);

-- AlterTable
ALTER TABLE `User` MODIFY `description` JSON;
