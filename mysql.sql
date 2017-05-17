CREATE DATABASE django_comleave CHARACTER SET utf8;
CREATE USER 'test'@'localhost' IDENTIFIED BY 'test';
GRANT ALL PRIVILEGES ON django_comleave.* TO 'test'@'localhost';
