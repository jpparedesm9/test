--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.2

-- Started on 2020-09-01 15:17:33 -05

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 256 (class 1259 OID 20225)
-- Name: cr_catalogo; Type: TABLE; Schema: eq_comun; Owner: postgres
--

CREATE TABLE eq_comun.cr_catalogo (
    ca_codigo integer DEFAULT nextval('eq_comun.sc_catalogo'::regclass) NOT NULL,
    ca_activo smallint,
    ca_etiqueta character varying(64),
    ca_valor character varying(64),
    ca_tipo character varying(64),
    ca_descripcion text,
    ca_orden integer DEFAULT 0,
    ca_login character varying(32),
    ca_fecha_actualiza timestamp without time zone
);


ALTER TABLE eq_comun.cr_catalogo OWNER TO postgres;

--
-- TOC entry 3603 (class 0 OID 20225)
-- Dependencies: 256
-- Data for Name: cr_catalogo; Type: TABLE DATA; Schema: eq_comun; Owner: postgres
--

INSERT INTO eq_comun.cr_catalogo VALUES (1, 1, 'PROCESO PARCIAL RENTABILIDAD', '0', 'TIPO_PROCESO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo rg_codigo', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (2, 1, 'PROCESO TOTAL RENTABILIDAD', '1', 'TIPO_PROCESO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo rg_codigo', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (3, 1, 'INSERTADO', '1', 'RENTABILIDAD_ESTADO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo gr_estado', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (4, 1, 'BATCH RENTABILIDAD FINANCIERA', '2', 'RENTABILIDAD_ESTADO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo gr_estado', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (5, 1, 'EN PROCESO RENTABILIDAD FINANCIERA', '3', 'RENTABILIDAD_ESTADO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo gr_estado', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (6, 1, 'PROCESADO RENTABILIDAD FINANCIERA', '4', 'RENTABILIDAD_ESTADO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo gr_estado', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (7, 1, 'BATCH RENTABILIDAD CLIENTE', '5', 'RENTABILIDAD_ESTADO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo gr_estado', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (8, 1, 'EN PROCESO RENTABILIDAD CLIENTE', '6', 'RENTABILIDAD_ESTADO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo gr_estado', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (9, 1, 'PROCESADO RENTABILIDAD CLIENTE', '7', 'RENTABILIDAD_ESTADO', 'tabla eq_rentabilidad.cr_gen_rentabilidad campo gr_estado', 0, 'lm', '2020-06-22 13:36:20.961589');
INSERT INTO eq_comun.cr_catalogo VALUES (11, 1, 'Staging', NULL, 'CONECCION_ETL', '{
  "Staging_Schema": "public",
  "Staging_Port": 5433,
  "Staging_Login": "postgres",
  "Staging_Password": "1234",
  "Staging_AdditionalParams": "",
  "Staging_Database": "cyd_staging",
  "Staging_Server": "127.0.0.1"
}', 0, NULL, NULL);
INSERT INTO eq_comun.cr_catalogo VALUES (17, 1, 'Costos_Rentabilidad', NULL, 'CONECCION_ETL', '{
  "Costos_Rentabilidad_Schema": "public",
  "Costos_Rentabilidad_Port": 5433,
  "Costos_Rentabilidad_Login": "postgres",
  "Costos_Rentabilidad_Password": "1234",
  "Costos_Rentabilidad_AdditionalParams": "",
  "Costos_Rentabilidad_Database": "cyd_staging",
  "Costos_Rentabilidad_Server": "127.0.0.1"
}', 0, NULL, NULL);
INSERT INTO eq_comun.cr_catalogo VALUES (20, 1, 'FECHA CIERRE', '1', 'CONFIGURACION_ETL', 'Fecha de Cierre SI "1" o NO "0".', 0, 'jp', '2020-08-22 15:17:43.558');
INSERT INTO eq_comun.cr_catalogo VALUES (19, 1, 'TAMAÑO DE PAGINA', '10', 'CONFIGURACION_ETL', 'TAMAÑO DE LA PAGINA DE FINANWARE ETL', 0, 'jp', '2020-08-22 15:17:53.193');
INSERT INTO eq_comun.cr_catalogo VALUES (22, 1, 'FECHA PRESUPUESTO', '2020-04-22', 'CONFIGURACION_ETL', 'FECHA PRESUPUESTO', 0, 'jp', '2020-08-22 16:25:03.46');
INSERT INTO eq_comun.cr_catalogo VALUES (23, 1, 'URL_ENDPOINT', NULL, 'CONFIGURACION_SEGURIDAD', 'http://127.0.0.1:8080/be-admin-proyectos-web/AutenticacionAutorizacionWS?wsdl', 0, NULL, NULL);
INSERT INTO eq_comun.cr_catalogo VALUES (24, 1, 'campo_cedula', 'cedula', 'CONFIGURACION_SEGURIDAD', NULL, 0, NULL, NULL);
INSERT INTO eq_comun.cr_catalogo VALUES (25, 1, 'codigo_sistema_api', '1', 'CONFIGURACION_SEGURIDAD', NULL, 0, NULL, NULL);
INSERT INTO eq_comun.cr_catalogo VALUES (26, 1, 'Carpeta', '1', 'TIPO_ESTRUCTURA_ESQUEMA', 'CARPETA', 0, NULL, NULL);
INSERT INTO eq_comun.cr_catalogo VALUES (27, 1, 'Cuenta Gasto', '2', 'TIPO_ESTRUCTURA_ESQUEMA', 'CUENTA_GASTO', 0, NULL, NULL);
INSERT INTO eq_comun.cr_catalogo VALUES (28, 1, 'Producto Rentabilidad', '3', 'TIPO_ESTRUCTURA_ESQUEMA', 'PRODUCTO_RENTABILIDAD', 0, NULL, NULL);


--
-- TOC entry 3475 (class 2606 OID 20614)
-- Name: cr_catalogo pk_cr_catalogo; Type: CONSTRAINT; Schema: eq_comun; Owner: postgres
--

ALTER TABLE ONLY eq_comun.cr_catalogo
    ADD CONSTRAINT pk_cr_catalogo PRIMARY KEY (ca_codigo);


-- Completed on 2020-09-01 15:17:33 -05

--
-- PostgreSQL database dump complete
--

