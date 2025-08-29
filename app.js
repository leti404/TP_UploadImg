import express from 'express'
import autoresController from './controllers/autores-controller.js'
import librosController from './controllers/libros-controller.js'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(express.json())

app.use('/autores', autoresController)
app.use('/libros', librosController)

const port = process.env.PORT || 3000
app.listen(port, ()=>console.log(`Servidor escuchando en puerto ${port}`))
