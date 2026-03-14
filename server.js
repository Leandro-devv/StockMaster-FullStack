import app from './app.js'
import 'dotenv/config'

const PORT = 3000

app.listen(PORT,() =>{
    console.log(`Servidor rodando na porta localhost:${PORT}!`)
});