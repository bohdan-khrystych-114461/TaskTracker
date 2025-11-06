CREATE TABLE IF NOT EXISTS "TimeBlocks" (
    "Id" uuid NOT NULL,
    "TaskName" character varying(200) NOT NULL,
    "StartTime" timestamp with time zone NOT NULL,
    "EndTime" timestamp with time zone NOT NULL,
    "Duration" integer NOT NULL,
    "Date" timestamp with time zone NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UpdatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_TimeBlocks" PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS "IX_TimeBlocks_Date" ON "TimeBlocks" ("Date");

CREATE TABLE IF NOT EXISTS "TodoItems" (
    "Id" uuid NOT NULL,
    "Title" character varying(200) NOT NULL,
    "Description" character varying(1000),
    "IsCompleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CompletedAt" timestamp with time zone,
    CONSTRAINT "PK_TodoItems" PRIMARY KEY ("Id")
);

CREATE INDEX IF NOT EXISTS "IX_TodoItems_IsCompleted" ON "TodoItems" ("IsCompleted");
