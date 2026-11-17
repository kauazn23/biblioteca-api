import { ObjectId } from 'mongodb';
import { obterBanco } from '../config/database.js';

export function colecao() {
  return obterBanco().collection('exemplares');
}

export async function inserir(documento) {
  const resultado = await colecao().insertOne(documento);
  return resultado.insertedId;
}

export async function remover(id) {
  if (!ObjectId.isValid(id)) {
    return false;
  }

  const resultado = await colecao().deleteOne({ _id: new ObjectId(id) });
  return resultado.deletedCount > 0;
}