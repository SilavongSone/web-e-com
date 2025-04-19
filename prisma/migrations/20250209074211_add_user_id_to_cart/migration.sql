/*
  Warnings:

  - You are about to drop the column `cartTotal` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `orderById` on the `cart` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `Cart_orderById_fkey`;

-- DropIndex
DROP INDEX `Cart_orderById_fkey` ON `cart`;

-- AlterTable
ALTER TABLE `cart` DROP COLUMN `cartTotal`,
    DROP COLUMN `orderById`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
