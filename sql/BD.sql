-- Tabla: Socio (datos personales base)
CREATE TABLE Socio (
  Id_Socio INT AUTO_INCREMENT PRIMARY KEY,
  Nombre VARCHAR(50),
  Apellido VARCHAR(50),
  Nom_Comp VARCHAR(100),
  Fecha_ingr DATE,
  Fecha_reg DATE,
  Cedula VARCHAR(15) UNIQUE,
  Telefono VARCHAR(20),
  Correo VARCHAR(100) UNIQUE
);

CREATE TABLE Direccion (
  Id_Direccion INT AUTO_INCREMENT PRIMARY KEY,
  Calle VARCHAR(100),
  NroPuerta VARCHAR(10),
  Id_Socio INT UNIQUE,
  FOREIGN KEY (Id_Socio) REFERENCES Socio(Id_Socio)
);


-- Tabla: Usuario (credenciales + rol, vinculado al socio)
CREATE TABLE Usuario (
  Id_Usuario INT AUTO_INCREMENT PRIMARY KEY,
  Nom_Usuario VARCHAR(50) UNIQUE,
  Contraseña VARCHAR(255),
  Rol ENUM('socio', 'admin') NOT NULL,
  Id_Socio INT UNIQUE,
  FOREIGN KEY (Id_Socio) REFERENCES Socio(Id_Socio)
);

-- Tabla: Vivienda (una vivienda asignada a un socio)
CREATE TABLE Vivienda (
  Id_Vivienda INT AUTO_INCREMENT PRIMARY KEY,
  Estado_Viv VARCHAR(50),
  Nro_Vivienda VARCHAR(20),
  Id_Socio INT,
  FOREIGN KEY (Id_Socio) REFERENCES Socio(Id_Socio)
);

-- Tabla: Solicitud (realizada por un socio)
CREATE TABLE Solicitud (
  Id_Solicitud INT AUTO_INCREMENT PRIMARY KEY,
  Tipo_Soli VARCHAR(50),
  Exoneracion BOOLEAN,
  Fecha_Soli DATE,
  Descripcion TEXT,
  Estado_Soli VARCHAR(50),
  Id_Socio INT,
  FOREIGN KEY (Id_Socio) REFERENCES Socio(Id_Socio)
);

-- Tabla: Pago (efectuado por un socio)
CREATE TABLE Pago (
  Id_Pago INT AUTO_INCREMENT PRIMARY KEY,
  Fecha_Pago DATE,
  Tipo_Pago VARCHAR(50),
  Comprobante VARCHAR(100),
  Monto DECIMAL(10,2),
  Estado_Comprob VARCHAR(50),
  Id_Socio INT,
  FOREIGN KEY (Id_Socio) REFERENCES Socio(Id_Socio)
);

-- Tabla: Horas_Trabajo (horas registradas por un socio)
CREATE TABLE Horas_Trabajo (
  Id_Horas INT AUTO_INCREMENT PRIMARY KEY,
  Fecha_Sem DATE,
  Horas_regist INT,
  Id_Socio INT,
  FOREIGN KEY (Id_Socio) REFERENCES Socio(Id_Socio)
);

-- Tabla: Mantenimiento (problemas reportados por vivienda)
CREATE TABLE Mantenimiento (
  Id_Prob INT AUTO_INCREMENT PRIMARY KEY,
  Desc_Prob TEXT,
  Estado_Prob VARCHAR(50),
  Fecha_Report DATE,
  Id_Vivienda INT,
  FOREIGN KEY (Id_Vivienda) REFERENCES Vivienda(Id_Vivienda)
);
