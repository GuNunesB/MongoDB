/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */

// importação do módulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js')

// importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

// importação de biblioteca
const stringSimilarity = require('string-similarity')

// CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        // anotar cod de erro para alterar a mensagem de erro
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpf: cpfCli
            }
        )
            // a linha abaixo salva os dados do cliente no banco
            await novoCliente.save()
            console.log("Cliente adicionado com sucesso.")
        
    } catch (error) {
        // Tratamento de exceções
        if (error.code = 11000) {
            console.log(`Erro: o CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}

// CRUD - Read - Função para listar todos os clientes cadastrados
const listarClientes = async () => {
    try {
        const clientes = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}

// CRUD - Read - Função para buscar um cliente específico
const buscarCliente = async (nome) => {
    try {
        // "find()" busca informações
        // nomeCliente: new RegExp(nome, 'i') filtrar informações pelo nome
        // 'i' insensitive (ignorar letras m aiúsculas ou minúsculas)
        const cliente = await clienteModel.find(
            {
                nomeCliente: new RegExp(nome, 'i')
            }
        )
        // Cálculo de similaridade
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else {
            const match = stringSimilarity.findBestMatch(nome, nomesClientes)

            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)
            const clienteFormatado = {
                nomeCliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpf: melhorCliente.cpf,
                dataCadastro: melhorCliente.dataCadastro.toLocaleDateString('pt-BR') //Sem o "Date" mostra data e hora
            }
            console.log(clienteFormatado)
            console.log(`Nome: ${melhorCliente.nomeCliente}, Telefone: ${melhorCliente.foneCliente}, CPF: ${melhorCliente.cpf}`)
        }
    } catch (error) {
        console.log(error)
    }
}

// execução da aplicação
const app = async () => {
    await conectar()
    // CREATE - await criarCliente("Maria Lúcia", "99999-0000", "000.000.001-67")
    // READ - await listarClientes(), await buscarCliente("Mari")

    await listarClientes()

    await desconectar()
}

console.clear()
app()