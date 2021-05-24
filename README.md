<h1 align="center">Práctica 3. Serverless 👨🏻‍💻 </h1>

<p align="center">
  <a href="/docs" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

Proyecto para crear una aplicación Serverless en AWS con funciones lambda.

## Authors

👤 **JuanCBM**: Juan Carlos Blázquez Muñoz

* Github: [@JuanCBM](https://github.com/JuanCBM)

👤 **mahuerta**: Miguel Ángel Huerta Rodríguez

* Github: [@mahuerta](https://github.com/mahuerta)

# Sobre la ejecución de la aplicación
- Estructura:
![Alt text](estructura-dynamodb.png "Title")

Como se puede comprobar hemos optado por un diagrama parecido a lo que se podría realizar en una BBDD relacional de MYSQL con **3 tablas**.

Hemos añadido el userNick en la tabla de comments porque a pesar de tener redundancia nos permite retornar el nombre de la persona que ha escrito el comentario. Además, al ser un dato que no se puede actualizar (sólo se actualiza el email) no nos provoca más problemas.

Hemos optado por utilizar **2 funciones lambda**:
- booksFunction: Dispone de políticas con permiso de lectura actualización, borrado y creación de la tabla de libros. Además, de consulta de usuarios y comentarios.
- usersFunction: Dispone de políticas con permiso de lectura actualización, borrado y creación de la tabla de usuarios. Además, de consulta de libros y comentarios.


# Despliegue
1. Desde la consola, nos situamos en la carpeta de aws:
> cd /aws

2. Construcción y despliegue:
    ```
    sam build
    sam deploy --guided
    ```
3. Siguiendo los pasos dispondremos de la ruta de la aplicación en 

https://``${ServerlessRestApi}``.execute-api.``${AWS::Region}``.amazonaws.com/Prod/"

# Peticiones 
Adjuntamos un archivo postman con las diferentes peticiones que podemos realizar a la aplicación.

Ejemplo de alguna de ellas: