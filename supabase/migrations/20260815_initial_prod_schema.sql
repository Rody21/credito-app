


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."cash_movements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "movement_type" character varying(20) NOT NULL,
    "category" character varying(50) NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "reference_id" "uuid",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "movement_date" "date" DEFAULT CURRENT_DATE NOT NULL
);


ALTER TABLE "public"."cash_movements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."credit_config" (
    "id" "text" NOT NULL,
    "profit_percentage" integer NOT NULL,
    "initial_percentage" integer NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."credit_config" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."customers" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "document" character varying(50) NOT NULL,
    "full_name" character varying(255) NOT NULL,
    "phone" character varying(50) NOT NULL,
    "address" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "notes" "text",
    "email" character varying(255),
    "active" boolean DEFAULT true NOT NULL,
    "disabled_at" timestamp with time zone
);


ALTER TABLE "public"."customers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sales" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "product_id" "uuid" NOT NULL,
    "sale_type" character varying(20) NOT NULL,
    "sale_date" "date" NOT NULL,
    "down_payment" numeric(12,2) DEFAULT 0,
    "financed_amount" numeric(12,2) NOT NULL,
    "total_sale_amount" numeric(12,2) NOT NULL,
    "status" character varying(20) DEFAULT 'ACTIVE'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sales" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."dashboard_stats" WITH ("security_invoker"='on') AS
 SELECT ( SELECT "count"(*) AS "count"
           FROM "public"."customers") AS "clientes",
    ( SELECT "count"(*) AS "count"
           FROM "public"."products") AS "productos",
    ( SELECT "count"(*) AS "count"
           FROM "public"."sales") AS "ventas";


ALTER VIEW "public"."dashboard_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."installments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sale_id" "uuid" NOT NULL,
    "installment_number" integer NOT NULL,
    "due_date" "date" NOT NULL,
    "original_amount" numeric(12,2) NOT NULL,
    "paid_amount" numeric(12,2) DEFAULT 0 NOT NULL,
    "pending_amount" numeric(12,2) NOT NULL,
    "status" character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."installments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sale_id" "uuid" NOT NULL,
    "installment_id" "uuid",
    "amount" numeric(12,2) NOT NULL,
    "payment_method" character varying(50),
    "payment_date" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."product_batches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "product_id" "uuid" NOT NULL,
    "quantity" integer NOT NULL,
    "remaining_quantity" integer NOT NULL,
    "cost_price" numeric(12,2) NOT NULL,
    "purchase_date" "date" NOT NULL,
    "purchase_method" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "card_installments" integer,
    CONSTRAINT "product_batches_cost_price_check" CHECK (("cost_price" >= (0)::numeric)),
    CONSTRAINT "product_batches_purchase_method_check" CHECK (("purchase_method" = ANY (ARRAY['CASH'::"text", 'CARD'::"text"]))),
    CONSTRAINT "product_batches_quantity_check" CHECK (("quantity" > 0)),
    CONSTRAINT "product_batches_remaining_quantity_check" CHECK (("remaining_quantity" >= 0))
);


ALTER TABLE "public"."product_batches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sale_installments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "sale_id" "uuid" NOT NULL,
    "installment_number" integer NOT NULL,
    "due_date" "date" NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "paid_amount" numeric(12,2) DEFAULT 0,
    "status" character varying(20) DEFAULT 'PENDING'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."sale_installments" OWNER TO "postgres";


ALTER TABLE ONLY "public"."cash_movements"
    ADD CONSTRAINT "cash_movements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."credit_config"
    ADD CONSTRAINT "credit_config_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."customers"
    ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."installments"
    ADD CONSTRAINT "installments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."product_batches"
    ADD CONSTRAINT "product_batches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sale_installments"
    ADD CONSTRAINT "sale_installments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."installments"
    ADD CONSTRAINT "installments_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_installment_id_fkey" FOREIGN KEY ("installment_id") REFERENCES "public"."installments"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id");



ALTER TABLE ONLY "public"."product_batches"
    ADD CONSTRAINT "product_batches_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sale_installments"
    ADD CONSTRAINT "sale_installments_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "public"."sales"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id");



ALTER TABLE ONLY "public"."sales"
    ADD CONSTRAINT "sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id");



CREATE POLICY "Allow all customers delete" ON "public"."customers" FOR DELETE USING (true);



CREATE POLICY "Allow all customers insert" ON "public"."customers" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow all customers select" ON "public"."customers" FOR SELECT USING (true);



CREATE POLICY "Allow all customers update" ON "public"."customers" FOR UPDATE USING (true);



CREATE POLICY "Allow all products delete" ON "public"."products" FOR DELETE USING (true);



CREATE POLICY "Allow all products insert" ON "public"."products" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow all products select" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Allow all products update" ON "public"."products" FOR UPDATE USING (true);



ALTER TABLE "public"."cash_movements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."credit_config" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."customers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "delete product batches" ON "public"."product_batches" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "delete sales" ON "public"."sales" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "insert cash movements" ON "public"."cash_movements" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "insert credit config" ON "public"."credit_config" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "insert installments" ON "public"."installments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "insert payments" ON "public"."payments" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "insert product batches" ON "public"."product_batches" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "insert sales" ON "public"."sales" FOR INSERT TO "authenticated" WITH CHECK (true);



ALTER TABLE "public"."installments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."product_batches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sale_installments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sales" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "select cash movements" ON "public"."cash_movements" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "select credit config" ON "public"."credit_config" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "select installments" ON "public"."installments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "select payments" ON "public"."payments" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "select product batches" ON "public"."product_batches" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "select sales" ON "public"."sales" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "update cash movements" ON "public"."cash_movements" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "update credit config" ON "public"."credit_config" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "update installments" ON "public"."installments" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "update payments" ON "public"."payments" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "update product batches" ON "public"."product_batches" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "update sales" ON "public"."sales" FOR UPDATE TO "authenticated" USING (true) WITH CHECK (true);



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON TABLE "public"."cash_movements" TO "anon";
GRANT ALL ON TABLE "public"."cash_movements" TO "authenticated";
GRANT ALL ON TABLE "public"."cash_movements" TO "service_role";



GRANT ALL ON TABLE "public"."credit_config" TO "anon";
GRANT ALL ON TABLE "public"."credit_config" TO "authenticated";
GRANT ALL ON TABLE "public"."credit_config" TO "service_role";



GRANT ALL ON TABLE "public"."customers" TO "anon";
GRANT ALL ON TABLE "public"."customers" TO "authenticated";
GRANT ALL ON TABLE "public"."customers" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."sales" TO "anon";
GRANT ALL ON TABLE "public"."sales" TO "authenticated";
GRANT ALL ON TABLE "public"."sales" TO "service_role";



GRANT ALL ON TABLE "public"."dashboard_stats" TO "anon";
GRANT ALL ON TABLE "public"."dashboard_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."dashboard_stats" TO "service_role";



GRANT ALL ON TABLE "public"."installments" TO "anon";
GRANT ALL ON TABLE "public"."installments" TO "authenticated";
GRANT ALL ON TABLE "public"."installments" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."product_batches" TO "anon";
GRANT ALL ON TABLE "public"."product_batches" TO "authenticated";
GRANT ALL ON TABLE "public"."product_batches" TO "service_role";



GRANT ALL ON TABLE "public"."sale_installments" TO "anon";
GRANT ALL ON TABLE "public"."sale_installments" TO "authenticated";
GRANT ALL ON TABLE "public"."sale_installments" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";







