/*
  Warnings:

  - You are about to drop the `user_assessment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user_assessment`;

-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `room` VARCHAR(191) NOT NULL,
    `author` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assessment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(191) NOT NULL,
    `choices` VARCHAR(191) NOT NULL,
    `correctChoice` INTEGER NOT NULL,
    `score` DOUBLE NOT NULL,
    `course_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Assessment` ADD CONSTRAINT `Assessment_course_id_fkey` FOREIGN KEY (`course_id`) REFERENCES `Course`(`course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
