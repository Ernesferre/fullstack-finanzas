/*
  Warnings:

  - You are about to drop the column `accountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `transferId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Budget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ExchangeRate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PasswordResetToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefreshToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Transfer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `currency` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordResetToken" DROP CONSTRAINT "PasswordResetToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_accountId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_transferId_fkey";

-- DropForeignKey
ALTER TABLE "Transfer" DROP CONSTRAINT "Transfer_userId_fkey";

-- DropIndex
DROP INDEX "Transaction_accountId_date_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "accountId",
DROP COLUMN "transferId",
ADD COLUMN     "currency" "Currency" NOT NULL;

-- DropTable
DROP TABLE "Account";

-- DropTable
DROP TABLE "Budget";

-- DropTable
DROP TABLE "ExchangeRate";

-- DropTable
DROP TABLE "PasswordResetToken";

-- DropTable
DROP TABLE "RefreshToken";

-- DropTable
DROP TABLE "Transfer";

-- DropEnum
DROP TYPE "AccountType";

-- DropEnum
DROP TYPE "RateType";
