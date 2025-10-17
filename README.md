# KAIRO: Diario de Estado de Ánimo

**Kairo** es una aplicación web desarrollada con **React + Vite** que permite a los usuarios registrar, visualizar y analizar su estado de ánimo diario.  
El objetivo es fomentar el bienestar emocional y brindar información visual sobre la evolución de las emociones a lo largo del tiempo.

## INTEGRANTES

- Jacobo Urrea
- Juan Torres
- Maria Gomez
- Mariana Rodriguez
	Instalación y Configuración
Pasos:
1. Clonar el Repositorio: 
git clone https://github.com/mari12rod/kairo-project
cd Kairo

2. Instalar Dependencias:
cd backend
npm install
cd ../frontend
npm install

3. Configurar la Base de Datos
Instalar MySQL y crear una base de datos	
 Tabla de usuarios CREATE TABLE users ( id INT AUTO_INCREMENT 	P	RIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(100) 		UNIQUE NOT NULL, password VARCHAR(255) NOT NULL );
Tabla de emociones, vinculada a los usuarios CREATE TABLE emociones ( id INT 	AUTO_INCREMENT PRIMARY KEY, usuario_id INT, fecha DATE, emocion 		VARCHAR(50), intensidad INT, comentario TEXT, FOREIGN KEY (usuario_id) 	-REFERENCES users(id) ); SHOW TABLES;

4. Configurar las variables de entorno
Realizar un archivo .env
DB_HOST=localhost
DB_USER=mariana
DB_PASSWORD=@Colombia2025@
DB_NAME=kairo_db
PORT=3000
JWT_SECRET=batman123


5. Ejecutar el Proyecto 
- Backend:
cd Ruta/al/archivo/kairo-backend

Npm start
Npm run dev
- Frontend:
cd Ruta/al/archivo/kairo-backend
Npm start

