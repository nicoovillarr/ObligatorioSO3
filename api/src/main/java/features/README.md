# Features

Esta carpeta contiene **cada módulo funcional del sistema**, implementado como una *feature* independiente.

Cada feature sigue la estructura propuesta de **Domain-Driven Design (DDD)** simplificado:
```
feature
├─ application     <- Servicios de la aplicación
├─ data            <- Implementaciones de servicios de datos
├─ domain          <- Entidades y lógica de negocio
├─ presentation    <- Controladores
└ Main.java        <- Punto de entrada para pruebas rápidas
```

## Principios de diseño

- Cada feature es **independiente** y solo depende de `libs/`.
- No hay dependencias cruzadas entre features.
- La comunicación entre features debe hacerse mediante interfaces públicas o eventos.