# Gestor de tareas

Backend: 
El framework que vamos a usar sera express, la base de datos usada fue sqlite3 y en ella vamos a tener todos los registros para que los datos de nuestra app persistan durante el tiempo. El backend, esta dividido en las capas de repositorio, servicio y controladores. En los controladores encontraremos el codigo que conjunto con las rutas formaran nuestros endpoints. Para las rutas usamos la libreria de express Router y para la autentificacion y acceder a ellas usamos jsonwebtoken pasados a traves de los headers. 

Frontend: 
La libreria que usamos fue de React, para las consultas al backend se uso ReactQuery y para el manejo de estados generales se uso Jotai, en cuanto a las rutas manejadas desde el frontend usamos react, router y para las notificaciones toast, se uso la libreria Toaster de Sonner. 


