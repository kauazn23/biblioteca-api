import { MongoClient } from 'mongodb';

let client;
let db;

export async function conectar() {
  const uri = process.env.MONGODB_URI;
  const biblioteca = process.env.MONGODB_DB_NAME;

  if (!uri || !biblioteca) {
    throw new Error('Defina MONGODB_URI e MONGODB_DB_NAME no arquivo .env.');
  }

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(biblioteca);
  return db;
}

export function obterBanco() {
  return db;
}

export async function desconectar() {
  if (client) {
    await client.close();
  }
}