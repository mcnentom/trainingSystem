/*
  Warnings:

  - You are about to drop the column `enrollment_id` on the `user_assessment` table. All the data in the column will be lost.
  - You are about to drop the `courseenrollment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `coursematerial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `discussion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `courseenrollment` DROP FOREIGN KEY `CourseEnrollment_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `courseenrollment` DROP FOREIGN KEY `CourseEnrollment_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `coursematerial` DROP FOREIGN KEY `CourseMaterial_course_id_fkey`;

-- DropForeignKey
ALTER TABLE `discussion` DROP FOREIGN KEY `Discussion_email_fkey`;

-- DropForeignKey
ALTER TABLE `user_assessment` DROP FOREIGN KEY `User_Assessment_enrollment_id_fkey`;

-- AlterTable
ALTER TABLE `course` ADD COLUMN `progress` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user_assessment` DROP COLUMN `enrollment_id`;

-- DropTable
DROP TABLE `courseenrollment`;

-- DropTable
DROP TABLE `coursematerial`;

-- DropTable
DROP TABLE `discussion`;

-- CreateTable
CREATE TABLE `MaterialBatch` (
    `batch_id` INTEGER NOT NULL AUTO_INCREMENT,
    `course_id` INTEGER NOT NULL,
    `batch_number` INTEGER NOT NULL,
    `material_types` Text NOT NULL,

    PRIMARY KEY (`batch_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaterialBatch` ADD CONSTRAINT `MaterialBatch_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
