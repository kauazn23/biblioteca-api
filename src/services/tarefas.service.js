import { buscarTodos, adicionar } from '../models/livros.model.js'

export function listarLivros(){
  return buscarTodos()}

export function cadastrarLivro(titulo, autor){
  if (typeof titulo !== 'string' || !titulo.trim() ||
      typeof autor !== 'string' || !autor.trim()) {
    return { erro: 'Informe o título e o autor.' }}

  const livro = adicionar(titulo.trim(), autor.trim())
  return { livro }}