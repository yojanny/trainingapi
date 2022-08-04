# trainingapi
Api de entrenamiento de gimnasio para creación y modificación de ejercicios de entrenamientos para un gimnasio

# ENTIDADES
    user
        id
        email
        contraseña
    ejercicio

    favorito

# ENDPOINTS

	- POST /user Registro de usuario (TODOS)
	- POST /login Login de usuario (devuelve el token)

endpoints para administrador
	- POST /crear un ejercicio (post)
	modificar un ejercicio (patch o put)
	eliminar un ejercicio (delete)
	
endpoints 
	- GET ver listado de ejercicios
	- GET ver detalles de un ejercicio en concreto
	- GET ver ejercicios filtrados por una caracterisicas
	poner un like a un ejercicio
	quitar un like a un ejercicio
	
	poner en favorito a un ejercicio y obtener los favoritos de un usuario (no veo la diferencia con los likes)
	

para los roles --> incluir en la tabla users un 
	atributo string en sql ROL o un booleano (tinyint) isAdmin (mejor estring porque nos limita solo a dos roles)
	rol admin
      	rol regular user
		
	incluirlo en el payload
	role: "admin"
	o
	role: "regular user"
	
	dos opciones, o meterlo en un middle ware
	
	error 403
	
	
METER EN EL SQL MAGICAMENTE LOS USUARIOS ADMINISTRADORES
REGISTRAR USUARIO REGULAR
LOGUEAR USUARIO
CHECKEAR QUE ESTAS LOGUEADO
CHECKEAR QUE ES ADMINISTRADOR (ANTES DE LOS ENDPOINTS QUE TIENEN FUNCION DE ADMINISTRADOR)