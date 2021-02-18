/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[sent]` on the table `Invitation`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Invitation.sent_unique` ON `Invitation`(`sent`);
