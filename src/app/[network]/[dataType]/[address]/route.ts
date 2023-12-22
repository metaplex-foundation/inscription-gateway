// export default function Network({ params }: { params: { network: string, dataType: string, address: string } }) {
//     return <h1>Fetching Address {params.address} of Data Type {params.dataType} on Cluster {params.network}</h1>
//   }

import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { NextResponse } from "next/server";

function clusterApiUrl(cluster: string): string {
  if (cluster === 'mainnet') {
    return process.env.MAINNET_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';
  } else if (cluster === 'devnet') {
    return process.env.DEVNET_RPC_ENDPOINT || 'https://api.devnet.solana.com';
  } else {
    throw new Error(`Unknown cluster: ${cluster}`);
  }
}

export async function GET(request: Request, { params }: { params: { network: string, dataType: string, address: string } }) {
  const { network, dataType, address } = params
  let res = new NextResponse();

  const umi = createUmi(clusterApiUrl(network), 'confirmed');

  const account = await umi.rpc.getAccount(publicKey(address));
  if (account.exists) {
    if (dataType === 'metadata') {
      const jsonString = Buffer.from(account.data).toString('utf8');

      try {
        const parsedData = JSON.parse(jsonString);
        console.log(parsedData);
        return NextResponse.json(parsedData);
      } catch (e) {
        console.log(e);
        return NextResponse.error();
      }
    }
  } else {
    return NextResponse.error();
  }
}