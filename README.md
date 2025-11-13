# 🛍️ Censudex Products Service

Microservicio encargado de la **gestión de productos** para el sistema Censudex.
Permite crear, visualizar, editar y eliminar productos, además de subir imágenes mediante **Cloudinary**.

Este servicio se comunica internamente mediante **gRPC**, y externamente mediante **HTTP (REST Adapter)**.
Se integra en la **API Gateway (Ocelot)**, donde se maneja toda la **autenticación y autorización**.

---

## 📌 Características principales

* Crear producto (`POST /products`)
* Listar todos los productos (`GET /products`)
* Buscar producto por ID (`GET /products/:id`)
* Editar producto (`PATCH /products/:id`)
* Eliminar producto (`DELETE /products/:id`)
* Subida de imágenes con **Cloudinary**
* Endpoints equivalentes gRPC expuestos mediante `/grpc/...`
* Seeder inicial de productos (`npm run seed`)
* Dockerización lista para desarrollo y despliegue

---

## ⚙️ Tecnologías utilizadas

* [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) como base de datos NoSQL
* [Cloudinary](https://cloudinary.com/) para el almacenamiento de imágenes
* [gRPC](https://grpc.io/) para la comunicación eficiente con otros microservicios
* [Docker](https://www.docker.com/) + Docker Compose

---

## 🚀 Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/danukaz/censudex-products-service.git
cd censudex-products-service
```

---

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz con el siguiente contenido:

```env
PORT=3001
GRPC_PORT=50051
MONGO_URI=mongodb://mongo:27017/censudex_products

# Credenciales de Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

> Se recomienda utilizar la plantilla incluida en el archivo `.env.example` para este paso, debe rellenar sus credenciales de [Cloudinary](https://cloudinary.com/).

---

### 3. Construir y levantar contenedores

```bash
docker compose up -d --build
```

Esto levantará:

* `mongo` → Base de datos MongoDB
* `products` → Microservicio de productos

Para revisar los logs en tiempo real:

```bash
docker compose logs -f products
```

Cuando el servicio esté listo, deberías ver:

```
✅ Conectado a MongoDB
🌐 Servidor HTTP escuchando en http://localhost:3001
💬 Servidor gRPC escuchando en puerto 50051
```

---

### 4. Poblar la base de datos (Seeder)

Puedes insertar algunos productos de ejemplo ejecutando:

```bash
docker compose exec products npm run seed
```

Esto insertará productos iniciales en MongoDB si aún no existen.

---

## 📡 Endpoints principales

### 🔹 HTTP (REST)

#### Obtener todos los productos

```http
GET /products
```

#### Crear un nuevo producto

```http
POST /products
Content-Type: multipart/form-data

Campos:
- name (string)
- description (string)
- price (number)
- category (string)
- image (archivo opcional)
```

#### Obtener producto por ID

```http
GET /products/:id
```

#### Editar producto

```http
PATCH /products/:id
```

#### Eliminar producto (soft delete)

```http
DELETE /products/:id
```

---

### 🔹 gRPC (REST Adapter)

Estos endpoints exponen internamente la comunicación gRPC a través de HTTP, principalmente para consumo entre microservicios.

#### Obtener productos (gRPC)

```http
GET /grpc/products
```

---


## 🐳 Estructura de Docker

El proyecto utiliza Docker Compose con dos contenedores principales:

| Servicio   | Puerto                    | Descripción                |
| ---------- | ------------------------- | -------------------------- |
| `mongo`    | 27017                     | Base de datos MongoDB      |
| `products` | 3001 (HTTP), 50051 (gRPC) | Microservicio de productos |

> Solo el puerto HTTP se expone externamente.
> El puerto gRPC se usa internamente entre microservicios.

---

## 📖 Mini manual de uso

1. Clonar el repositorio y configurar `.env`
2. Ejecutar `docker compose up -d`
3. (Opcional) Ejecutar el seeder con `npm run seed`
4. Probar los endpoints con Postman:

   * `GET http://localhost:3001/products`
   * `POST http://localhost:3001/products`
   * `GET http://localhost:3001/grpc/products`
5. Conectar este servicio a la API Gateway (Ocelot)

---

## 🧰 Scripts disponibles

| Comando                | Descripción                             |
| ---------------------- | --------------------------------------- |
| `npm run dev`          | Ejecutar localmente con nodemon         |
| `npm run seed`         | Insertar productos iniciales en MongoDB |
| `docker compose up -d` | Levantar los contenedores               |
| `docker compose down`  | Detener los contenedores                |

---

## ☁️ Despliegue en la nube

Este microservicio puede desplegarse fácilmente en **Render**, **Railway**, o cualquier otro proveedor compatible con Docker.
Solo requiere configurar las variables de entorno y vincular una instancia de MongoDB (local o en la nube).

> Cloudinary no requiere configuración adicional, solo definir las claves en las variables de entorno.

---

## 👨‍💻 Autor

* Daniel Alexis Tomigo Contreras - 21.564.036-1
