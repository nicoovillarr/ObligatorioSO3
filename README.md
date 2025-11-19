# Sistemas Operativos 3 - Trabajo Obligatorio

## Integrantes

- Alejandro Barrán
- Nicolás Villar

## Instrucciones de ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/nicoovillarr/ObligatorioSO3
   cd ObligatorioSO3
   ```

2. Compilar el proyecto:

   ```bash
   npm run build
   # o pnpm build / yarn build
   ```

3. Ejecutar el programa:

   ```bash
   npm run dev
   # o pnpm dev / yarn dev
   ```

## Descripción del proyecto

Se implementan soluciones para dos problemas clásicos de sincronización:
**Filósofos Comensales** y **Productor–Consumidor**, usando **Java** y mecanismos
de concurrencia como semáforos y exclusión mutua.

El backend en **Spring Boot** maneja la lógica de sincronización y expone endpoints
REST/WebSocket para controlar y visualizar los estados.
El frontend en **React** permite iniciar procesos, modificar parámetros y ver
grácicamente filósofos y buffer en tiempo real.

El objetivo es demostrar cómo funcionan la mutua exclusión, las condiciones de
carrera y la coordinación de múltiples hilos.

## Tecnologías utilizadas

### Backend

- Java 17, Spring Boot, Spring WebSocket
- Semáforos y colas seguras (`java.util.concurrent`)
- Arquitectura: **DDD + Feature-Based**, separando dominio, aplicación e infraestructura

### Frontend

- React 18, TypeScript, React Router
- Recepción de actualizaciones en tiempo real con WebSockets

### Herramientas

- Maven, NPM/Node.js, Concurrently, Git

## Decisiones de diseño

- Uso de **Java** y semáforos para mostrar explícitamente la sincronización de hilos.
- **Separación de responsabilidades**: lógica de concurrencia aislada de la interfaz.
- **Arquitectura modular** (DDD + Features) para mantener el código organizado y escalable.
- **WebSockets** para actualizar la interfaz en tiempo real y permitir visualización de estados.
- **Frontend desacoplado**, centrado en la visualización y control de los procesos.
- **Delays controlados y estados explícitos** para facilitar la observación del comportamiento concurrente.
