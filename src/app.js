const express = require("express");
const app = express();
const PORT = 3000
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use("/api", require("./rotas/api.js"))
app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`)
})