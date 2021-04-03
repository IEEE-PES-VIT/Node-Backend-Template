const express = require('express');
const router =  express.Router();
const Users = require('../models/user')
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');

const signtoken = (id) => {
    return JWT.sign({
        iss: 'Aayush Samaiyar',
        sub: id
    }, `${process.env.SECRET}`, {expressIn: '1h'})
}

router.post('/login', (req,res)=>{
    const { email, password } = req.body

    Users.findone({email}, (err,user)=>{
        if(err){
            res.status(500).json({message:{msg: "Error has occured",msgError: true}});
        }
        if(!user){
            res.status(400).json({ message: {msg: "Invalid username",msgError:true}});
        }
        else{
            bcrypt.compare(password, user.password, function(err, validate){
                if (err){
                    res.status(500).json({message: {msg: "Error has occured in bcrypt",msgError:true}});
                }
                if (!validate){
                    res.status(400).json({messgae: {msg:"Invalid Password",msgError: true}});
                }
                else{
                    const token = signToken(user._id)
                    res.cookie('access_token',token, {httpOnly:true, sameSite: true})
                    res.status(200).json({user, isAuthenticated: true, message: {msgError:false}})
                }
            })
        }
    })
})

router.get('/logout',passport.authenticate('jwt',{session: false}),(req,res) =>{
    res.clearCookie('access_token')
    res.status(200).json({message: "Logged Out",user: {},success:true})
})

module.exports = router;