"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*IMPORTS*/
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const client_1 = require(".prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv.config();
/*PUERTO*/
const PORT = process.env.PORT;
/*Config*/
const prisma = new client_1.PrismaClient();
dotenv.config();
const app = (0, express_1.default)();
/*Usaremos JSON*/
app.use(express_1.default.json());
app.post('/api/v1/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SaltRounds = 10;
    const { name, email, password } = req.body;
    const hash = bcrypt.hashSync(password, SaltRounds);
    try {
        const exiting_email = yield prisma.user.findMany({
            where: { email: email }
        });
        if (exiting_email.length > 0) {
            return res.status(400).json({ message: 'El email ya existe' });
        }
        const user = yield prisma.user.create({
            data: { name, email, password: hash }
        });
        res.status(201).json(user);
    }
    catch (_a) {
        res.status(500).json({ message: 'Error en al crear usuario' });
    }
}));
app.post('/api/v1/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield prisma.user.findFirstOrThrow({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        if (user.password) {
            const isMatch = yield bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Contraseña incorrecta' });
            }
            if (isMatch) {
                let accessToken = '';
                if (process.env.ACCESS_TOKEN_SECRET) {
                    accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
                }
                res.status(201).json({ token: accessToken });
            }
        }
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "error en el servidor", error: err.message });
    }
}));
app.post('/api/v1/songs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, artist, album, year, genero, duration } = req.body;
    const musica = yield prisma.song.create({
        data: { name, artist, album, year, genero, duration }
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
}));
app.get('/api/v1/songs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const songs = yield prisma.song.findMany();
        res.status(200).json(songs);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error al obtener las canciones" });
    }
}));
app.get('/api/v1/songs/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const song = yield prisma.song.findFirst({
            where: {
                id: Number(id)
            }
        });
        if (!song) {
            return res.status(404).json({ message: 'song not found' });
        }
        res.status(200).json(song);
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "error en servidor", error: err.message });
    }
}));
app.post('/api/v1/playlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { songId, playlistName } = req.body;
    try {
        const song = yield prisma.song.findFirstOrThrow({
            where: {
                id: songId
            }
        });
        if (!song) {
            return res.status(404).json({ message: 'song not found' });
        }
        const playlist = yield prisma.playlist.create({
            data: {
                name: playlistName,
                user: 1,
                music: {
                    connect: {
                        id: songId
                    }
                }
            }
        });
        return res.status(201).json({ message: 'song added to playlist', playlist });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'An error occurred while adding the song to the playlist' });
    }
}));
/*Asignamos puerto*/
app.listen(PORT, () => {
    console.log(`Express server listening on port http://localhost:${PORT}`);
});
