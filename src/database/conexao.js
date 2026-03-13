import mysql from 'mysql2/promise'

const conexao = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'inventario'
});

export default conexao;