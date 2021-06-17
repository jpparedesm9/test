# APIS

En el presente apartado se exponen las apis desarrolladas para el proyecto Virtus.

---

## Introducción

Todos los endpoints utilizados en el proyecto responden al formato REST.
Se respeta el uso de métodos `GET`, `POST`, `PUT`, `DETELE` de acuerdo a la funcionalidad.

## Mapeo de registros desde Wix

### Extracción de Productos

Extracción de datos de la tabla de productos de Wix.  

```yaml
url: https://delyclar.com/_functions-dev/storesMapping/
respuesta: Arreglo de productos.
clave principal: _id
```
