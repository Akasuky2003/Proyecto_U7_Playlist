/*IMPORTS*/
import express, { Express, Request, Response } from "express";
import * as dotenv from 'dotenv';
import { Prisma } from "@prisma/client";
import { PrismaClient } from ".prisma/client";

import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
dotenv.config();
/*PUERTO*/
const PORT = process.env.PORT
/*Config*/
const prisma = new PrismaClient();
dotenv.config();
const app: Express = express();
/*Usaremos JSON*/
app.use(express.json());
app.post('/api/v1/users', async (req: Request, res: Response) => {
    const  SaltRounds  =  10 ;
    const { name, email, password } = req.body;
    const  hash  =  bcrypt . hashSync ( password ,  SaltRounds ) ;
    try{
        const exiting_email=await prisma.user.findMany({
            where: { email:email}
        });
        if(exiting_email.length > 0){
            return res.status(400).json({ message: 'El email ya existe' });
        }
        const user = await prisma.user.create({
            data: { name, email, password:hash }
        });
        res.status(201).json(user);
    }
    catch{
        res.status(500).json({ message: 'Error en al crear usuario' });
    }
})
app.post('/api/v1/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findFirstOrThrow({
            where:{
                email:email
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }
            if (isMatch) {
                let accessToken = '';
                if (process.env.ACCESS_TOKEN_SECRET) {
                    accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                }res.status(201).json({ token: accessToken });
            }
        }
        
    } catch (err:any) {
        console.log(err.message)
        return res.status(500).json({ message:"error en el servidor" ,error: err.message  });
    }
});
app.post('/api/v1/songs',async(req:Request,res:Response) => {
    const {name,artist,album,year,genero,duration} = req.body;
    const musica= await prisma.song.create({
        data:{name,artist,album,year,genero,duration}
        });
        res.status(201).json(musica);
    // try {
    //     const musica= await prisma.song.create({
    //         data:{name,artist,album,year,genero,duration,estado}
    //     });
    //     res.status(201).json(musica);
    // }
    // catch (err:any) {
    //     console.log(err.message)
    //     return res.status(500).json({ message:"error en servidor" ,error: err.message  });
    // }
})
app.get('/api/v1/songs', async (req: Request,res: Response) => {
    try {
        const songs = await prisma.song.findMany();
        res.status(200).json(songs);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error al obtener las canciones"});
    }  
});
app.get('/api/v1/songs/:id', async ( req: Request,res: Response) => {
    const { id } = req.params;
    try {
        const song = await prisma.song.findFirst({
            where: {
                id: Number(id)
            }
        });
        if (!song) {
            return res.status(404).json({ message: 'song not found' });
        }
        res.status(200).json(song);
    } catch (err:any) {
        console.log(err.message)
        return res.status(500).json({ message: "error en servidor", error: err.message });
    }
});

app.post('/api/v1/playlist', async (req: Request, res: Response) => {
    const { songId, playlistName} = req.body;
    try {
        const song = await prisma.song.findFirstOrThrow({
            where: {
                id: songId
            }
        });
        if (!song) {
            return res.status(404).json({ message: 'song not found' });
        }
        const playlist = await prisma.playlist.create({
            data: {
                name: playlistName,
                user:  1,
                music: {
                    connect: {
                        id: songId
                    }
                }
            }
        });
        return res.status(201).json({ message: 'song added to playlist', playlist });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'An error occurred while adding the song to the playlist' });
    }
});
/*Asignamos puerto*/
app.listen(PORT, () => {
    
    console.log(`Express server listening on port http://localhost:${PORT}`)

});