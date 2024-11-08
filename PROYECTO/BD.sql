drop database if exists Bitnessgym;
create database Bitnessgym;
use Bitnessgym;

-- Entidades

CREATE TABLE Usuario (
    ID_Usuario INT PRIMARY KEY AUTO_INCREMENT,
    Correo_usu VARCHAR(50)not null unique,
    Con_Usu VARCHAR(2000) not null
);

INSERT INTO Usuario (Correo_usu, Con_Usu)
VALUES 
     ("root@gmail.com","$2y$10$OPKMtS7oM0/0wZ8PWdVG9.6Oi0AdyUdWJum0GXUVTSCyj68W7yk/G"),
    ('juanperez', 'contraseña123'),
    ('maria_lopez', 'pass456')
   ;
    select*from Usuario;

CREATE TABLE Admin (
    ID_Usuario INT PRIMARY KEY,
    FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario)
);

SELECT ID_Usuario, Nombre, Apellidos FROM Cliente;


INSERT INTO Admin (ID_Usuario) VALUES (1);

CREATE TABLE Entrenador (
    ID_Usuario INT PRIMARY KEY,
    FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario)
);

-- Inserta un entrenador basado en el usuario creado (por ejemplo, el usuario con ID 2 es entrenador)
INSERT INTO Entrenador (ID_Usuario)
VALUES (2);

create table Cliente (
ID_Usuario int primary key,
Nombre varchar(50) not null,
Apellidos varchar(50) not null,
Cedula varchar(20) not null unique,
Edad int not null,
Peso float not null,
Altura float not null,
Centro_salud varchar(100) not null,
Fecha_registro timestamp default current_timestamp,
FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario));



create table Subscripcion (
ID_Subs varchar(255) primary key,
Inicio date,
Plan_Sub varchar(50),
Vencimiento date,
Estado varchar(20),
Tipo varchar(50),
Precio int
);

insert into Subscripcion (ID_Subs, Inicio, Plan_Sub, Vencimiento, Estado, Tipo, Precio)
values ('SUBS1', '2024-01-01', 'Anual', '2024-12-31', 'Activa', 'Básico', 5000),
('SUBS2', '2024-06-01', 'Mensual', '2025-05-31', 'Activa', 'Premium', 400);


create table Rutina (
ID_Rut varchar(255) primary key,
Tipo_Rut varchar(50),
Duracion int,
Objetivos varchar(100),
Instrucción varchar(100),
Frecuencia varchar(50)
);

insert into Rutina (ID_Rut, Tipo_Rut, Duracion, Objetivos, Instrucción, Frecuencia)
values ('RUT1', 'Fuerza', 60, 'Aumentar masa muscular', 'Ejercicios de levantamiento', '3 veces a la semana'),
('RUT2', 'Cardio', 45, 'Mejorar resistencia', 'Correr, nadar', '5 veces a la semana');

create table Entrenamiento (
ID_Ent varchar(255) primary key,
Tipo_Ent varchar(50),
Tiempo_Ent int,
Calor_Quem int,
registro_peso int,
registro_imc int

);

select*from Entrenamiento;

create table Producto (
ID_Pro varchar(255) primary key,
Precio varchar(40),
Cat_Pro varchar(50),
Nom_Pro varchar(50),
Desc_Pro varchar(100),
Rut_Img varchar(300),
Descripcion varchar(255)
);

insert into Producto (ID_Pro, Precio, Cat_Pro, Nom_Pro, Desc_Pro, Rut_Img, Descripcion)
values ("PROD1", "350", "Consumible", "Gatorade", "0%", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUz9iF4Z2LYIpL53Jixr75Hq0Msj9tuiI6iQ&s","Bebida energetica"),
("PROD2", "55", "Consumible", "Botella de agua","0%", "https://img.mundopmmi.com/files/base/pmmi/mundo/image/2020/01/botella_cristal_100_100.5e31c8c214c05.png?auto=format%2Ccompress&fit=max&q=70&w=1200","Botella de agua salus");


select * from producto;
create table Beneficios (
ID_Ben varchar(255) primary key,
Descripcion varchar(255)
);

insert into Beneficios (ID_Ben, Descripcion)
values ('BEN1', 'Acceso a piscna.'),
('BEN2', 'Descuentos en productos.');

create table Actividad (
ID_Actividad varchar(255) primary key,
Tipo_Act varchar(50),
Fecha_Hora datetime,
Duracion int
);

insert into Actividad (ID_Actividad, Tipo_Act, Fecha_Hora, Duracion)
values ('ACT1', 'Clase de yoga', '2024-10-01 08:00:00', 60),
('ACT2', 'Entrenamiento personal', '2024-10-02 10:00:00', 45);

create table Carrito (
ID_Carrito varchar(255) primary key,
Cant_Pro int,
Activo boolean,
Inactivo boolean
);

insert into Carrito (ID_Carrito, Cant_Pro, Activo, Inactivo)
values ('CART1', 3, true, false),
('CART2', 5, false, true);

create table Compra (
ID_Compra varchar(255) primary key,
Sub_Total int,
Cant_Pro int
);

insert into Compra (ID_Compra, Sub_Total, Cant_Pro)
values ('COMP1', 350, 2),
('COMP2', 55, 1);

create table Factura (
ID_Fact varchar(255) primary key,
IVA varchar(255),
Costo int,
Fecha_Hora datetime
);

insert into Factura (ID_Fact, IVA, Costo, Fecha_Hora)
values ("FACT1", "19%", "350", "2024-08-25 12:00:00"),
("FACT2", "19%", "55", "2024-08-25 13:00:00");

-- Relaciones

create table Realiza (
ID_Rut varchar(255),
ID_Usuario int,
primary key (ID_Rut),
foreign key (ID_Rut) references Rutina(ID_Rut),
foreign key (ID_Usuario) references Usuario(ID_Usuario)
);

insert into Realiza (ID_Rut, ID_Usuario)
values ('RUT1', 1),
('RUT2', 2);

CREATE TABLE Registra (
    ID_Ent VARCHAR(255),
    ID_Usuario INT,
    PRIMARY KEY (ID_Ent, ID_Usuario),
    FOREIGN KEY (ID_Ent) REFERENCES Entrenamiento(ID_Ent),
    FOREIGN KEY (ID_Usuario) REFERENCES Usuario(ID_Usuario)
);

create table Elige (
ID_Cliente int,
ID_Subs varchar(255),
primary key (ID_Cliente),
foreign key (ID_Cliente) references Cliente(ID_Usuario),
foreign key (ID_Subs) references Subscripcion(ID_Subs)
);


create table Agrega (
ID_Usuario int,
ID_Rut varchar(255),
primary key (ID_Rut),
foreign key (ID_Usuario) references Usuario(ID_Usuario),
foreign key (ID_Rut) references Rutina(ID_Rut)
);

insert into Agrega (ID_Usuario, ID_Rut)
values (1, 'RUT1'),
(2, 'RUT2');

create table Integra (
ID_Usuario int,
ID_Ben varchar(255),
primary key (ID_Usuario),
foreign key (ID_Usuario) references Usuario(ID_Usuario),
foreign key (ID_Ben) references Beneficios(ID_Ben)
);

insert into Integra (ID_Usuario, ID_Ben)
values (1, 'BEN1'),
(2, 'BEN2');

create table Incluye (
ID_Ben varchar(255),
ID_Pro varchar(255),
primary key (ID_Ben, ID_Pro),
foreign key (ID_Ben) references Beneficios(ID_Ben),
foreign key (ID_Pro) references Producto(ID_Pro)
);

insert into Incluye (ID_Ben, ID_Pro)
values ('BEN1', 'PROD1'),
('BEN2', 'PROD2');

create table Añade (
ID_Usuario int,
ID_Pro varchar(255),
primary key (ID_Pro),
foreign key (ID_Usuario) references Usuario(ID_Usuario),
foreign key (ID_Pro) references Producto(ID_Pro)
);

insert into Añade (ID_Usuario, ID_Pro)
values (1, 'PROD1'),
(2, 'PROD2');

create table Selecciona (
ID_Usuario int,
ID_Pro varchar(255),
primary key (ID_Pro),
foreign key (ID_Usuario) references Usuario(ID_Usuario),
foreign key (ID_Pro) references Producto(ID_Pro)
);

insert into Selecciona (ID_Usuario, ID_Pro)
values (1, 'PROD1'),
(2, 'PROD2');

create table Ofrece (
ID_Ben varchar(255),
ID_Subs varchar(255),
primary key (ID_Ben),
foreign key (ID_Ben) references Beneficios(ID_Ben),
foreign key (ID_Subs) references Subscripcion(ID_Subs)
);

insert into Ofrece (ID_Ben, ID_Subs)
values ('BEN1', 'SUBS1'),
('BEN2', 'SUBS2');

create table S_Guarda (
ID_Subs varchar(255),
ID_Carrito varchar(255),
primary key (ID_Subs),
foreign key (ID_Subs) references Subscripcion(ID_Subs),
foreign key (ID_Carrito) references Carrito(ID_Carrito)
);

insert into S_Guarda (ID_Subs, ID_Carrito)
values ('SUBS1', 'CART1'),
('SUBS2', 'CART2');

create table Guarda (
ID_Pro varchar(255),
ID_Carrito varchar(255),
primary key (ID_Pro),
foreign key (ID_Pro) references Producto(ID_Pro),
foreign key (ID_Carrito) references Carrito(ID_Carrito)
);

insert into Guarda (ID_Pro, ID_Carrito)
values ('PROD1', 'CART1'),
('PROD2', 'CART2');

create table Posee (
ID_Actividad varchar(255),
ID_Ben varchar(255),
primary key (ID_Actividad),
foreign key (ID_Actividad) references Actividad(ID_Actividad),
foreign key (ID_Ben) references Beneficios(ID_Ben)
);

insert into Posee (ID_Actividad, ID_Ben)
values ('ACT1', 'BEN1'),
('ACT2', 'BEN2');

create table C_Genera (
ID_Carrito varchar(255),
ID_Compra varchar(255),
primary key (ID_Carrito),
foreign key (ID_Carrito) references Carrito(ID_Carrito),
foreign key (ID_Compra) references Compra(ID_Compra)
);

insert into C_Genera (ID_Carrito, ID_Compra)
values ('CART1', 'COMP1'),
('CART2', 'COMP2');

create table F_Crea (
ID_Compra varchar(255),
ID_Fact varchar(255),
primary key (ID_Compra),
foreign key (ID_Compra) references Compra(ID_Compra),
foreign key (ID_Fact) references Factura(ID_Fact)
);

insert into F_Crea (ID_Compra, ID_Fact)
values ('COMP1', 'FACT1'),
('COMP2', 'FACT2');

-- Consultas

-- Clientes
select * from Usuario;

-- Clientes y sus Subscripciones
SELECT 
    c.Nombre, c.Apellidos, s.Plan_Sub
FROM
    Cliente c
        JOIN
    Elige e ON c.ID_Usuario = e.ID_Cliente
        JOIN
    Subscripcion s ON e.ID_Subs = s.ID_Subs;
    
    
SELECT c.ID_Usuario, c.Nombre, c.Apellidos,u.Correo_usu FROM Cliente c JOIN Usuario u ON c.ID_Usuario = u.ID_Usuario;
    
    
    
    