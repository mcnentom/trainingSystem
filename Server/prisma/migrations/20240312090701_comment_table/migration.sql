/*
  Warnings:

  - You are about to drop the column `discussion_id` on the `comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_discussion_id_fkey`;

-- AlterTable
ALTER TABLE `comment` DROP COLUMN `discussion_id`;
