-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "fixtureId" TEXT NOT NULL,
    "fixtureName" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "comp" TEXT NOT NULL,
    "document" TEXT NOT NULL,
    "family" TEXT NOT NULL,
    "cusNum" TEXT NOT NULL,
    "hanaNum" TEXT NOT NULL,
    "productDes" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);
