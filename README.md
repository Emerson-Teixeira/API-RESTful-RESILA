# API-RESTful-RESILA
 to-do list

# Requisições GET (“/api/lista”) - 
Request para obter lista de tarefas, é possível obter um único item adicionando /id após lista. Também é possível Obter a lista ordenada por [ID = 0, Tarefa = 1, Descrição = 2, Dia de criaçao = 3, Dia do termino = 4], adicionando como parâmetro 'orderCol'.
 Ex: "REQUEST/?orderCol=3". 
Também é possível escolher entre ascendente e descendente adicionando como parâmetro 'dir' [ASC = 0, DESC = 1].
 Ex: "REQUEST/?dir=1".
A resposta será dada em um array de objetos Json, e as datas serão devolvidas como timestamp, então quando consumir a API será necessário algum tipo de conversão.
Exemplo de resposta:
[
    {
        "ID": 31,
        "Tarefa": "Teste 1",
        "Descricao": "Testando api pelo postman",
        "Data_de_Criacao": 1618150196562,
        "Data_de_Termino": 897966000000
    }
]

# Requisição POST (“/api/lista”) – 
Nessa requisição é necessário enviar no corpo um json seguindo o seguinte padrão: 
{
    "tarefa":"Teste 1", //String
    "descricao":"Testando API", //String
    "dataTermino": "2021-04-11" //String do tipo (YYYY-MM-DD)
}

A resposta será um 201 caso tenha sido criado, ou será devolvido um json com o erro.

# Requisição DELETE (“/api/lista/:id”) – 
Nessa requisição o cliente passa o id de uma tarefa para ser excluída sendo retornado 200 caso a ação ocorra ou será devolvido um json com o erro.






# Requisição PUT (“/api/lista/:id”)  – 
Nessa requisição o cliente passa o id de uma tarefa para ser alterada, e também os valores dos novos campos que aquela tarefa terá. (Nessa requisição todo o Item será alterado). O formato do corpo é igual ao do post.

# Requisiçao PATCH (“/api/lista/:id”)  - 
Nessa requisição o cliente passa o id de uma tarefa para ser alterada, no corpo o cliente deve passar um json contendo somente 1 campo que ele deseja alterar, então caso seja passado + de 1 campo o servidor responderar com um erro. 
