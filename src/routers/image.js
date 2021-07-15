const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const Image = require('../models/image')


const router = new express.Router()


const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

router.post('/avatar', upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    const image = new Image({
        avatar:buffer
    })
    try{
        await image.save()
        res.send(image)
    }catch{
        res.status(400).send("error")
    }
})

router.delete('/avatar/delete/:id', async (req, res) => {
    try{
        await Image.findOneAndDelete({_id:req.params.id})
        // await Image.save() 
        res.status(200).send("deleted")

    }
    catch{
        res.status(400).send()
    }

})

router.get('/avatar/:id', async (req, res) => {
    try {
        const user = await Image.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router