import express from 'express'

const app = express()
app.use(express.json())

let livros = [
    { id: 1, titulo: 'Dom casmurro', autor: 'Machado de Assis'}
]

let proximoLivro = 2

app.get('/', (res, res) => {
    res.json({mensagem: 'API da biblioteca escolar'})
})

app.get('/livros', (req, res) => {
    res.json(livros)
})

app.use((req, res) => {
    res.status(404).json({ erro: 'Rota não encotrada'})
})

app.listen(3000, () => {
    console.log('API em http://localhost:3000')
})