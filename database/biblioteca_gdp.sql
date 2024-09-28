CREATE DATABASE biblioteca_gdp;
USE biblioteca_gdp;

-- Tabla USUARIOS con los nuevos campos "dni" y "email"
CREATE TABLE USUARIOS (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    dni VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    rol ENUM('administrador', 'bibliotecario', 'lector') NOT NULL,
    user VARCHAR(50) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL
);

-- Tabla UBICACION para gestionar la ubicación física de los libros
CREATE TABLE UBICACION (
    id_ubicacion INT AUTO_INCREMENT PRIMARY KEY,
    vitrina VARCHAR(255) NOT NULL,
    color_vitrina VARCHAR(50),
    nivel_vitrina INT
);

-- Tabla CONDICION_LIBRO para gestionar el estado físico del libro
CREATE TABLE CONDICION_LIBRO (
    id_condicion INT AUTO_INCREMENT PRIMARY KEY,
    condicion ENUM('buen estado', 'mal estado') NOT NULL,
    baja_libro ENUM('sí', 'no') NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario)
);

-- Tabla CATEGORIA_LIBRO con la nueva columna "subcategoría"
CREATE TABLE CATEGORIA_LIBRO (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    categoria VARCHAR(255) NOT NULL,
    subcategoria VARCHAR(255)
);

-- Tabla LIBROS
CREATE TABLE LIBROS (
    id_libro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255),
    editorial VARCHAR(255),
    paginas INT,
    codigo VARCHAR(50),
    stock INT,
    estado ENUM('disponible', 'reservado') NOT NULL,
    id_ubicacion INT,
    id_condicion INT,
    id_categoria INT,
    id_usuario INT, -- Bibliotecario que modificó/agregó el libro
    FOREIGN KEY (id_ubicacion) REFERENCES UBICACION(id_ubicacion),
    FOREIGN KEY (id_condicion) REFERENCES CONDICION_LIBRO(id_condicion),
    FOREIGN KEY (id_categoria) REFERENCES CATEGORIA_LIBRO(id_categoria),
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario)
);

-- Tabla DONACIONES 
CREATE TABLE DONACIONES (
    id_donacion INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME NOT NULL,
    entidad_donacion VARCHAR(255) NOT NULL,
    id_libro INT,
    id_usuario INT, -- Bibliotecario que registró la donación
    donacion_hacia_biblioteca ENUM('sí', 'no') NOT NULL,
    FOREIGN KEY (id_libro) REFERENCES LIBROS(id_libro),
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario)
);

-- Tabla RESERVAS 
CREATE TABLE RESERVAS (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    fecha_reserva DATETIME NOT NULL, -- Fecha y hora de la reserva
    hora_limite_recogida TIME,
    estado_reserva ENUM('pendiente', 'recogido', 'cancelado') NOT NULL,
    id_libro INT,
    fecha_prestamo DATETIME,
    fecha_devolucion DATETIME,
    id_usuario INT, -- Bibliotecario que gestionó la reserva
    FOREIGN KEY (id_libro) REFERENCES LIBROS(id_libro),
    FOREIGN KEY (id_usuario) REFERENCES USUARIOS(id_usuario)
);


