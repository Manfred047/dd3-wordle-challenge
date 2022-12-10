/*
 Navicat Premium Data Transfer

 Source Server         : DD3
 Source Server Type    : PostgreSQL
 Source Server Version : 140004
 Source Host           : 34.125.92.133:5432
 Source Catalog        : postgres
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140004
 File Encoding         : 65001

 Date: 09/12/2022 18:37:50
*/


-- ----------------------------
-- Table structure for current_user_challenges
-- ----------------------------
DROP TABLE IF EXISTS "public"."current_user_challenges";
CREATE TABLE "public"."current_user_challenges" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_word" varchar(255) COLLATE "pg_catalog"."default",
  "user_challenge_id" uuid,
  "attempt" int2 NOT NULL DEFAULT '0'::smallint
)
;

-- ----------------------------
-- Table structure for selected_words
-- ----------------------------
DROP TABLE IF EXISTS "public"."selected_words";
CREATE TABLE "public"."selected_words" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "word" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Table structure for user_challenges
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_challenges";
CREATE TABLE "public"."user_challenges" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL,
  "is_victory" int2,
  "word" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "created_at" timestamp(6),
  "updated_at" timestamp(6)
)
;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "email" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "last_name" varchar(50) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(255) COLLATE "pg_catalog"."default",
  "token" char(100) COLLATE "pg_catalog"."default",
  "current_user_challenge_id" uuid,
  "created_at" timestamp(6),
  "updated_at" timestamp(6)
)
;

-- ----------------------------
-- Table structure for words
-- ----------------------------
DROP TABLE IF EXISTS "public"."words";
CREATE TABLE "public"."words" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "word" varchar(255) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Function structure for uuid_generate_v1
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v1"();
CREATE OR REPLACE FUNCTION "public"."uuid_generate_v1"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v1'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_generate_v1mc
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v1mc"();
CREATE OR REPLACE FUNCTION "public"."uuid_generate_v1mc"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v1mc'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_generate_v3
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v3"("namespace" uuid, "name" text);
CREATE OR REPLACE FUNCTION "public"."uuid_generate_v3"("namespace" uuid, "name" text)
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v3'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_generate_v4
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v4"();
CREATE OR REPLACE FUNCTION "public"."uuid_generate_v4"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v4'
  LANGUAGE c VOLATILE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_generate_v5
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v5"("namespace" uuid, "name" text);
CREATE OR REPLACE FUNCTION "public"."uuid_generate_v5"("namespace" uuid, "name" text)
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_generate_v5'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_nil
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_nil"();
CREATE OR REPLACE FUNCTION "public"."uuid_nil"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_nil'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_ns_dns
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_dns"();
CREATE OR REPLACE FUNCTION "public"."uuid_ns_dns"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_ns_dns'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_ns_oid
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_oid"();
CREATE OR REPLACE FUNCTION "public"."uuid_ns_oid"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_ns_oid'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_ns_url
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_url"();
CREATE OR REPLACE FUNCTION "public"."uuid_ns_url"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_ns_url'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Function structure for uuid_ns_x500
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_x500"();
CREATE OR REPLACE FUNCTION "public"."uuid_ns_x500"()
  RETURNS "pg_catalog"."uuid" AS '$libdir/uuid-ossp', 'uuid_ns_x500'
  LANGUAGE c IMMUTABLE STRICT
  COST 1;

-- ----------------------------
-- Uniques structure for table current_user_challenges
-- ----------------------------
ALTER TABLE "public"."current_user_challenges" ADD CONSTRAINT "REL_ea09607e3c25f9bd03dec4cbf4" UNIQUE ("user_challenge_id");

-- ----------------------------
-- Primary Key structure for table current_user_challenges
-- ----------------------------
ALTER TABLE "public"."current_user_challenges" ADD CONSTRAINT "PK_59651968491becf760c4d58e59b" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table selected_words
-- ----------------------------
ALTER TABLE "public"."selected_words" ADD CONSTRAINT "UQ_c7f8b8d6885134a1918820ae921" UNIQUE ("word");

-- ----------------------------
-- Primary Key structure for table selected_words
-- ----------------------------
ALTER TABLE "public"."selected_words" ADD CONSTRAINT "PK_2559b918c42655266059e8cf7fe" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table user_challenges
-- ----------------------------
ALTER TABLE "public"."user_challenges" ADD CONSTRAINT "PK_7c111333fc0e3a23528503498de" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_7869db61ed722d562da1acf6d59" UNIQUE ("token");
ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_ff35941e730f4588a71c60b6879" UNIQUE ("current_user_challenge_id");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table words
-- ----------------------------
ALTER TABLE "public"."words" ADD CONSTRAINT "UQ_38a98e41b6be0f379166dc2b58d" UNIQUE ("word");

-- ----------------------------
-- Primary Key structure for table words
-- ----------------------------
ALTER TABLE "public"."words" ADD CONSTRAINT "PK_feaf97accb69a7f355fa6f58a3d" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table current_user_challenges
-- ----------------------------
ALTER TABLE "public"."current_user_challenges" ADD CONSTRAINT "FK_ea09607e3c25f9bd03dec4cbf4c" FOREIGN KEY ("user_challenge_id") REFERENCES "public"."user_challenges" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table user_challenges
-- ----------------------------
ALTER TABLE "public"."user_challenges" ADD CONSTRAINT "FK_dec3d65755692349a4dddda1f88" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "FK_ff35941e730f4588a71c60b6879" FOREIGN KEY ("current_user_challenge_id") REFERENCES "public"."current_user_challenges" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
