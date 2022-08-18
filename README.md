# API DE ENTRENAMIETO
API para creación y modificación de ejercicios de entrenamiento para un gimnasio

## ENTIDADES
- User:
    - id
    - email
	- password
	- created_at
	- role

- Ejercicio:
	- id
    - name
	- description
	- image
	- typology
	- muscle
	- created_at
	- user_id

- Favorito:
	- user_id
	- ejercicio_id
	- created_at

## ENDPOINTS

- POST /accounts Registro de usuario (los administradores se deben insertar en la bases de datos con su rol de "admin")
- POST /auth Login de usuario (devuelve el token)
- POST /workouts Creación de ejercicio (solo admin)
- DELETE /workouts/:id Eliminación de ejercicio (solo admin)
- GET /workouts Lista todos los ejercicios
- GET /workouts/:id Lista un ejercicio en concreto
- GET /workout/:param Filtra los ejercicios por un parametro en concreto
- POST /workout/:id/like Like a un ejercicio
- DELETE /workout/:id/like Dislike a un ejercicio
- PATCH /workout/:id Modificar un ejercicio