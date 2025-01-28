/*
  Warnings:

  - Added the required column `updated` to the `ProductCart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `cart` DROP FOREIGN KEY `cart_orderById_fkey`;

-- DropForeignKey
ALTER TABLE `image` DROP FOREIGN KEY `image_productId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_orderById_fkey`;

-- DropForeignKey
ALTER TABLE `productcart` DROP FOREIGN KEY `productCart_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `productcart` DROP FOREIGN KEY `productCart_productId_fkey`;

-- AlterTable
ALTER TABLE `order` MODIFY `stripePaymentId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `productcart` ADD COLUMN `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `productorder` MODIFY `orderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_orderById_fkey` FOREIGN KEY (`orderById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cart` ADD CONSTRAINT `Cart_orderById_fkey` FOREIGN KEY (`orderById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCart` ADD CONSTRAINT `ProductCart_cartId_fkey` FOREIGN KEY (`cartId`) REFERENCES `Cart`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductCart` ADD CONSTRAINT `ProductCart_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Image` ADD CONSTRAINT `Image_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
