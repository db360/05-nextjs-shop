## Next.js Da.B NEXT SHOP

Para iniciar localmente, se necesita la base de datos

```docker-compose up -d```

* -d = __detached__

* MongoDB URL LOCAL:

```mongodb://localhost:27017/nextshop-db```

* Reconstruir los modulos de nodes
```yarn install```
* iniciar el servidor web en modo development
```yarn dev```

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

## Configurar los datos de la BD con informacion de prueba

```http://localhost:3000/api/seed```