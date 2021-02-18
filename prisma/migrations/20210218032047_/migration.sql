/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[receiverId]` on the table `Invitation`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Invitation.receiverId_unique` ON `Invitation`(`receiverId`);
