-- CreateTable
CREATE TABLE "Dashboard" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "deviceId" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PK_DASHBOARD" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Widget" (
    "id" UUID NOT NULL,
    "options" JSONB,
    "columnIndex" INTEGER,
    "rowIndex" INTEGER,
    "columnCount" INTEGER,
    "rowCount" INTEGER,
    "light" BOOLEAN,
    "backgroundColor" TEXT,
    "primaryColor" TEXT,
    "positiveColor" TEXT,
    "negativeColor" TEXT,
    "dashboardId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PK_WIDGET" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_DASHBOARD__USER_ID" ON "Dashboard"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_DASHBOARD__USER_ID_NAME" ON "Dashboard"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_DASHBOARD__DEVICE_ID" ON "Dashboard"("deviceId");

-- CreateIndex
CREATE INDEX "IDX_WIDGET__DASHBOARD_ID" ON "Widget"("dashboardId");

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "FK_DASHBOARD__USER_ID" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Widget" ADD CONSTRAINT "FK_WIDGET__DASHBOARD_ID" FOREIGN KEY ("dashboardId") REFERENCES "Dashboard"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
