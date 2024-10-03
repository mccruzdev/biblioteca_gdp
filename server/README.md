# API Biblioteca Virtual

Esta es una API RESTful construida con NestJS para gestionar una biblioteca virtual. Permite a los usuarios administrar libros, categorías, reservas y usuarios, proporcionando los endpoints necesarios para las operaciones CRUD y la gestión de roles de usuario.

## Tabla de Contenidos

- [API Biblioteca Virtual](#api-biblioteca-virtual)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características](#características)
  - [Instalación](#instalación)
    - [Requisitos Previos](#requisitos-previos)
    - [Clonar el Repositorio](#clonar-el-repositorio)
    - [Instalación de Dependencias](#instalación-de-dependencias)
    - [Configuración de las variables de entorno](#configuración-de-las-variables-de-entorno)
    - [Crea las migraciones a la Base de Datos](#crea-las-migraciones-a-la-base-de-datos)
  - [Ejecución de la Aplicación](#ejecución-de-la-aplicación)
  - [Tecnologías Usadas](#tecnologías-usadas)

## Características

- **Gestión de Usuarios**: Permite la creación, actualización y eliminación de usuarios, con control de acceso basado en roles (Administrador, Bibliotecario, Lector).
- **Gestión de Libros**: Habilita la adición, actualización y eliminación de libros, junto con la ubicación física de los mismos.
- **Categorías**: Clasifica los libros en diferentes categorías y subcategorías.
- **Reservas**: Los lectores pueden reservar libros disponibles, y el sistema mantiene el control de los plazos de recogida.
- **Donaciones**: Registra las donaciones hechas a la biblioteca, ya sean de fuentes externas o internas.

## Instalación

### Requisitos Previos

Antes de comenzar, asegúrate de tener instalados los siguientes programas en tu sistema:

- [Node.js](https://nodejs.org/en/) (versión 14 o superior)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)
- [MySQL](https://www.mysql.com/)

### Clonar el Repositorio

Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/mccruzdev/biblioteca_gdp.git
cd biblioteca_gdp
cd server
```

### Instalación de Dependencias

Instala las dependencias necesarias usando npm:

```bash
npm install
```

### Configuración de las variables de entorno

Crea las siguientes variables de entorno en un archivo `.env`:

```
// Ejemplo aqui: https://www.prisma.io/docs/orm/overview/databases/mysql#connection-url
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"

SECRET_KEY=<you-secret-key>

// Generate your token: https://apis.net.pe/
APIS_NET_PE_KEY=<your_api_token>

// Backend Server
BACKEND_SERVER=http://localhost:8000

// Clientes
READER_SERVER=http://localhost:5173
LIBRARIAN_SERVER=http://localhost:5174
ADMIN_SERVER=http://localhost:5175

// Correos
EMAIL_HOST=smtp.gmail.com
EMAIL_AUTH_USER=<your-email>
EMAIL_AUTH_PASSWORD=<your-app-password>
```

### Crea las migraciones a la Base de Datos

Ejecuta el siguiente comando para crear las migraciones:

```bash
npx prisma migrate dev --name Initial
```

## Ejecución de la Aplicación

Para ejecutar la aplicación en modo de desarrollo, utiliza el siguiente comando:

```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:8000/docs`.

<!-- ## Endpoints de la API

### Usuarios

- `GET /users`: Lista todos los usuarios.
- `POST /users`: Crea un nuevo usuario.
- `GET /users/:id`: Obtiene un usuario por su ID.
- `PUT /users/:id`: Actualiza los datos de un usuario.
- `DELETE /users/:id`: Elimina un usuario.

### Libros

- `GET /books`: Lista todos los libros.
- `POST /books`: Añade un nuevo libro.
- `GET /books/:id`: Obtiene un libro por su ID.
- `PUT /books/:id`: Actualiza la información de un libro.
- `DELETE /books/:id`: Elimina un libro.

### Categorías

- `GET /categories`: Lista todas las categorías.
- `POST /categories`: Añade una nueva categoría.
- `PUT /categories/:id`: Actualiza una categoría.
- `DELETE /categories/:id`: Elimina una categoría.

### Reservas

- `POST /reservations`: Reserva un libro.
- `GET /reservations/:id`: Obtiene los detalles de una reserva.
- `PUT /reservations/:id`: Actualiza el estado de una reserva.
- `DELETE /reservations/:id`: Cancela una reserva. -->

## Tecnologías Usadas

- **NestJS**: Framework para Node.js basado en TypeScript.
- **TypeScript**: Lenguaje de programación usado para el desarrollo.
- **Prisma**: ORM para la gestión de la base de datos.
- **MySQL**: Base de datos relacional utilizada para almacenar datos.
- **JWT**: Para autenticación basada en tokens.
