CREATE TABLE "email_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "bookingId" TEXT,
    "html" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "email_logs_sentAt_idx" ON "email_logs"("sentAt");
CREATE INDEX "email_logs_bookingId_idx" ON "email_logs"("bookingId");
