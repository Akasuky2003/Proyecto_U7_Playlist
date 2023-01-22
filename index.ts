/*IMPORTS*/
import express ,{ Express, Request,Response } from "express";
import dotenv from 'dotenv';
import { Prisma } from "@prisma/client";
import { PrismaClient } from ".prisma/client";
/*PUERTO*/
const PORT = process.env.PORT
/*Config*/
const prisma = new PrismaClient();
dotenv.config();
const app:Express=express();
/*Usaremos JSON*/
app.use(express.json());
app.post('/users',async(req:Request, res:Response)=>{
    const {name,email,password} = req.body;
    const user=await prisma.user.create({
        data:{name,email,password}
    });
    res.status(201).json(user);
})
app.post('/login',(req:Request, res:Response) => {
    db.get('SELECT * FROM users WHERE email = ?', email, (err, user) => {
        if (err) {
            // Si ocurre un error, enviar una respuesta de error
            return res.status(500).json({ message: 'Error al iniciar sesión' });
        }

        // Si no se encuentra el usuario, enviar una respuesta de error
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña enviada con la almacenada en la base de datos
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                // Si ocurre un error, enviar una respuesta de error
                return res.status(500).json({ message: 'Error al iniciar sesión' });
            }

            // Si las contraseñas no coinciden, enviar una respuesta de error
            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }

            // Si el usuario existe y la contraseña es correcta, crear un token de acceso
            const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

            // Enviar el token de acceso en la respuesta
            res.json({ accessToken });
        });
    });
}); 


/*Asignamos puerto*/
app.listen(PORT,()=>{
    console.log(`Express server listening on port http://localhost:${PORT}`)

});