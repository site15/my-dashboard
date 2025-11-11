-- AlterTable
ALTER TABLE "Widget" ADD COLUMN     "state" JSONB;

-- CreateTable
CREATE TABLE "WidgetLog" (
    "id" UUID NOT NULL,
    "oldOptions" JSONB,
    "newOptions" JSONB,
    "oldState" JSONB,
    "newState" JSONB,
    "widgetId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "PK_WIDGET_LOG" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_WIDGET_LOG__WIDGET_ID" ON "WidgetLog"("widgetId");

-- AddForeignKey
ALTER TABLE "WidgetLog" ADD CONSTRAINT "FK_WIDGET_LOG__WIDGET_ID" FOREIGN KEY ("widgetId") REFERENCES "Widget"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
