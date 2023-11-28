-- CreateTable
CREATE TABLE "status" (
    "id" TEXT NOT NULL,
    "temperature" TEXT NOT NULL,
    "humidity" TEXT NOT NULL,
    "mq2" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);
