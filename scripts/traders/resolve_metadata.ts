import fs from 'fs';
import path from 'path';

const TRADER_ADDRESS = "0x63ce342161250d705dc0b16df89036c8e5f9ba9a";
const OUTPUT_DIR = path.join(process.cwd(), "web/content/docs/lobstah-trader/trader-spotlights", TRADER_ADDRESS);
const TRAWL_FILE = path.join(OUTPUT_DIR, "polymarket-trades.ts");
const RESOLVED_FILE = path.join(OUTPUT_DIR, "resolved-trades.ts");

const GAMMA_API = "https://gamma-api.polymarket.com";

async function resolve() {
    console.log("🦞 LobstahScout: Resolving On-Chain IDs...");

    try {
        const trawlContent = fs.readFileSync(TRAWL_FILE, 'utf-8');
        
        // Let's just find the first '[' and last ']' related to trades
        const arrayStart = trawlContent.indexOf('[');
        const arrayEnd = trawlContent.lastIndexOf(']') + 1;
        
        const tradesJson = trawlContent.substring(arrayStart, arrayEnd);
        const trawlTrades = JSON.parse(tradesJson);

        console.log(`📊 Loaded ${trawlTrades.length} trades.`);

        const assetIds = Array.from(new Set(trawlTrades.map((t: any) => t.asset))).filter(a => a && a !== "0" && a !== "pending_enrichment");
        console.log(`🔍 Found ${assetIds.length} unique asset IDs. Resolving...`);

        const metadataMap = new Map();
        for (const assetId of assetIds) {
            console.log(`📡 Resolving: ${assetId}`);
            try {
                const res = await fetch(`${GAMMA_API}/markets?token_id=${assetId}`);
                const markets = await res.json();
                if (markets && markets.length > 0) {
                    const m = markets[0];
                    const tokenIds = JSON.parse(m.clobTokenIds || "[]");
                    const outcomes = JSON.parse(m.outcomes || "[]");
                    const outcomeIndex = tokenIds.indexOf(assetId);
                    
                    metadataMap.set(assetId, {
                        title: m.question,
                        outcome: outcomes[outcomeIndex] || "Unknown",
                        icon: m.icon
                    });
                }
            } catch (e) {
                console.error(`  ! Error: ${assetId}`);
            }
            await new Promise(r => setTimeout(r, 50));
        }

        const resolvedTrades = trawlTrades.map((t: any) => {
            const meta = metadataMap.get(t.asset);
            return {
                ...t,
                title: meta?.title || "Archive Market",
                outcome: meta?.outcome || "Unknown",
                icon: meta?.icon || ""
            };
        });

        const fileContent = `export const resolvedData = {
    address: "${TRADER_ADDRESS}",
    trades: ${JSON.stringify(resolvedTrades, null, 4)}
};`;

        fs.writeFileSync(RESOLVED_FILE, fileContent);
        console.log(`✅ Success! Resolved dataset at: ${RESOLVED_FILE}`);

    } catch (error) {
        console.error("❌ Resolution failed:", error);
    }
}

resolve();
