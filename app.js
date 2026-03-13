import express from 'express';
import conexao  from './src/database/conexao.js';

const app = express();

app.use(express.json());
app.use(express.static('public'));

app.get('/produtos', async (req,res) => {
    try{
        const [rows] = await conexao.query('SELECT * from estoque')
        res.status(200).json(rows)
    }catch(error) {
        console.error('Erro ao conectar ao banco de dados', error)
        res.status(500).send('Erro de conexão com banco de dados')
    }
})

app.post('/produtos', async (req,res) =>{
    const { nome_categoria, tipo, quantidade, diametro, metro } = req.body;
    const d = diametro || null;
    const m = metro || null;

    try{
        const sql = 'INSERT INTO estoque (nome_categoria, tipo, quantidade, diametro, metro) VALUES (?, ?, ?, ?, ?)';
        await conexao.query(sql, [nome_categoria, tipo, quantidade, d, m]);
        res.status(201).json('Cadastrado com sucesso!');
    }catch(error){
        console.error('Erro ao inserir no banco:', error);
        res.status(500).json('Falha ao salvar o produto no banco de dados.');
    }
})

export default app;