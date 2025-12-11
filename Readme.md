### Guía de Pruebas - Módulo OCR

Configuración del Entorno (.env)

Para que la librería de Google Vision funcione, debes definir la variable GOOGLE_APPLICATION_CREDENTIALS en tu archivo .env.

Coloca el archivo descargado (ej. google-vision-key.json) en la raíz de tu proyecto.

Abre tu archivo .env y agrega la siguiente línea:

GOOGLE_APPLICATION_CREDENTIALS="./google-vision-key.json"



NOTA: Asegúrate de que tu aplicación cargue las variables de entorno al iniciar (usualmente con require('dotenv').config() en tu archivo principal app.ts o server.ts).

Seguridad (.gitignore)

CRÍTICO: Nunca subas tus credenciales a GitHub/GitLab. Asegúrate de que tu archivo .gitignore incluya estas líneas:

.env
*.json
!package.json
!tsconfig.json
# O explícitamente:
google-vision-key.json



Endpoints

1. Subir Factura

POST /ocr/upload

Body (form-data): factura (File)

Descripción: Sube el archivo al servidor y crea el registro en BD.

2. Procesar Factura

POST /ocr/process

Body (JSON): { "id": <number> }

Descripción: Envía la imagen a Google Vision API, extrae datos y actualiza la BD.

3. Ver Resultado

GET /ocr/result/:id

Descripción: Obtiene la factura procesada y sus items detectados.

Anexo 1: Configuración de Google Cloud

Para que el sistema funcione, necesitas obtener el archivo JSON de credenciales. Sigue estos pasos:

1. Crear Cuenta y Proyecto

Ve a la Consola de Google Cloud.

Inicia sesión con tu cuenta de Google.

Si es tu primera vez, activa la cuenta (te pedirán tarjeta de crédito para validar, pero no te cobran si no superas la capa gratuita).

Crea un Nuevo Proyecto (nómbralo RestauranteOCR o similar).

2. Habilitar la API

En el menú lateral, ve a APIs y servicios > Biblioteca.

Busca "Cloud Vision API".

Selecciona el resultado y haz clic en Habilitar.

3. Crear Cuenta de Servicio (Service Account)

Ve a APIs y servicios > Credenciales.

Haz clic en + CREAR CREDENCIALES > Cuenta de servicio.

Ponle un nombre (ej. backend-ocr-user) y dale a "Crear y continuar".

En "Rol", selecciona Proyecto > Propietario (o específicamente Cloud Vision API User para más seguridad).

Dale a "Listo".

4. Descargar el JSON (GOOGLE_APPLICATION_CREDENTIALS)

En la lista de Cuentas de servicio, haz clic en el lápiz (editar) o en el email de la cuenta que acabas de crear.

Ve a la pestaña Claves (Keys).

Haz clic en Agregar clave > Crear clave nueva.

Selecciona JSON y dale a "Crear".

Se descargará un archivo automáticamente. Este es tu archivo de credenciales.

Renómbralo (ej. google-vision-key.json) y colócalo en la raíz de tu proyecto.

Costos y Capa Gratuita

Gratis: Las primeras 1,000 unidades/imágenes al mes son gratuitas.

Pago: A partir de la unidad 1,001, se cobra según la tabla de precios de Vision API (aprox. $1.50 USD por cada 1,000 imágenes adicionales).

Anexo 2: Plantilla de Factura de Prueba (Mock)

Para que el OCR detecte los datos correctamente con la lógica Regex actual implementada en el servicio, crea un documento (Word o Bloc de notas), tómale una captura de pantalla (PNG/JPG) o guárdalo como PDF.

Formato requerido por tu código:

RUC: Debe decir "RUC" seguido de 11 dígitos.

Fecha: Debe tener formato DD/MM/YYYY o DD-MM-YYYY.

Items: Líneas de texto que terminen en un precio con decimales (ej. 10.00).

Total: Debe decir "TOTAL" seguido del monto.

Ejemplo para Copiar y Pegar:

RESTAURANTE EL BUEN SABOR S.A.C.
Av. Principal 123, Lima

RUC: 20123456789
Fecha: 25/10/2025

DESCRIPCION             PRECIO
------------------------------
Pollo a la Brasa        55.00
Inka Cola 1.5L           8.50
Porcion de Papas        12.00

------------------------------
TOTAL                   75.50
