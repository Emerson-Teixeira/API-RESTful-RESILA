const rotas = require('express').Router();
var columns = ['_id','tarefa','descricao','dataTermino','dataCriado']
var direction = ['ASC','DESC']
const {createTable,createQueryAdd,createQueryRemove,createQuerySelect, createQueryPut} = require("../database")

rotas.get("/lista/:id?",async (req,res)=>{
    //default 
    orderBy = columns[req.query.orderCol]?columns[req.query.orderCol]:columns[0] 
    orderDirection = direction[req.query.dir]?direction[req.query.dir]:direction[0]

    if(req.params.id)
    {
        try{
            var rows = await createQuerySelect(columns[0],req.params.id,orderBy,orderDirection)
            return res.status(200).json(rows)
        }
        catch (err){
            res.status(500).json(err)
        }
    }
    else
    {
        try{
            var rows = await createQuerySelect(columns[0],null,orderBy,orderDirection)
            return res.status(200).json(rows)
        }
        catch (err){
            res.status(500).json({message:'Não foi possivel obter a lista de tarefa',err:err})
        }
    }
})


//Cria 1 ou varios posts
rotas.post("/lista",async (req,res)=>{
    var msg = {
        message: "Não foi possivel adicionar o Item, verifique os dados e tente novamente",
        Problema: null
    }
    if(req.body){
        if(!(req.body.tarefa) || typeof req.body.tarefa  != 'string'){
            msg.Problema = 'Verifique o campo Tarefa'
            return res.status(500).json(msg)
        }
        if(!(req.body.descricao) || typeof req.body.descricao  != 'string'){
            msg.Problema = 'Verifique o campo descricao'
            return res.status(500).json(msg)
        }
        if(req.body.dataTermino){
            if(typeof req.body.dataTermino === 'string')
            {
                var arrayDate = req.body.dataTermino.split('-')
                console.log(arrayDate)
                    if(arrayDate.length != 3){
                         msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                         return res.status(500).json(msg)
                    }
                    else
                    {
                         var timestamp = new Date(arrayDate[0],arrayDate[1]-1,arrayDate[2]).getTime()
                         if(typeof timestamp == 'number'){
                            req.body.dataTermino = timestamp
                         }
                         else{
                            msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                            return res.status(500).json(msg)
                         }

                    }

            }
            else{
                msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                return res.status(500).json(msg)
            }
            
        }
        try{
            await createQueryAdd(req.body)
            res.status(201).json({message:'Itens Adicionados com sucesso'})
        }
        catch(err){
            msg.Problema = err
            res.status(500).json(msg)
        }
    }
})

rotas.put("/lista/:id",(req,res)=>{

})
rotas.patch("/lista/:id",(req,res)=>{

})
rotas.delete("/lista/:id",async (req,res)=>{
    if(parseInt(req.params.id))
    {
        try{
            var rows = await createQueryRemove(parseInt(req.params.id))
            return res.status(200).json({message:'Item removido com sucesso'})
        }
        catch (err){
            res.status(500).json({message:"Erro ao remover item",error:err})
        }
    }
    else
    {
        res.status(500).json({message:"Erro ao remover item",error:'É necessario um ID para remover item'})
    }
})









module.exports = rotas