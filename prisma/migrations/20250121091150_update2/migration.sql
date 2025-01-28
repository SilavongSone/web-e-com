/*
  Warnings:

  - You are about to drop the column `created` on the `productcart` table. All the data in the column will be lost.
  - You are about to drop the column `updated` on the `productcart` table. All the data in the column will be lost.
  - You are about to drop the `_producttocategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `amount` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePaymentId` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_producttocategory` DROP FOREIGN KEY `_ProductTocategory_A_fkey`;

-- DropForeignKey
ALTER TABLE `_producttocategory` DROP FOREIGN KEY `_ProductTocategory_B_fkey`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `stripePaymentId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` MODIFY `categoryId` INTEGER NULL;

-- AlterTable
ALTER TABLE `productcart` DROP COLUMN `created`,
    DROP COLUMN `updated`;

-- DropTable
DROP TABLE `_producttocategory`;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
