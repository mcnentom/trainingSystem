/*
  Warnings:

  - You are about to drop the column `user_id` on the `discussion` table. All the data in the column will be lost.
  - Added the required column `email` to the `Discussion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `discussion` DROP FOREIGN KEY `Discussion_user_id_fkey`;

-- AlterTable
ALTER TABLE `discussion` DROP COLUMN `user_id`,
    ADD COLUMN `email` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Discussion` ADD CONSTRAINT `Discussion_email_fkey` FOREIGN KEY (`email`) REFERENCES `User`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
