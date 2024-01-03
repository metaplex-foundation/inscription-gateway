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

export async function GET(request: Request, { params }: { params: { network: string, address: string }}) {
  const { network, address } = params
  // let res = new NextResponse();

  const umi = createUmi(clusterApiUrl(network), 'confirmed');

  let account = null;
  try {
  account = await umi.rpc.getAccount(publicKey(address));
  } catch (e) {
    console.log(e);
  }

  if (account && account.exists) {
    return new NextResponse(Buffer.from(account.data));
  } else {
    return new NextResponse(null, {status: 404});
  }
}