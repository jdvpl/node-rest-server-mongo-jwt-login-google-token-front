const { response } = require("express");
const Usuario=require("../models/user");
const bcryptjs=require("bcryptjs");
const { generarJWT } = require("../helpers/generate-jwt");

const login=async(req,res=response)=>{
  const {email,password}=req.body;

  try {
    // verificar si el correo existe
    const user=await Usuario.findOne({ email});

    if(!user){
      return res.status(400).json({msg: 'Usuario no existe'})
    }

    // verificar si el usaurio esta activo
    if(!user.status){
      return res.status(400).json({msg: 'Este usuario esta inactivo'})
    }

    // verificar la contraseña
    const validPassword=bcryptjs.compareSync(password, user.password);

    if(!validPassword){
      return res.status(400).json({
        msg: 'Contraseña erronea'
      })
    }
    // generar el JWT
    const token=await generarJWT(user.id);
    res.json({user,token})
  } catch (error) {
    console.log(error)
    res.status(500).json({msg: 'Hubo un error al loguearse'})
  }
  
}

const googleSignin = async(req, res=response) => {
  const {id_token}=req.body;

  res.json({id_token})
}

module.exports = {login,googleSignin};