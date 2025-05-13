
import algosdk from 'algosdk';

// Create and export the Algod and Indexer clients
export const getAlgodClient = (): algosdk.Algodv2 => {
  const nodeServer = 'https://mainnet-api.voi.nodly.io';
  const token = '';
  const port = '';
  
  return new algosdk.Algodv2(token, nodeServer, port);
};

export const getIndexerClient = (): algosdk.Indexer => {
  const indexerServer = 'https://mainnet-idx.voi.nodly.io';
  const token = '';
  const port = '';
  
  return new algosdk.Indexer(token, indexerServer, port);
};
