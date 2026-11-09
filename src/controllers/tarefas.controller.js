import { listarLivros, cadastrarLivro } from '../services/tarefas.service.js'

export function listar(req, res){
  return res.json(listarLivros())}

export function cadastrar(req, res){
  const { titulo, autor } = req.body || {}
  const resultado = cadastrarLivro(titulo, autor)

  if (resultado.erro){
    return res.status(400).json({ erro: resultado.erro })}

  return res.status(201).json(resultado.livro)}