-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 25-10-2025 a las 02:13:02
-- Versión del servidor: 8.2.0
-- Versión de PHP: 8.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `restaurante_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aperturas_caja`
--

DROP TABLE IF EXISTS `aperturas_caja`;
CREATE TABLE IF NOT EXISTS `aperturas_caja` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `caja_id` bigint DEFAULT NULL,
  `usuario_apertura_id` bigint DEFAULT NULL,
  `usuario_cierre_id` bigint DEFAULT NULL,
  `fecha_apertura` datetime DEFAULT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  `monto_inicial` decimal(10,2) DEFAULT NULL,
  `monto_cierre` decimal(10,2) DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `caja_id` (`caja_id`),
  KEY `usuario_apertura_id` (`usuario_apertura_id`),
  KEY `usuario_cierre_id` (`usuario_cierre_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cajas`
--

DROP TABLE IF EXISTS `cajas`;
CREATE TABLE IF NOT EXISTS `cajas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sede_id` bigint DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `ubicacion` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('activa','inactiva') COLLATE utf8mb4_general_ci DEFAULT 'inactiva',
  `usuario_id` bigint DEFAULT NULL,
  `saldo_inicial` decimal(10,2) DEFAULT '0.00',
  `saldo_final` decimal(10,2) DEFAULT '0.00',
  `fecha_apertura` datetime DEFAULT NULL,
  `fecha_cierre` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sede_id` (`sede_id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

DROP TABLE IF EXISTS `categorias`;
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tipo_documento` enum('DNI','RUC') COLLATE utf8mb4_general_ci NOT NULL,
  `numero_documento` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `razon_social` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `correo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numero_documento` (`numero_documento`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comprobantes`
--

DROP TABLE IF EXISTS `comprobantes`;
CREATE TABLE IF NOT EXISTS `comprobantes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `tipo_comprobante` enum('boleta','factura') COLLATE utf8mb4_general_ci NOT NULL,
  `serie` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `numero` int NOT NULL,
  `fecha_emision` datetime DEFAULT CURRENT_TIMESTAMP,
  `cliente_id` bigint DEFAULT NULL,
  `pedido_id` bigint DEFAULT NULL,
  `caja_id` bigint DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL,
  `igv` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  `estado` enum('emitido','pendiente','anulado') COLLATE utf8mb4_general_ci DEFAULT 'pendiente',
  `xml_hash` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cdr_respuesta` text COLLATE utf8mb4_general_ci,
  `ticket_sunat` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pdf_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `xml_url` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `caja_id` (`caja_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_comprobantes`
--

DROP TABLE IF EXISTS `detalle_comprobantes`;
CREATE TABLE IF NOT EXISTS `detalle_comprobantes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `comprobante_id` bigint DEFAULT NULL,
  `producto_id` bigint DEFAULT NULL,
  `cantidad` int DEFAULT NULL,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comprobante_id` (`comprobante_id`),
  KEY `producto_id` (`producto_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_pedidos`
--

DROP TABLE IF EXISTS `detalle_pedidos`;
CREATE TABLE IF NOT EXISTS `detalle_pedidos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint DEFAULT NULL,
  `producto_id` bigint DEFAULT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS ((`cantidad` * `precio_unitario`)) STORED,
  `tiempo_inicio_prep` datetime DEFAULT NULL,
  `tiempo_fin_prep` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `producto_id` (`producto_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesas`
--

DROP TABLE IF EXISTS `mesas`;
CREATE TABLE IF NOT EXISTS `mesas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sede_id` bigint DEFAULT NULL,
  `numero_mesa` int NOT NULL,
  `capacidad` int DEFAULT '4',
  `estado` enum('disponible','ocupada','reservada') COLLATE utf8mb4_general_ci DEFAULT 'disponible',
  PRIMARY KEY (`id`),
  KEY `sede_id` (`sede_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `modelo_ia`
--

DROP TABLE IF EXISTS `modelo_ia`;
CREATE TABLE IF NOT EXISTS `modelo_ia` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `tipo` enum('DEMANDA','RECOMENDACION','INVENTARIO','CHATBOT') COLLATE utf8mb4_general_ci NOT NULL,
  `version` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `fecha_entrenamiento` datetime DEFAULT CURRENT_TIMESTAMP,
  `precision_metrica` decimal(5,4) DEFAULT NULL,
  `ruta_artefacto` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('ACTIVO','INACTIVO','OBSOLETO') COLLATE utf8mb4_general_ci DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `mesa_id` bigint DEFAULT NULL,
  `usuario_id` bigint DEFAULT NULL,
  `cliente_id` bigint DEFAULT NULL,
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('pendiente','preparacion','entregado','cancelado','pagado') COLLATE utf8mb4_general_ci DEFAULT 'pendiente',
  `total` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `mesa_id` (`mesa_id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `cliente_id` (`cliente_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `predicciones_demanda`
--

DROP TABLE IF EXISTS `predicciones_demanda`;
CREATE TABLE IF NOT EXISTS `predicciones_demanda` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `modelo_id` bigint DEFAULT NULL,
  `fecha_prediccion` date NOT NULL,
  `hora_rango` enum('MANANA','MEDIODIA','TARDE','NOCHE','DIA_COMPLETO') COLLATE utf8mb4_general_ci NOT NULL,
  `producto_id` bigint DEFAULT NULL,
  `cantidad_predicha` int NOT NULL,
  `cantidad_real` int DEFAULT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_prediccion_unica` (`fecha_prediccion`,`hora_rango`,`producto_id`),
  KEY `modelo_id` (`modelo_id`),
  KEY `producto_id` (`producto_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

DROP TABLE IF EXISTS `productos`;
CREATE TABLE IF NOT EXISTS `productos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `categoria_id` bigint DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `precio` decimal(10,2) NOT NULL,
  `costo_produccion` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `estado` enum('activo','inactivo') COLLATE utf8mb4_general_ci DEFAULT 'activo',
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sedes`
--

DROP TABLE IF EXISTS `sedes`;
CREATE TABLE IF NOT EXISTS `sedes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` enum('activa','inactiva') COLLATE utf8mb4_general_ci DEFAULT 'activa',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `rol_id` bigint DEFAULT NULL,
  `sede_id` bigint DEFAULT NULL,
  `estado` enum('activo','inactivo') COLLATE utf8mb4_general_ci DEFAULT 'activo',
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `rol_id` (`rol_id`),
  KEY `sede_id` (`sede_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

DROP TABLE IF EXISTS `ventas`;
CREATE TABLE IF NOT EXISTS `ventas` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint DEFAULT NULL,
  `comprobante_id` bigint DEFAULT NULL,
  `caja_id` bigint DEFAULT NULL,
  `metodo_pago` enum('efectivo','tarjeta','yape','plin','transferencia') COLLATE utf8mb4_general_ci DEFAULT 'efectivo',
  `monto_pagado` decimal(10,2) DEFAULT NULL,
  `vuelto` decimal(10,2) DEFAULT '0.00',
  `fecha_pago` datetime DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `comprobante_id` (`comprobante_id`),
  KEY `caja_id` (`caja_id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- ============================================================
-- NUEVAS TABLAS Y MODIFICACIONES PARA INTEGRACIÓN DE IA (OCR FACTURAS)
-- ============================================================

-- TABLA: facturas_proveedores
CREATE TABLE IF NOT EXISTS facturas_proveedores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    proveedor VARCHAR(150) NOT NULL,
    numero_factura VARCHAR(50) NOT NULL,
    fecha_emision DATE,
    total DECIMAL(10,2),
    ruta_archivo VARCHAR(255),
    procesado_por_ia ENUM('SI','NO') DEFAULT 'NO',
    modelo_ia_id BIGINT DEFAULT NULL,
    fecha_procesamiento DATETIME DEFAULT NULL,
    estado ENUM('PENDIENTE','PROCESADO','ERROR') DEFAULT 'PENDIENTE',
    observaciones TEXT,
    KEY modelo_ia_id (modelo_ia_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- TABLA: detalle_facturas_proveedores
CREATE TABLE IF NOT EXISTS detalle_facturas_proveedores (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    factura_id BIGINT NOT NULL,
    producto_detectado VARCHAR(150),
    cantidad_detectada INT DEFAULT 0,
    precio_unitario DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) GENERATED ALWAYS AS (cantidad_detectada * precio_unitario) STORED,
    producto_id BIGINT DEFAULT NULL,
    confianza_ia DECIMAL(5,4) DEFAULT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    KEY factura_id (factura_id),
    KEY producto_id (producto_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- MODIFICACIÓN DE TABLA: productos (nuevos campos para integración IA)
ALTER TABLE productos
ADD COLUMN codigo_barra VARCHAR(50) NULL AFTER nombre,
ADD COLUMN origen_ia ENUM('MANUAL','IA') DEFAULT 'MANUAL' AFTER estado,
ADD COLUMN fecha_actualizacion DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- MODIFICACIÓN DE TABLA: modelo_ia (nueva categoría FACTURA_OCR)
ALTER TABLE modelo_ia
MODIFY COLUMN tipo ENUM('DEMANDA','RECOMENDACION','INVENTARIO','CHATBOT','FACTURA_OCR') NOT NULL;

-- ============================================================
-- FIN DE INTEGRACIÓN DE IA (OCR FACTURAS)
-- ============================================================

