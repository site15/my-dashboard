DO $$
BEGIN
    DROP INDEX IF EXISTS "UQ_DASHBOARD__USER_ID_NAME";
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END
$$;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_DASHBOARD__USER_ID_NAME" ON "Dashboard"("userId", "name")
WHERE
    "deletedAt" IS NULL;

--
DO $$
BEGIN
    DROP INDEX IF EXISTS "UQ_DASHBOARD__DEVICE_ID";
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END
$$;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "UQ_DASHBOARD__DEVICE_ID" ON "Dashboard"("deviceId")
WHERE
    "deletedAt" IS NULL;

