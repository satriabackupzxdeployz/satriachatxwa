const express = require('express')
const cors = require('cors')
const axios = require('axios')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 2003

const BOT_URL = process.env.BOT_URL || 'http://nazzwannn.ommdhangantenk.my.id'

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.post('/api/send', async (req, res) => {
    const { target, text } = req.body
    const domain = req.headers.origin || req.headers.referer || 'unknown'

    if (!target || !text) {
        return res.status(400).json({
            status: 'error',
            message: 'Nomor tujuan dan text wajib diisi'
        })
    }

    try {
        const response = await axios.post(`${BOT_URL}/send-message`, {
            target: target,
            text: text,
            domain: domain
        }, {
            timeout: 30000
        })

        res.json(response.data)
    } catch (error) {
        console.error('[API] Error:', error.message)

        if (error.response) {
            res.status(error.response.status).json(error.response.data)
        } else {
            res.status(500).json({
                status: 'error',
                message: 'Gagal terhubung ke bot: ' + error.message
            })
        }
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

app.listen(PORT, () => {
    console.log(`[API] Server berjalan di port ${PORT}`)
    console.log(`[API] Bot URL: ${BOT_URL}`)
})const