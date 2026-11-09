import * as emprestimos from '../models/emprestimos.model.js';
import { buscarPorId as buscarLeitor } from '../models/leitores.model.js';
import { buscarPorId as buscarExemplar } from '../models/exemplares.model.js';

const LIMITE = 3;
const MULTA_POR_DIA = 2;
const MILISSEGUNDOS_POR_DIA = 24 * 60 * 60 * 1000;

function hoje() {
  return new Date().toLocaleDateString('sv-SE', {
    timeZone: 'America/Campo_Grande'
  });
}

function dataValida(data) {
  if (typeof data !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    return false;
  }

  const dia = new Date(`${data}T00:00:00Z`);
  return !Number.isNaN(dia.getTime()) && dia.toISOString().slice(0, 10) == data;
}

export function emprestar({ leitorId, exemplarId, dataPrevista }) {
  if (!Number.isInteger(leitorId) || !Number.isInteger(exemplarId)) {
    return { status: 400, erro: 'Informe IDs numéricos para leitor e exemplar.' };
  }

  if (!buscarLeitor(leitorId) || !buscarExemplar(exemplarId)) {
    return { status: 404, erro: 'Leitor ou exemplar não encontrado.' };
  }

  const dataEmprestimo = hoje();

  if (!dataValida(dataPrevista) || dataPrevista < dataEmprestimo) {
    return { status: 400, erro: 'Informe uma data válida de hoje em diante (AAAA-MM-DD).' };
  }

  const ativos = emprestimos.buscarTodos().filter(emprestimo =>
    emprestimo.dataDevolucao == null
  );

  const ativosDoLeitor = ativos.filter(emprestimo =>
    emprestimo.leitorId == leitorId
  );


  if (ativosDoLeitor.some(emprestimo => emprestimo.dataPrevista < dataEmprestimo)) {
    return { status: 409, erro: 'O leitor possui um empréstimo atrasado.' };
  }

  
  if (ativosDoLeitor.length >= LIMITE) {
    return { status: 409, erro: 'O leitor já possui 3 empréstimos ativos.' };
  }

  if (ativos.some(emprestimo => emprestimo.exemplarId == exemplarId)) {
    return { status: 409, erro: 'Este exemplar já está emprestado.' };
  }

  const emprestimo = emprestimos.adicionar({
    leitorId,
    exemplarId,
    dataEmprestimo,
    dataPrevista,
    dataDevolucao: null,
    multa: 0
  });

  return { status: 201, emprestimo };
}

export function devolver(id) {
  const emprestimo = emprestimos.buscarPorId(id);

  if (!emprestimo) {
    return { status: 404, erro: 'Empréstimo não encontrado.' };
  }

  if (emprestimo.dataDevolucao !== null) {
    return { status: 409, erro: 'Este empréstimo já foi devolvido.' };
  }


  const dataDevolucao = hoje();
  const prevista = Date.parse(`${emprestimo.dataPrevista}T00:00:00Z`);
  const devolucao = Date.parse(`${dataDevolucao}T00:00:00Z`);
  const diasAtraso = Math.max(0, (devolucao - prevista) / MILISSEGUNDOS_POR_DIA);
  const multa = diasAtraso * MULTA_POR_DIA;

  const atualizado = emprestimos.atualizar(id, { dataDevolucao, multa });

  return { status: 200, emprestimo: { ...atualizado, diasAtraso } };
}