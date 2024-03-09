/*
  Warnings:

  - You are about to drop the column `course_id` on the `discussion` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `discussion` table. All the data in the column will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_discussion_id_fkey`;

-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `discussion` DROP FOREIGN KEY `Discussion_course_id_fkey`;

-- AlterTable
ALTER TABLE `discussion` DROP COLUMN `course_id`,
    DROP COLUMN `title`;

-- DropTable
DROP TABLE `comment`;
