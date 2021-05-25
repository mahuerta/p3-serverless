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

<p align="center">
  <img alt="License: MIT" src="estructura-dynamodb.png" />
</p>

Como se puede comprobar hemos optado por un diagrama parecido a lo que se podría realizar en una BBDD relacional de MYSQL con **3 tablas**.

Hemos añadido el ``userNick`` en la tabla de comments porque, a pesar de tener redundancia, nos permite retornar el nombre de la persona que ha escrito el comentario. Además, al ser un dato que no se puede actualizar (sólo se actualiza el e-mail) no nos provoca más problemas.

Hemos optado por utilizar **2 funciones lambda**:
- **booksFunction**: Dispone de políticas con permiso de lectura actualización, borrado y creación de la tabla de libros y comentarios. Además, de consulta de usuarios.
- **usersFunction**: Dispone de políticas con permiso de lectura actualización, borrado y creación de la tabla de usuarios. Además, de consulta de libros y comentarios.


# Despliegue
1. Desde la consola en la raíz del proyecto, nos situamos en la carpeta de aws:
    ```
    cd /aws
    ```

2. Construcción y despliegue:
    ```
    sam build
    sam deploy --guided
    ```
3. Siguiendo los pasos dispondremos de la ruta de la aplicación en producción en: 

    https://``${ServerlessRestApi}``.execute-api.``${AWS::Region}``.amazonaws.com/Prod/"

# Peticiones 
Adjuntamos un archivo postman con las diferentes peticiones que podemos realizar a la aplicación.

Vamos a hacer un ejemplo de alguna de las más importantes pasando por las operaciones especiales más algunas de los CRUD básicos.

## Operaciones especiales

- ### Obtener el listado de libros en el que se muestre únicamente el título y el id.
    Con unos libros dados de alta, ejecutamos la siguiente petición:

    | verb | url                                 |
    |------|-------------------------------------|
    | GET | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/books/ |

    Respuesta:
    ```
    {
      "Items": [
          {
              "bookid": "476127c0-bd8d-11eb-95e2-3530356b7885",
              "title": "Nuevo libro 2"
          },
          {
              "bookid": "45385450-bd8d-11eb-95e2-3530356b7885",
              "title": "Nuevo libro 1"
          }
      ],
      "Count": 2,
      "ScannedCount": 2
    }
    ```

-  ### Obtener un único libro con los comentarios asociados. En los comentarios deberá incluirse el nombre del usuario.
    Con un libro dado de alta con comentarios ejecutamos la siguiente petición:

    | verb | url                                 |
    |------|-------------------------------------|
    | GET | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/books/476127c0-bd8d-11eb-95e2-3530356b7885 |

    Respuesta:
    ```
    {
        "Item": {
            "summary": "resumen",
            "publicationYear": 1996,
            "publisher": "editor",
            "bookid": "476127c0-bd8d-11eb-95e2-3530356b7885",
            "title": "Nuevo libro 2",
            "author": "autor",
            "comments": {
                "Items": [
                    {
                        "userNick": "userComments",
                        "score": 1,
                        "comment": "Book 2 comment from user 1",
                        "commentid": "9435bc00-bd8d-11eb-95e2-3530356b7885",
                        "bookid": "476127c0-bd8d-11eb-95e2-3530356b7885",
                        "userid": "806679d0-bd8d-11eb-a76b-43250ec2daff"
                    }
                ],
                "Count": 1,
                "ScannedCount": 1
            }
        }
    }
    ```


-  ### Se deberá poder obtener los comentarios de un usuario concreto. En este caso los comentarios deberán incluir el id del libro al que comentan
    Con un usuario con comentarios ejecutamos la siguiente petición:


    | verb | url                                 |
    |------|-------------------------------------|
    | GET | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/users/806679d0-bd8d-11eb-a76b-43250ec2daff/comments |


    Respuesta:
    ```
      {
      "Items": [
          {
              "userNick": "userComments",
              "score": 1,
              "comment": "Book 2 comment 2 from user 1",
              "commentid": "d25b0170-bd8d-11eb-95e2-3530356b7885",
              "bookid": "476127c0-bd8d-11eb-95e2-3530356b7885",
              "userid": "806679d0-bd8d-11eb-a76b-43250ec2daff"
          },
          {
              "userNick": "userComments",
              "score": 1,
              "comment": "Book 2 comment from user 1",
              "commentid": "9435bc00-bd8d-11eb-95e2-3530356b7885",
              "bookid": "476127c0-bd8d-11eb-95e2-3530356b7885",
              "userid": "806679d0-bd8d-11eb-a76b-43250ec2daff"
          }
      ],
      "Count": 2,
      "ScannedCount": 2
    }
    ```


-  ### No se podrán borrar usuarios con comentarios.
    - Usuario sin comentarios:

        Creamos un usuario:

        | verb | url                                 |
        |------|-------------------------------------|
        | POST | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/users/ |

        Ejemplo de body:

        ```
        {
          "email": "userWithoutComments@email.es",
          "nick": "userWithoutComments"
        }
        ```

        Respuesta:
        ```
        {
            "userid": "8fb6f530-bd8e-11eb-a76b-43250ec2daff",
            "nick": "userWithoutComments",
            "email": "userWithoutComments@email.es"
        }
        ```

        Borramos el usuario:

        | verb | url                                 |
        |------|-------------------------------------|
        | DELETE | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/users/8fb6f530-bd8e-11eb-a76b-43250ec2daff |

        Respuesta:
        ```
        {
          "Attributes": {
              "email": "userWithoutComments@email.es",
              "nick": "userWithoutComments",
              "userid": "8fb6f530-bd8e-11eb-a76b-43250ec2daff"
            }
        }
        ```

      - Usuario con comentarios:

      Creamos un usuario:

        | verb | url                                 |
        |------|-------------------------------------|
        | POST | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/users/ |

        Ejemplo de body:

        ```
        {
          "email": "userWithComments@email.es",
          "nick": "userWithComments"
        }
        ```

        Respuesta:
        ```
        {
            "userid": "806679d0-bd8d-11eb-a76b-43250ec2daff",
            "nick": "userComments",
            "email": "userComments@email.es"
        }
        ```

      Creamos un libro:

        | verb | url                                 |
        |------|-------------------------------------|
        | POST | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/books/ |

        Ejemplo de body:

        ```
        {
          "author": "autor",
          "title": "Nuevo libro",
          "summary": "resumen",
          "publisher": "editor",
          "publicationYear": 1996
        }
        ```

        Respuesta:
        ```
        {
            "bookid": "476127c0-bd8d-11eb-95e2-3530356b7885",
            "author": "autor",
            "title": "Nuevo libro 2",
            "summary": "resumen",
            "publisher": "editor",
            "publicationYear": 1996
        }
        ```


      Creamos un comentario en el libro anterior con el nick del usuario que acabamos de dar de alta:

        | verb | url                                 |
        |------|-------------------------------------|
        | POST | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/books/476127c0-bd8d-11eb-95e2-3530356b7885/comments/ |

        Ejemplo de body:

        ```
        {
          "comment": "Book 2 comment from user 1",
          "userNick": "userComments",
          "score": 1
       }
        ```

        Respuesta:
        ```
        {
            "commentid": "d25b0170-bd8d-11eb-95e2-3530356b7885",
            "comment": "Book 2 comment 2 from user 1",
            "score": 1,
            "userid": "806679d0-bd8d-11eb-a76b-43250ec2daff",
            "userNick": "userComments",
            "bookid": "476127c0-bd8d-11eb-95e2-3530356b7885"
        }
        ```

      Borramos el usuario:
        | verb | url                                 |
        |------|-------------------------------------|
        | DELETE | https://5pleqicn20.execute-api.us-east-1.amazonaws.com/Prod/users/806679d0-bd8d-11eb-a76b-43250ec2daff |

        Respuesta: 409
        ```
        "User has comments"
        ```
