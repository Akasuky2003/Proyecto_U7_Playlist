"use strict";
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
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require(".prisma/client");
/*PUERTO*/
const PORT = process.env.PORT;
/*Config*/
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const app = (0, express_1.default)();
/*Usaremos JSON*/
app.use(express_1.default.json());
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const user = yield prisma.user.create({
        data: { name, email, password }
    });
    res.status(201).json(user);
}));
app.post('/login', (req, res) => {
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
app.listen(PORT, () => {
    console.log(`Express server listening on port http://localhost:${PORT}`);
});
