# Burger Queen - API con Node.js con Graphql
---
- **[API-REST](http://165.22.166.131:8080/)**
---
### `Cración de una orden`


- **[API-GRAPHQL](http://165.22.166.131:8080/graphql)**
### `Cración de una orden`
---
## 1. Preámbulo

Un pequeño restaurante de hamburguesas, que está creciendo, necesita un
sistema a través del cual puedan tomar pedidos usando una _tablet_, y enviarlos
a la cocina para que se preparen ordenada y eficientemente.

Este proyecto tiene dos áreas: interfaz (cliente) y API (servidor). Nuestra
clienta nos ha solicitado desarrollar la API que se debe integra con la
interfaz,  que otro equipo de desarrolladoras está trabajando
simultáneamente

## 2. Resumen del proyecto

Con una API en este caso nos referimos a un _servidor web_, que es
básicamente un programa que _escucha_ en un puerto de red, a través del cual
podemos enviarle _consultas_ (_request_) y obtener _respuestas_ (_response_).

Un servidor web debe _manejar_ consultas entrantes y producir respuestas a esas
consultas que serán enviadas de vuelta al _cliente_. Cuando hablamos de
_aplicaciones de servidor_, esto implica una arquitectura de _cliente/servidor_,
donde el cliente es un programa que hace consultas a través de una red (por
ejemplo el navegador, cURL, ...), y el _servidor_ es el programa que recibe
estas consultas y las responde.

[Node.js](https://nodejs.org/) nos permite crear servidores web super eficientes
de manera relativamente simple y todo esto usando JavaScript!

En este proyecto partimos de un _boilerplate_ que ya contiene una serie de
_endpoints_ (puntos de conexión o URLs) y nos piden completar la aplicación.
Esto implica que tendremos que partir por leer la implementación existente, y
familiarizarnos con el _stack_ elegido ([Node.js](https://nodejs.org/) y
[Express](https://expressjs.com/)) y complementarlo con un motor de bases de
datos, el cual tu deberás elegir entre [MongoDB](https://www.mongodb.com/) y
[MySQL](https://www.mysql.com/).

La clienta nos ha dado un [link a la documentación](https://laboratoria.github.io/burger-queen-api/)
que especifica el comportamiento esperado de la API que expondremos por
HTTP.  Ahí puedes encontrar todos los detalles de qué _endpoints_ debe
implementar  la aplicación, qué parámetros esperan, qué deben responder, etc.

## 3. Tecnologías Utilizadas
* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [docker](https://docs.docker.com/)
* [docker compose](https://docs.docker.com/compose/)
* [Postman](https://www.getpostman.com)
* [Variable de entorno - Wikipedia](https://es.wikipedia.org/wiki/Variable_de_entorno)
* [`process.env` - Node.js docs](https://nodejs.org/api/process.html#process_process_env)
* [ssh](https://www.hostinger.es/tutoriales/que-es-ssh)
* [Apollo-Server](https://www.apollographql.com)

## 4. Planificación del Proyecto
Este proyecto fue realizado en duos y se integró con el proyecto
[Burger Queen API client](link) que se desarrolló simultáneamente con el equipo
de Frontend developers.
-[Proyect Burger-queen](https://github.com/nayruthCalla/LIM009-FE-burger-queen-api/projects)
### Test de Integración
Se realizarón **pruebas _end-to-end_**, para verificar el comportamiento desde el
punto de vista de HTTP, desde afuera del servidor. Estos tests, a diferencia de
las pruebas unitarias, no prueban cada pieza por separado sino que prueban la
aplicación completa, de principio a fin. Estas pruebas, al no hacer uso directo
del código fuente de la aplicación, pueden ejecutarse directamente sobre una URL
remota, ya que la interfaz sometida a pruebas es HTTP.

## 5. Criterios del proyecto

### 5.1 API

Según lo establecido por la [documentación](https://laboratoria.github.io/burger-queen-api/)
entregada por nuestra clienta, la API debe exponer los siguientes endpoints:

#### 5.1,1 `/`

* `GET /`

#### 5.1.2 `/auth`

* `POST /auth`

#### 5.1.3 `/users`

* `GET /users`
* `GET /users/:uid`
* `POST /users`
* `PUT /users/:uid`
* `DELETE /users/:uid`

#### 5.1.4 `/products`

* `GET /products`
* `GET /products/:productid`
* `POST /products`
* `PUT /products/:productid`
* `DELETE /products/:productid`

#### 5.1.5 `/orders`

* `GET /orders`
* `GET /orders/:orderid`
* `POST /orders`
* `PUT /orders/:orderid`
* `DELETE /orders/:orderid`

### 5.2 CLI

La clienta nos ha solicitado que la aplicación cuente un comando **`npm start`**
que se debe encargar de ejecutar nuestra aplicación node y que además pueda
recibir información de configuración, como el puerto en el que escuchar, a qué
base datos conectarse, etc. Estos datos de configuración serán distintos entre
diferentes entornos (desarrollo, producción, ...). El _boilerplate_ ya implementa
[el código necesario](config.js) para leer esta información de los
[argumentos de invocación](https://nodejs.org/docs/latest/api/process.html#process_process_argv)
y el
[entorno](https://nodejs.org/docs/latest/api/process.html#process_process_env).

#### 5.2.1 Argumentos de línea de comando

Podemos especificar el puerto en el que debe arrancar la aplicación pasando un
argumento a la hora de invocar nuestro programa:

```sh
# Arranca la aplicación el puerto 8888 usando npm
npm start 8888
```

#### 5.2.2 Variables de entorno

Nuestra aplicación usa las siguientes variables de entorno:

* `PORT`: Si no se ha especificado un puerto como argumento de lína de comando,
  podemos usar la variable de entorno `PORT` para especificar el puerto. Valor
  por defecto `8080`.
* `DB_URL`: El _string_ de conexión de _MongoDB_ o _MySQL_. Cuando ejecutemos la
  aplicación en nuestra computadora (en entorno de desarrollo), podemos usar el
  una base de datos local, pero en producción deberemos utilizar las instancias
  configuradas con `docker-compose` (mas sobre esto en la siguiente sección de
  **Deployment**)
* `JWT_SECRET`: Nuestra aplicación implementa autenticación usando JWT (JSON
   Web Tokens). Para poder firmar (cifrar) y verificar (descifrar) los tokens,
  nuestra aplicación necesita un secreto. En local puedes usar el valor por
  defecto (`xxxxxxxx`), pero es muy importante que uses un _secreto_ de verdad
  en producción.
* `ADMIN_EMAIL`: Opcionalmente podemos especificar un email y password para
  el usuario admin (root). Si estos detalles están presentes la aplicación se
  asegurará que exista el usuario y que tenga permisos de administrador. Valor
  por defecto `admin@localhost`.
* `ADMIN_PASSWORD`: Si hemos especificado un `ADMIN_EMAIL`, debemos pasar
  también una contraseña para el usuario admin. Valor por defecto: `changeme`.

### 5.3 Deployment

Nuestra clienta nos ha manifestado que su equipo de _devops_ está siempre con muchas
tareas, por por lo que nos pide como requerimiento que la aplicación esté configurada
con `docker-compose` para que pueda ser desplegada sin dificultades en cualquier
entorno.

El _boilerplate_ ya cuenta con una configuración incial de `docker-compose` para
la aplicación de node, tu tarea será extender esa configuración para incluir la
configuración de base de datos que hayas elegido.
Ten en cuenta que como vas a tener dos servidores corriendo sobre una misma
configuración, deberás exponer los servicios en diferentes puertos.

Una vez que tengas tu configuración de `docker-compose`, deberás crear un servidor
en la nube (VPS) (en el área de recursos te proponemos algunas alternativas de
proveedores), acceder a él a través de `ssh`, clonar tu repositorio y ejecutar
`docker-compose up` para levantar la aplicación y la documentación, para que
queden online y accesibles.

## 6. Pistas, tips y lecturas complementarias

* [Express](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)
* [MySQL](https://www.mysql.com/)
* [docker](https://docs.docker.com/)
* [docker compose](https://docs.docker.com/compose/)
* [Postman](https://www.getpostman.com)
* [Variable de entorno - Wikipedia](https://es.wikipedia.org/wiki/Variable_de_entorno)
* [`process.env` - Node.js docs](https://nodejs.org/api/process.html#process_process_env)
* TODO: providers de VPS recomendados, idealmente con un free tier o muy baratos.
* [ssh](https://www.hostinger.es/tutoriales/que-es-ssh)

***

## 7 HTTP API Checklist

### 7.1 `/`

* [ ] `GET /`

### 7.2 `/auth`

* [ ] `POST /auth`

### 7.3 `/users`

* [ ] `GET /users`
* [ ] `GET /users/:uid`
* [ ] `POST /users`
* [ ] `PUT /users/:uid`
* [ ] `DELETE /users/:uid`

### 7.4 `/products`

* [ ] `GET /products`
* [ ] `GET /products/:productid`
* [ ] `POST /products`
* [ ] `PUT /products/:productid`
* [ ] `DELETE /products/:productid`

### 7.5 `/orders`

* [ ] `GET /orders`
* [ ] `GET /orders/:orderid`
* [ ] `POST /orders`
* [ ] `PUT /orders/:orderid`
* [ ] `DELETE /orders/:orderid`
