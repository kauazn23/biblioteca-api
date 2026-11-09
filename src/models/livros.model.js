const livros = [
  { id: 1, titulo: 'Dom Casmurro', autor: 'Machado de Assis' }
]

let proximoLivro = 2
export function buscarTodos(){
  return livros}
  
export function adicionar(titulo, autor){
  const livro = { id: proximoLivro++, titulo, autor }
  livros.push(livro)
  return livro}