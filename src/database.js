var sqlite3 = require('sqlite3').verbose();
require("dotenv").config()
const {DATABASE} = process.env
const path = require('path')
const cam = path.resolve(__dirname,'../','basedados.db')
const openConnection = () => {
        return new sqlite3.Database(cam, (err) =>{
        if(err){
            console.log(err)
             return console.error("Erro ao conectar com o banco de dados")
        }
        }) 
}
const createTable = async()=>{
    sql = `CREATE TABLE if not exists itens (
        tarefa	TEXT NOT NULL,
        _id	INTEGER NOT NULL UNIQUE,
        descricao	TEXT,
        dataCriado	INTEGER NOT NULL,
        dataTermino	INTEGER,
        PRIMARY KEY(_id AUTOINCREMENT))`
    var db = openConnection()
    return new Promise((resolve,reject)=>{
        db.run(sql, (err)=>{
            if (err) {
                reject(false)
            } else {
                resolve(true)
            }
        
        })
    }).finally(db.close((err)=>{if(err) console.error(err)}))
}

const createQueryAdd = (params)=>{
    sql = `INSERT INTO itens(tarefa,descricao,dataCriado,dataTermino) VALUES (?,?,?,?)`
        var db = openConnection()
        return new Promise((resolve,reject)=>{
                db.run(sql,[params.tarefa,params.descricao,Date.now(),params.dataTermino],(err) => {
                    if(err){
                    console.log(err)
                        reject(err)
                    }
                    else
                        resolve()
                })
        }).finally(db.close((err)=>{if(err) console.error(err)}))
}

const createQueryRemove = (params)=>{
    sql = `DELETE FROM itens where _id = ?`
    var error = []
    var db = openConnection()

        return new Promise((resolve,reject)=>{
                db.run(sql,params,(err) => {
                    if(err)
                        reject(err)
                    else
                        resolve()
                })
            }
        ).finally(db.close((err)=>{if(err) console.error(err)}))
}

const createQuerySelect = (tCond,cond,order,tOrder)=>{
    var params = []
    sql = `SELECT _id ID, tarefa Tarefa,descricao Descricao,dataCriado Data_de_Criacao,dataTermino Data_de_Termino FROM itens`

    if(tCond&&cond){
        sql = sql + ` WHERE ${tCond} = ?`
        params.push(cond)
    }

    if(tOrder && order){
        sql = sql + ` ORDER BY ${order} ${tOrder}`
    }
    else{
         if (order)
            sql = sql + ` ORDER BY ?`
    } 
       
    var db = openConnection()
    return new Promise((resolve,reject)=>{
        db.all(sql,params,(err,row) =>{
            if (err){
                reject(err)
            }
            else{
                resolve(row)
            }
        })
    }).finally(db.close((err)=>{if(err) console.error(err);}))
}

const createQueryPatch = (column,newValue,id)=>{
    sql = `UPDATE itens set ${column} = ? WHERE _id = ?`
    var db = openConnection()
    return new Promise((resolve,reject)=>{
        db.run(sql,[newValue,id],(err)=>{
            if(err){
                reject(err)
            }
            else{
                resolve()
            }
        })
    }).finally(db.close((err)=>{if(err) console.error(err)}))
}

const createQueryPut = (params,id)=>{
    sql = `UPDATE itens set tarefa = ?, descricao = ?, dataTermino = ?  WHERE _id = ?`
    var db = openConnection()
    return new Promise((resolve,reject)=>{
        db.run(sql,[params.tarefa,params.descricao,params.dataTermino,id],(err)=>{
            if(err){
                reject(err)
            }
            else{
                resolve()
            }
        })
    }).finally(db.close((err)=>{if(err) console.error(err)}))
}

module.exports = {
    createTable,
    createQueryAdd,
    createQueryRemove,
    createQueryPut,
    createQuerySelect,
    createQueryPatch
}