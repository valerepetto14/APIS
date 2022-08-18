const conexion = require('../database/db')
const bcrypt = require('bcrypt');
const key = require('../config').key
const jwt = require('jsonwebtoken')
const usuarios = require('../sequelize/models/usuarios')

const login = async (req, res) =>{
    let { body }= req
    let { user, pass } = body
    // const passcrypt = await bcrypt.hash(pass, 8)
    conexion.query('SELECT id, user, rol,pass FROM usuarios WHERE ?',{user:user}, async (error,results)=>{
        if (error){
            throw error;
        }else{
            // const data = JSON.parse(results)
            if(results.length == 0){
                res.status(400).send("ese usuario no esta registrado")
            }else{
                let passBD = results[0].pass
                let compare = await bcrypt.compare(pass, passBD);
                if (!compare){
                    res.status(401).json({
                        state:"contraseña o usuario equivocado",
                    })
                }else{
                    token = jwt.sign({
                        id: results[0].id,
                        name: results[0].user,
                        rol: results[0].rol
                    }, key)
                    res.header('auth-token',token).json({
                        state:"entraste",
                        data:user,
                        token:token
                    })
                }
            }
        }
    });
}

const loginSequelize = async(req,res)=>{
    let { body }= req
    let { user, pass } = body
    const usuario = await usuarios.findAll({
        attributes: ['user', 'pass', 'rol', 'id'],
        where: { user: user }
      })
    if (usuario.length === 0){
        res.status(400).send("ese usuario no esta registrado")
    }else{
        let passBD = usuario[0].pass
        let compare = await bcrypt.compare(pass, passBD);
        if (!compare){
            res.status(401).json({
                state:"contraseña o usuario equivocado",
            })
        }else{
            token = jwt.sign({
                id: usuario[0].id,
                name: usuario[0].user,
                rol: usuario[0].rol
            }, key)
            res.header('auth-token',token).json({
                state:"entraste",
                data:user,
                token:token
            })
        }
    }
}

const regis = async (req, res) =>{
    const { body }= req
    const { user, name, lastname, rol, pass } = body
    conexion.query('SELECT user FROM usuarios WHERE ?',{user:user}, async (error,results)=>{
        if(error){
            throw error;
        }else if(results.length == 0){
            const passcrypt = await bcrypt.hash(pass, 8)
            conexion.query('INSERT INTO usuarios SET ?',{user:user, name:name, lastname:lastname, rol:rol, pass:passcrypt},(error,results)=>{
                if (error){
                    throw error;
                }else{
                    res.json({
                    state:"registrado",
                    user: user
                    })
                }
            });
        }else{
            res.status(401).json({
                error: "ese user ya esta registrado"
            })
        }
    })
    }
    

const updatePass = (req, res) => {
    const user = req.body.user
    const pass = req.body.pass
    const newpass = req.body.newpass
    conexion.query("SELECT pass FROM usuarios WHERE ?",{user:user}, async (error, results)=>{
        const passBD = results[0].pass
        const compare = await bcrypt.compare(pass,passBD)
        if (!compare){
            res.status(401).json({
                state: "error",
                error: "contraseña equivocada"
            })
        }else{
            newpasscrypt = await bcrypt.hash(newpass, 8)
            conexion.query('UPDATE usuarios SET pass = ? WHERE user = ?',[newpasscrypt, user], (error,results)=>{
                if (error){
                    throw error
                }else{
                    res.status(200).json({
                        state: "contraseña cambiada"
                    })
                }
            }) 
        }   
    })
}

module.exports = {
    login: login,
    register: regis,
    updatePass: updatePass,
    loginSequelize: loginSequelize
}