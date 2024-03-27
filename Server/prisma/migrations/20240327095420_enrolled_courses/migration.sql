/*
  Warnings:

  - You are about to drop the column `score` on the `assessment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `assessment` DROP COLUMN `score`;

-- CreateTable
CREATE TABLE `EnrolledCourse` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `enrollmentDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `score` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EnrolledCourse` ADD CONSTRAINT `EnrolledCourse_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EnrolledCourse` ADD CONSTRAINT `EnrolledCourse_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
