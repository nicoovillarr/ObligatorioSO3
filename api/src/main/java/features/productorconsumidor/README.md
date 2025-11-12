# Problema del Productor-Consumidor en Java

## Descripción general

El **problema del Productor-Consumidor** es un clásico de la concurrencia que ilustra la necesidad de coordinar múltiples hilos que comparten un recurso común: un **buffer**.

- **Productores**: generan ítems y los colocan en el buffer.
- **Consumidores**: retiran ítems del buffer para procesarlos.
  
El desafío surge cuando ambos intentan acceder al buffer simultáneamente:
- Si el buffer está lleno, los productores deben esperar.
- Si el buffer está vacío, los consumidores deben esperar.
- Todo acceso debe hacerse de forma segura, evitando condiciones de carrera.

## Solución implementada

Este proyecto implementa el problema del **Productor-Consumidor** en Java utilizando **semáforos** para controlar el acceso concurrente al buffer compartido.

### Conceptos aplicados

- **Semáforo `empty`**: controla los espacios disponibles en el buffer.  
- **Semáforo `full`**: controla la cantidad de ítems listos para consumir.  
- **Semáforo `mutex`**: garantiza exclusión mutua al modificar el buffer.  

Cada productor o consumidor adquiere los permisos necesarios antes de interactuar con el buffer y los libera al terminar, asegurando un flujo ordenado y sin interferencias.

## Diseño del proyecto (enfoque DDD)

El código sigue una estructura inspirada en **Domain-Driven Design (DDD)** para mejorar la mantenibilidad y escalabilidad:

```
features
├─ productorconsumidor
│  ├─ application
│  │  └─ ProductorConsumidorService.java
│  ├─ data
│  │  └─ entities
│  │     └─ StartRequest.java
│  │  └─ services
│  │     └─ BufferService.java
│  └─ domain
│     ├─ models
│     │  ├─ Consumidor.java
│     │  └─ Productor.java
│     └─ services
│        └─ IBufferService.java
└ Main.java
```

### Capas principales

- **application/** → Servicio que orquesta la creación, ejecución y detención de hilos.
- **data/** → Implementación concreta del buffer en memoria, controlado con semáforos.
- **domain/** → Contiene las entidades principales (`Productor`, `Consumidor`, `BufferService`).