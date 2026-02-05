import fs from 'fs';
import path from 'path';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { polygon } from 'viem/chains';

const RPC_URL = "https://polygon-mainnet.infura.io/v3/24pig8qLJQowk1fn8NJJdxVQ0qp";
const TRADER_ADDRESS = "0x63ce342161250d705dc0b16df89036c8e5f9ba9a";
const CTF_EXCHANGE = "0x4bFB41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E";
const OUTPUT_DIR = path.join(process.cwd(), "web/content/docs/lobstah-trader/trader-spotlights", TRADER_ADDRESS);
const OUTPUT_FILE_TRAWL = path.join(OUTPUT_DIR, "polymarket-trades.ts");

const client = createPublicClient({
    chain: polygon,
    transport: http(RPC_URL),
});

const ORDER_FILLED_ABI = parseAbiItem('event OrderFilled(bytes32 indexed orderHash, address indexed maker, address indexed taker, uint256 makerAssetId, uint256 takerAssetId, uint256 makerAmountFilled, uint256 takerAmountFilled, uint256 fee)');

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function deepTrawl() {
    console.log(`🦞 LobstahScout: FULL DEEP TRAWL (High Fidelity) initiated for ${TRADER_ADDRESS}...`);

    try {
        const targetTradeCount = 15000;
        let allTrades: any[] = [];
        let currentBlock = await client.getBlockNumber();
        const step = 500n; 
        
        while (allTrades.length < targetTradeCount) {
            const fromBlock = currentBlock - step;
            console.log(`📡 [${allTrades.length}/${targetTradeCount}] Scanning blocks ${fromBlock} to ${currentBlock}...`);

            try {
                const logs = await client.getLogs({
                    address: CTF_EXCHANGE,
                    event: ORDER_FILLED_ABI,
                    args: { maker: TRADER_ADDRESS as `0x${string}` },
                    fromBlock,
                    toBlock: currentBlock
                });

                if (logs.length > 0) {
                    const batch = logs.map(log => {
                        const mAsset = log.args.makerAssetId?.toString();
                        const tAsset = log.args.takerAssetId?.toString();
                        const mAmount = Number(log.args.makerAmountFilled);
                        const tAmount = Number(log.args.takerAmountFilled);

                        const isBuy = mAsset === "0";
                        const assetId = isBuy ? tAsset : mAsset;
                        const price = isBuy ? (mAmount / tAmount) : (tAmount / mAmount);
                        const size = isBuy ? (tAmount / 1e6) : (mAmount / 1e6);

                        return {
                            proxyWallet: TRADER_ADDRESS,
                            side: isBuy ? "BUY" : "SELL", 
                            asset: assetId,
                            size: size,
                            price: parseFloat(price.toFixed(4)),
                            transactionHash: log.transactionHash,
                            blockNumber: log.blockNumber?.toString()
                        };
                    });
                    allTrades = [...allTrades, ...batch];
                }

                currentBlock = fromBlock - 1n;
                if (currentBlock < 55000000n) break;
                await sleep(200); // More aggressive sleep to avoid 429
            } catch (err: any) {
                if (err.message?.includes('429')) {
                    console.log("⚠️ Rate limited. Sleeping for 10s...");
                    await sleep(10000);
                } else {
                    throw err;
                }
            }
        }

        const fileContent = `export const trawlData = {
    address: "${TRADER_ADDRESS}",
    recoveredCount: ${allTrades.length},
    trades: ${JSON.stringify(allTrades, null, 4)}
};`;

        if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        fs.writeFileSync(OUTPUT_FILE_TRAWL, fileContent);

        console.log(`✅ Deep Trawl Complete! ${allTrades.length} High-Fidelity trades archived.`);

    } catch (error) {
        console.error("❌ Trawl failed:", error);
    }
}

deepTrawl();
