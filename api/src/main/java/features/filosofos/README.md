# Problema de los Filósofos Comensales en Java

## Descripción general

El **problema de los filósofos comensales** es un clásico de la concurrencia, diseñado para ilustrar los desafíos de **sincronización y acceso a recursos compartidos**.

Cinco filósofos se sientan alrededor de una mesa. Cada uno alterna entre **pensar** y **comer**, pero para comer necesita **dos tenedores**: el de su izquierda y el de su derecha.  
El problema surge cuando todos intentan comer al mismo tiempo: si cada uno toma su tenedor izquierdo, **ninguno podrá obtener el derecho**, y el sistema queda bloqueado (_deadlock_).

## Solución implementada

La solución está desarrollada en **Java** utilizando **hilos y semáforos** para manejar la sincronización.  
Cada filósofo es un hilo independiente, y cada tenedor se modela como un **semáforo de un solo permiso**.

El flujo básico de cada filósofo es:

1. **Pensar** durante un tiempo aleatorio.
2. Intentar **tomar los dos tenedores** (izquierdo y derecho).
3. **Comer** durante un intervalo breve.
4. **Liberar los tenedores** y volver a pensar.

## Conceptos aplicados

- **Semáforos** para representar los tenedores.
- **Hilos** para modelar a los filósofos concurrentes.
- **Prevención de deadlock** mediante asimetría en el orden de adquisición.
- **Separación de capas (DDD)** para mantener el código modular y claro.

## Prevención de deadlock

Para evitar el bloqueo circular, se aplica una regla sencilla:

- Todos los filósofos excepto el último toman **primero su tenedor izquierdo** y luego el derecho.
- El **último filósofo invierte el orden** (primero derecho, luego izquierdo).

Este pequeño cambio rompe la simetría del sistema y **garantiza que al menos un filósofo siempre pueda avanzar**, evitando el deadlock.

## Diseño del proyecto (enfoque DDD)

La organización del código sigue una estructura inspirada en **Domain-Driven Design (DDD)**, que separa responsabilidades y facilita la escalabilidad:

```
features
├─ filosofos
│  ├─ application
│  │  └─ FilosofosService.java
│  ├─ data
│  │  ├─ entities
│  │  │  ├─ EstadoFilosofo.java
│  │  │  └─ StartRequest.java
│  │  └─ services
│  │     └─ MesaService.java
│  ├─ domain
│  │  ├─ dtos
│  │  │  └─ EstadoFilosofoDto.java
│  │  ├─ models
│  │  │  └─ Filosofo.java
│  │  └─ services
│  │     └─ IMesaService.java
│  └─ presentation
│     └─ FilosofosController.java
└ Main.java
```

## Capas principales

- **application**: Contiene la lógica de negocio y orquesta las interacciones entre las capas.
- **data**: Maneja la persistencia y acceso a datos, incluyendo entidades y servicios relacionados.
- **domain**: Define los modelos de dominio, DTOs y servicios de negocio.
- **presentation**: Expone la funcionalidad a través de controladores, gestionando las solicitudes y respuestas.

## Ejecución

Al ejecutar el programa, cada filósofo alterna entre pensar y comer, mostrando en consola su estado actual.

De esta forma se puede observar el comportamiento concurrente y cómo el sistema evita bloqueos.
