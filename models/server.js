const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controllers');
//const { Socket } = require('socket.io');

class Server{
//las propiedades se declaran en el constructor
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server)


        this.paths = {
            auth: '/api/auth',
            buscar: '/api/buscar',
            productos:'/api/productos',
            categorias: '/api/categorias',
            usuarios: '/api/usuarios',
            uploads: '/api/uploads',
        }
       // this.usuariosPath = '/api/usuarios';
       // this.authPath = '/api/auth';  //creamos este path para la autenticacion


        //conectar a base de datos
        this.conectarDB();


        //Middlewares es una funcion que se ejecuta antes  que un controlador o seguir con las peticiones
        this.middlewares();


        //Rutas de mi aplicacion
        this.routes(); // llamar a las rutas

        //Sockets
        this.sockets();
    }

    async conectarDB(){
        await dbConnection();
    }
    
    middlewares(){
        //middlewares
        //cors
        this.app.use(cors());
       
        //Lectura y parseo del body
        this.app.use(express.json());
        /*cualquier informacion que venga de un post, put o delete
        la va a serializar y convertir en un json
        */


        //Directorio publico
        this.app.use(express.static('public'));

        // Carga de archivos - fileupload 
        this.app.use(fileUpload({
        useTempFiles : true,
        tempFileDir : '/tmp/',
        createParentPath: true
        }));
    }





    //metodo
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth')); //definimos la ruta
        this.app.use(this.paths.buscar, require('../routes/buscar')); //definimos la ruta
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

    }

    sockets(){
        this.io.on('connection', socketController);
    }

    listen(){
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto' , this.port);
        });
    }
}

module.exports = Server;