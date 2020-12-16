/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[uid]` on the table `Invitation`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Invitation.uid_unique` ON `Invitation`(`uid`);
