/*IMPORTS*/
import express, { Express, Request, Response , NextFunction} from "express";
import * as dotenv from 'dotenv';
import { PrismaClient } from ".prisma/client";
import cors from 'cors';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

dotenv.config();
/*PUERTO*/
const PORT = process.env.PORT
/*Config*/
const prisma = new PrismaClient();

const app: Express = express();
/*Usaremos Cors */
app.use(cors());
/*Usaremos JSON*/
app.use(express.json());

/**/
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
        res.status(500).json({ message: 'Error en crear usuario' });
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
        return res.status(500).json({ message:"Error en el servidor" ,error: err.message  });
    }
});
declare global {
    namespace Express {
      interface Request {
        userId?: number;
      }
    }
  }
function verifyToken(req: Request, res: Response, next: NextFunction) {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ""
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({ auth: false, message: 'Token no proporcionado.' });
    jwt.verify(token, ACCESS_TOKEN_SECRET, function (err: any, decoded: any) {
        if (err) return res.status(500).send({ auth: false, message: 'Fallo en la autentificacion del token.' });
        req.userId = decoded.id;
        next();
    });
}

app.post('/api/v1/songs',verifyToken,async(req:Request,res:Response) => {
    const {name,artist,album,year,genero,duration,estado} = req.body;
     try {
        const musica= await prisma.song.create({
            data:{name,artist,album,year,genero,duration,estado}
        });
        res.status(201).json(musica);
    }
    catch (err:any) {
         console.log(err.message)
        return res.status(500).json({ message:"error en servidor" ,error: err.message  });
    }
})
function verifyTokenSong(req:Request, res:Response, next:NextFunction) {
    const token = req.headers['authorization'];
    if (!token) {
        req.userId = undefined;
        return next();
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", function (err:any, decoded:any) {
        if (err) {
            req.userId = undefined;
            return next();
        }
        req.userId = decoded.id;
        next();
    });
}

app.get('/api/v1/songs', verifyTokenSong, async (req, res) => {
    try {
        if (!req.userId) {
            
            const songs = await prisma.song.findMany({
                where: {
                    estado: true
                }
            });
            res.status(200).json(songs);
        } else {
            
            const songs = await prisma.song.findMany();
            res.status(200).json(songs);
        }
    } catch (err) {
        res.status(500).json({ message: "Error al obtener las canciones" });
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
            return res.status(404).json({ message: 'No se encontro musica' });
        }
        res.status(200).json(song);
    } catch (err:any) {
        console.log(err.message)
        return res.status(500).json({ message: "Error en servidor", error: err.message });
    }
});

app.post('/api/v1/playlist',verifyToken, async (req: Request, res: Response) => {
    try{
        const {name}=req.body;
        const user_id = req.userId;
        const playlist=await prisma.playlist.create({
            data:{name,user:user_id}
    });
    res.status(201).json(playlist);

    }catch(err:any){
        console.log(err.message)
        return res.status(500).json({ message: "Error en servidor", error: err.message });

    }
});

app.post('/api/v1/playlist/song',verifyToken, async (req: Request, res: Response) => {
    try {
        const {id_playlist,id_song}=req.body;
        const song = await prisma.song.findFirstOrThrow({
            where: {id: id_song}
        });
        if (!song) {
            return res.status(404).json({ message: "Canción no encontrada" });
        }
        const listasong = await prisma.playlist.findFirstOrThrow({
            where: {id: id_playlist}
        });
        if (!listasong) {
            return res.status(404).json({ message: "Lista no encontrada" });
        }
        await prisma.music.create({
            data: {
              playlist: { connect: { id: parseInt( id_playlist )} },
              song: { connect: { id: id_song } },
              name: song.name,
              artist:song.artist,
              album:song.album,
              year:song.year,
              genero:song.genero,
              duration:song.duration
            }
          });

        res.status(200).json({ message: "Canción agregada a la lista de reproducción" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error al agregar canción"});
    }
});
/*Asignamos puerto*/
app.listen(PORT, () => {
    console.log(`Aplicación ejecutandose en http://localhost:${PORT}`)
});