/*
  Warnings:

  - A unique constraint covering the columns `[user_id,course_id]` on the table `Certification` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id,course_id]` on the table `EnrolledCourse` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Certification_user_id_course_id_key` ON `Certification`(`user_id`, `course_id`);

-- CreateIndex
CREATE UNIQUE INDEX `EnrolledCourse_user_id_course_id_key` ON `EnrolledCourse`(`user_id`, `course_id`);

-- AddForeignKey
ALTER TABLE `EnrolledCourse` ADD CONSTRAINT `EnrolledCourse_user_id_course_id_fkey` FOREIGN KEY (`user_id`, `course_id`) REFERENCES `Certification`(`user_id`, `course_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
