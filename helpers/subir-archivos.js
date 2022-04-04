const { Promise } = require("mongoose");

const path = require('path'); //para crear los paths

const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta='') => {

    return new Promise((resolve, reject)=>{
        const {archivo} = files;// extraemos el nombre
        const nombreCortado = archivo.name.split('.'); // el split es la funcion que va a separar el nombre y la extensíon
        const extension = nombreCortado[nombreCortado.length - 1]; // me manda solo el tipo de extension
      
        //validar la extension
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no es permitida, solo de tipo:  ${extensionesValidas}`);
           
        }
      
      
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath =path.join(  __dirname, '../uploads/',carpeta, nombreTemp);
      
        archivo.mv(uploadPath, (err)=> {
          if (err) {
           reject(err);
          }
      
          resolve(nombreTemp);
        });
    })

  
}

module.exports = {
    subirArchivo
}