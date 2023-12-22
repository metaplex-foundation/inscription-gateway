// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { publicKey, MaybeRpcAccount } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    res.send("The Metaplex Inscription Gateway");
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

function clusterApiUrl(cluster: string): string {
    if (cluster === 'mainnet') {
        return process.env.MAINNET_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';
    } else if (cluster === 'devnet') {
        return process.env.DEVNET_RPC_ENDPOINT || 'https://api.devnet.solana.com';
    } else {
        throw new Error(`Unknown cluster: ${cluster}`);
    }
}

app.get('/:network/metadata/:address', function (req: Request, res: Response) {
    const network = req.params.network;
    const address = req.params.address;

    const umi = createUmi(clusterApiUrl(network), 'confirmed');

    umi.rpc.getAccount(publicKey(address)).then(function (account) {
        if (account.exists) {
            res.setHeader('Content-Type', 'application/json');

            const jsonString = Buffer.from(account.data).toString('utf8');

            try {
                const parsedData = JSON.parse(jsonString);
                console.log(parsedData);
                res.end(JSON.stringify(parsedData));
            } catch (e) {
                console.log(e);
                res.status(500).send('Internal server error');
            }

        } else {
            res.status(404).send('Not found');
        }
    });
});

app.get('/:network/image/:address', function (req: Request, res: Response) {
    const network = req.params.network;
    const address = req.params.address;

    const umi = createUmi(clusterApiUrl(network), 'confirmed');

    umi.rpc.getAccount(publicKey(address)).then(function (account) {
        if (account.exists) {
            const img = Buffer.from(account.data.buffer).toString('base64');
            console.log(img);
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': img.length
            });

            res.end(img);
        } else {
            res.status(404).send('Not found');
        }
    });
});