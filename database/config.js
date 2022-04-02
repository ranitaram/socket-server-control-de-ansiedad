const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        //connection a mongoose
        await mongoose.connect(process.env.MONGODB_CNN, {
            
        });
        console.log('Base de datos Online');
    } catch (error) {
        //imprime el error
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}