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
const cors_1 = __importDefault(require("cors"));
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
dotenv.config();
/*PUERTO*/
const PORT = process.env.PORT;
/*Config*/
const prisma = new client_1.PrismaClient();
dotenv.config();
const app = (0, express_1.default)();
/*Usaremos Cors */
app.use((0, cors_1.default)());
/*Usaremos JSON*/
app.use(express_1.default.json());
/**/
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
function verifyToken(req, res, next) {
    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "";
    const token = req.headers['authorization'];
    if (!token)
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err)
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
}
app.post('/api/v1/songs', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, artist, album, year, genero, duration } = req.body;
    try {
        const musica = yield prisma.song.create({
            data: { name, artist, album, year, genero, duration }
        });
        res.status(201).json(musica);
    }
    catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "error en servidor", error: err.message });
    }
}));
function verifyTokenSong(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        req.userId = undefined;
        return next();
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "", function (err, decoded) {
        if (err) {
            req.userId = undefined;
            return next();
        }
        req.userId = decoded.id;
        next();
    });
}
app.get('/api/v1/songs', verifyTokenSong, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.userId) {
            // si el usuario no está autenticado, solo devuelve canciones con estado true
            const songs = yield prisma.song.findMany({
                where: {
                    estado: true
                }
            });
            res.status(200).json(songs);
        }
        else {
            // si el usuario está autenticado, devuelve todas las canciones
            const songs = yield prisma.song.findMany();
            res.status(200).json(songs);
        }
    }
    catch (err) {
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
app.post('/api/v1/playlist', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, user } = req.body;
    const playlist = yield prisma.playlist.create({
        data: { name, user }
    });
    res.status(201).json(playlist);
}));
app.post('/api/v1/playlist/song', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id_playlist, id_song } = req.body;
        const song = yield prisma.song.findFirstOrThrow({
            where: { id: id_song }
        });
        if (!song) {
            return res.status(404).json({ message: "Canción no encontrada" });
        }
        const listasong = yield prisma.playlist.findFirstOrThrow({
            where: { id: id_playlist }
        });
        if (!listasong) {
            return res.status(404).json({ message: "Lista no encontrada" });
        }
        yield prisma.music.create({
            data: {
                playlist: { connect: { id: parseInt(id_playlist) } },
                song: { connect: { id: id_song } },
                name: song.name,
                artist: song.artist,
                album: song.album,
                year: song.year,
                genero: song.genero,
                duration: song.duration
            }
        });
        res.status(200).json({ message: "Canción agregada a la lista de reproducción" });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error al agregar canción" });
    }
}));
/*Asignamos puerto*/
app.listen(PORT, () => {
    console.log(`Express server listening on port http://localhost:${PORT}`);
});
