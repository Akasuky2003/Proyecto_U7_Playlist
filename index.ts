/*IMPORTS*/
import express ,{ Express, Request,Response } from "express";
import dotenv from 'dotenv';
import { Prisma } from "@prisma/client";
import { PrismaClient } from ".prisma/client";
/*Config*/
const prisma = new PrismaClient();
dotenv.config();
const app:Express=express();
/*Usaremos JSON*/
app.use(express.json());
app.get('/',(req:Request,res:Response) => {
    res.send('Express+ typescript server');
})