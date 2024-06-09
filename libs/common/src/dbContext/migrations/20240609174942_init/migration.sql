-- CreateTable
CREATE TABLE "attached" (
    "id" BIGSERIAL NOT NULL,
    "attached_path" VARCHAR(250) NOT NULL,

    CONSTRAINT "attached_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" BIGSERIAL NOT NULL,
    "user_id" BIGSERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL DEFAULT 'is not defined',
    "description" VARCHAR(500),
    "status" VARCHAR(50) NOT NULL DEFAULT 'is not defined',

    CONSTRAINT "ask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" BIGSERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks_attached" (
    "task_id" BIGSERIAL NOT NULL,
    "attached_id" BIGSERIAL NOT NULL,

    CONSTRAINT "task_id_attached_id_pkey" PRIMARY KEY ("task_id","attached_id")
);

-- CreateIndex
CREATE INDEX "attached_id_idx" ON "attached"("id");

-- CreateIndex
CREATE INDEX "task_id_idx" ON "tasks"("id");

-- CreateIndex
CREATE INDEX "user_id_idx" ON "users"("id");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks_attached" ADD CONSTRAINT "attached_id_fkey" FOREIGN KEY ("attached_id") REFERENCES "attached"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tasks_attached" ADD CONSTRAINT "task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
