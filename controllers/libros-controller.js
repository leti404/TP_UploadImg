import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import LibrosService from './../services/libros-service.js'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const router = Router()
const currentService = new LibrosService()

router.get('', async (req,res)=>{
  const data = await currentService.getAllAsync()
  data ? res.status(StatusCodes.OK).json(data) : res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error')
})

router.get('/:id', async (req,res)=>{
  const entity = await currentService.getByIdAsync(req.params.id)
  entity ? res.status(StatusCodes.OK).json(entity) : res.status(StatusCodes.NOT_FOUND).send('No encontrado')
})

router.post('', async (req,res)=>{
  const newId = await currentService.createAsync(req.body)
  newId > 0 ? res.status(StatusCodes.CREATED).json(newId) : res.status(StatusCodes.BAD_REQUEST).send('Error')
})

router.put('', async (req,res)=>{
  const rows = await currentService.updateAsync(req.body)
  rows > 0 ? res.status(StatusCodes.OK).json(rows) : res.status(StatusCodes.NOT_FOUND).send('No encontrado')
})

router.delete('/:id', async (req,res)=>{
  const rows = await currentService.deleteByIdAsync(req.params.id)
  rows > 0 ? res.status(StatusCodes.OK).json(rows) : res.status(StatusCodes.NOT_FOUND).send('No encontrado')
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const id = req.params.id
    const dir = path.join(process.cwd(), 'uploads', 'libros', id)
    fs.mkdirSync(dir, { recursive: true })
    cb(null, dir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg'
    cb(null, 'cover' + ext)
  }
})

const upload = multer({ storage })

router.post('/:id/cover', upload.single('image'), async (req,res)=>{
  const id = req.params.id
  const libro = await currentService.getByIdAsync(id)
  if (!libro) return res.status(StatusCodes.NOT_FOUND).send('No existe el libro')
  if (!req.file) return res.status(StatusCodes.BAD_REQUEST).send('Falta archivo')
  const publicUrl = `/static/libros/${id}/${req.file.filename}`
  libro.portada = publicUrl
  const updated = await currentService.updateAsync(libro)
  updated > 0 ? res.status(StatusCodes.CREATED).json(libro) : res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Error')
})

export default router
