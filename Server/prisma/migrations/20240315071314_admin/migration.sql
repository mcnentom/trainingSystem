/*
  Warnings:

  - You are about to drop the column `profile_image` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the `comment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `comment` DROP FOREIGN KEY `Comment_user_id_fkey`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `profile_image`;

-- DropTable
DROP TABLE `comment`;
