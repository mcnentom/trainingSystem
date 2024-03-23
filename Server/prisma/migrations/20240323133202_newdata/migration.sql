/*
  Warnings:

  - Added the required column `profile_image` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `profile_image` VARCHAR(191) NOT NULL;
