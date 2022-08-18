const mysql = require('mysql2');

const conexion = mysql.createConnection({
    host: '54.94.125.72',
    user: 'valentin',
    password: 'Valentin2415@',
    database: 'pruebas'
});

conexion.connect((error)=>{
    if(error){
        throw error;
    }
    console.log("conexion arriba")
});

module.exports = conexion