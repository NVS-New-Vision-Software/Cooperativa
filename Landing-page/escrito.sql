DROP DATABASE IF EXISTS biblioteca;
CREATE DATABASE biblioteca;
USE biblioteca;

CREATE TABLE Autores (
    Id_Autor INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Nacionalidad VARCHAR(50)
);

CREATE TABLE Libros (
    Isbn VARCHAR(20) PRIMARY KEY,
    Titulo VARCHAR(150) NOT NULL,
    Id_Autor INT,
    Anio_Publicacion INT,
    Genero VARCHAR(50),
    FOREIGN KEY (Id_Autor) REFERENCES Autores(Id_Autor)
);

CREATE TABLE Prestamo (
    Id_Prestamo INT AUTO_INCREMENT PRIMARY KEY,
    Isbn VARCHAR(20),
    Fecha_Prestamo DATE,
    Fecha_Devolucion DATE,
    FOREIGN KEY (Isbn) REFERENCES Libros(Isbn) ON DELETE CASCADE
);

INSERT INTO Autores (Nombre, Nacionalidad) VALUES
('Gabriel García Márquez', 'Colombiana'),
('Stephen King', 'Estadounidense'),
('Mario Benedetti', 'Uruguaya');

INSERT INTO Libros (Isbn, Titulo, Id_Autor, Anio_Publicacion, Genero) VALUES
('ISBN001', 'Cien Años de Soledad', 1, 1967, 'Realismo Mágico'),
('ISBN002', 'It', 2, 1986, 'Terror'),
('ISBN003', 'La Tregua', 3, 1960, 'Novela');

INSERT INTO Prestamo (Isbn, Fecha_Prestamo, Fecha_Devolucion) VALUES
('ISBN001', '2024-02-10', NULL),         -- aún no devuelto
('ISBN002', '2023-12-15', '2023-12-30'), -- devuelto antes de 2024
('ISBN003', '2025-01-20', '2025-02-05'); -- préstamo en 2025

DELETE FROM Libros
WHERE Isbn IN (
    SELECT Isbn FROM Prestamo
    WHERE Fecha_Devolucion < '2024-01-01'
);

DELETE FROM Libros
WHERE Genero = 'Terror';

SELECT L.Titulo, P.Fecha_Prestamo
FROM Libros L
JOIN Prestamo P ON L.Isbn = P.Isbn
WHERE P.Fecha_Devolucion IS NULL;

SELECT Genero, COUNT(*) AS Cantidad
FROM Libros
GROUP BY Genero;

SELECT *
FROM Prestamo
WHERE YEAR(Fecha_Prestamo) = 2025;

CREATE VIEW VistaLibrosPrestados AS
SELECT 
    L.Titulo,
    A.Nombre AS Autor,
    P.Fecha_Prestamo,
    P.Fecha_Devolucion
FROM Libros L
JOIN Autores A ON L.Id_Autor = A.Id_Autor
JOIN Prestamo P ON L.Isbn = P.Isbn;
