const rotas = require('express').Router();
var columns = ['_id','tarefa','descricao','dataTermino','dataCriado']
var columnsAlter = ['tarefa','descricao','dataTermino']
var direction = ['ASC','DESC']
const {createQueryAdd,createQueryRemove,createQuerySelect, createQueryPut, createQueryPatch} = require("../database")

rotas.get("/lista/:id?",async (req,res)=>{
    //default 
    orderBy = columns[req.query.orderCol]?columns[req.query.orderCol]:columns[0] 
    orderDirection = direction[req.query.dir]?direction[req.query.dir]:direction[0]

    if(req.params.id)
    {
        try{
            var rows = await createQuerySelect(columns[0],req.params.id,orderBy,orderDirection)
            if (rows.length<= 0){
                return res.status(404).json({message:"Não há tarefa com esse ID no banco de dados"})
            }
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
            if (rows.length<= 0){
                return res.status(204).json({message:"Não há tarefas no banco de dados"})
            }
            return res.status(200).json(rows)
        }
        catch (err){
            res.status(500).json({message:'Não foi possivel obter a lista de tarefa',err:err})
        }
    }
})
rotas.post("/lista",async (req,res)=>{
    var msg = {
        message: "Não foi possivel adicionar o Item, verifique os dados e tente novamente",
        Problema: null
    }
    if(req.body){
        if(!(req.body.tarefa) || typeof req.body.tarefa  != 'string'){
            msg.Problema = 'Verifique o campo Tarefa'
            return res.status(400).json(msg)
        }
        if(!(req.body.descricao) || typeof req.body.descricao  != 'string'){
            msg.Problema = 'Verifique o campo descricao'
            return res.status(400).json(msg)
        }
        if(req.body.dataTermino){
            if(typeof req.body.dataTermino === 'string')
            {
                var arrayDate = req.body.dataTermino.split('-')
                    if(arrayDate.length != 3){
                         msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                         return res.status(400).json(msg)
                    }
                    else
                    {
                         var timestamp = new Date(arrayDate[0],arrayDate[1]-1,arrayDate[2],0,0,0,0).getTime()
                         if(!Number.isNaN(timestamp)){
                            req.body.dataTermino = timestamp
                         }
                         else{
                            msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                            return res.status(400).json(msg)
                         }

                    }

            }
            else{
                msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                return res.status(400).json(msg)
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
rotas.put("/lista/:id",async (req,res)=>{
    var msg = {
        message: "Não foi possivel alterar o Item, verifique os dados e tente novamente",
        Problema: null
    }
    if(parseInt(req.params.id))
    {
        var rows = await createQuerySelect(columns[0],req.params.id,columns[0] ,direction[0]).catch( err => res.status(500).json({message:'Error ao executar o processo',Error: err}) )
        
        if (rows.length<= 0){
            return res.status(404).json({message:"Erro ao alterar item", Problema:'Não existe uma tarefa com esse ID'})
        }
        if(req.body){
            if(!(req.body.tarefa) || typeof req.body.tarefa  != 'string'){
                msg.Problema = 'Verifique o campo Tarefa'
                return res.status(400).json(msg)
            }
            if(!(req.body.descricao) || typeof req.body.descricao  != 'string'){
                msg.Problema = 'Verifique o campo descricao'
                return res.status(400).json(msg)
            }
            if(req.body.dataTermino){
                if(typeof req.body.dataTermino === 'string')
                {
                    var arrayDate = req.body.dataTermino.split('-')
                        if(arrayDate.length != 3){
                            msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                            return res.status(400).json(msg)
                        }
                        else
                        {
                            var timestamp = new Date(arrayDate[0],arrayDate[1]-1,arrayDate[2],0,0,0,0).getTime()
                            if(!Number.isNaN(timestamp)){
                                req.body.dataTermino = timestamp
                            }
                            else{
                                msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                                return res.status(400).json(msg)
                            }

                        }

                }
                else{
                    msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                    return res.status(400).json(msg)
                }
            }
            try{
                await createQueryPut(req.body,parseInt(req.params.id))
                res.status(200).json({message:'Itens Alterado com sucesso'})
            }
            catch(err){
                msg.Problema = err
                res.status(500).json(msg)
            }
        }
    }
    else
    {
        res.status(400).json({message:"Erro ao remover item",error:'É necessario um ID para remover item'})
    }
})
rotas.patch("/lista/:id",async (req,res)=>{
    if(parseInt(req.params.id)){

        var rows = await createQuerySelect(columns[0],req.params.id,columns[0] ,direction[0]).catch( err => res.status(500).json({message:'Error ao executar o processo',Error: err}) )
        if (rows.length<= 0){
            return res.status(404).json({message:"Erro ao alterar item", Problema:'Não existe uma tarefa com esse ID'})
        }
        if(Object.keys(req.body).length == 1){
            key = Object.keys(req.body)
            if(columnsAlter.includes(key[0])){
                content = Object.values(req.body)
                if(typeof content[0] != 'string'){
                    return res.status(400).json({message:"Erro ao alterar item", Problema:'O campo informado precisa conter uma string'})
                }
                if(key[0] == 'dataTermino'){
                    var arrayDate = content[0].split('-')
                        if(arrayDate.length != 3){
                            return res.status(400).json({message:"Erro ao alterar item", Problema:'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'})
                        }
                        else
                        {
                            var timestamp = new Date(arrayDate[0],arrayDate[1]-1,arrayDate[2],0,0,0,0).getTime()
                            if(!Number.isNaN(timestamp)){
                                content[0] = timestamp
                            }
                            else{
                                msg.Problema = 'Verifique o campo dataTermino(FORMATO NECESSARIO: YY-MM-DD)'
                                return res.status(400).json(msg)
                            }

                        }
                }
                try {
                     createQueryPatch(key[0],content[0],parseInt(req.params.id))
                     return res.status(200).json({message:'Itens Alterado com sucesso'})
                } catch (error) {
                    return res.status(500).json({message:"Erro ao alterar item", Problema:error})
                }
               
            }
            else{
                return res.status(400).json({message:"Erro ao alterar item", Problema:'Campo Invalido'})
            }
        }
        else{
           return res.status(400).json({message:"Erro ao alterar item", Problema:'Patch só pode ser usado para alterar um campo'})
        }
    }
    else
    {
        res.status(400).json({message:"Erro ao remover item",error:'É necessario um ID para remover item'})
    }
})
rotas.delete("/lista/:id",async (req,res)=>{
    if(parseInt(req.params.id))
    {
        var rows = await createQuerySelect(columns[0],req.params.id,columns[0] ,direction[0]).catch( err => res.status(500).json({message:'Error ao executar o processo',Error: err}) )
        
        if (rows.length<= 0){
            return res.status(404).json({message:"Erro ao alterar item", Problema:'Não existe uma tarefa com esse ID'})
        }
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
        res.status(400).json({message:"Erro ao remover item",error:'É necessario um ID para remover item'})
    }
})


module.exports = rotas