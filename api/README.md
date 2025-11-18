# Obligatorio SO3 — Backend API

Este proyecto es una API construida en **Java 17 con Spring Boot 3**, que implementa diferentes **features independientes** organizadas bajo una arquitectura modular.

## Tecnologías principales

- Java 17
- Spring Boot 3
- Maven
- WebSockets

## Estructura

- **features/** → cada módulo funcional del sistema (por ejemplo: *filósofos*, *productorconsumidor*, etc.)
- **libs/** → librerías internas reutilizables (utilidades, WebSockets, etc.)
- **Main.java** → punto de entrada de la aplicación
- **pom.xml** → configuración de dependencias y plugins de Maven

## Cómo ejecutar el proyecto

1. Clonar el repositorio
2. Instalar dependencias:
```
mvn clean install
```
3. Levantar la aplicación:
```
mvn spring-boot:run
```
4. La API estará disponible en `http://localhost:8080`

## Probar endpoints

Podemos usar Postman o VS Code REST Client para probar los endpoints.

## Arquitectura

El proyecto sigue una arquitectura hexagonal, donde cada feature define su propio dominio y casos de uso. Las dependencias hacia el exterior se gestionan a través de inyección de dependencias de Spring.