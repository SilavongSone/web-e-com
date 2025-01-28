/*
  Warnings:

  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `categoryId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_ProductTocategory` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProductTocategory_AB_unique`(`A`, `B`),
    INDEX `_ProductTocategory_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_ProductTocategory` ADD CONSTRAINT `_ProductTocategory_A_fkey` FOREIGN KEY (`A`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProductTocategory` ADD CONSTRAINT `_ProductTocategory_B_fkey` FOREIGN KEY (`B`) REFERENCES `category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
