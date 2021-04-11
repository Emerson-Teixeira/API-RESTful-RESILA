//Para testar a API leia o README, Qualquer duvida entre em contato Email: emejunior99@gmail.com
// O banco de dados ja possuiu alguns dados, para testar do Zero exclua a base e reinicie o programa 
const express = require("express");
const { createTable } = require("./database.js");
const app = express();
const PORT = 3000
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use("/api",require("./rotas/api.js"))
app.listen(PORT, ()=>{
    createTable()
    console.log(`Servidor rodando na porta ${PORT}`)
})