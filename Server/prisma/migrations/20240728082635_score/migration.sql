/*
  Warnings:

  - You are about to drop the column `score` on the `EnrolledCourse` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `EnrolledCourse` DROP COLUMN `score`;

-- CreateTable
CREATE TABLE `Score` (
    `score_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `course_id` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL DEFAULT 0,

    UNIQUE INDEX `Score_user_id_course_id_key`(`user_id`, `course_id`),
    PRIMARY KEY (`score_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
