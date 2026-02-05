import React from 'react';

export function TraderDashboard({ data }: { data: any }) {
  if (!data) return <div>No data found.</div>;

  const { stats, positions, trades, address } = data;

  return (
    <div className="not-prose space-y-8 my-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Trades</div>
          <div className="text-2xl font-bold mt-1">{stats.totalTradesFetched || stats.totalTrades || 0}</div>
        </div>
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Positions</div>
          <div className="text-2xl font-bold mt-1">{stats.activePositions}</div>
        </div>
        <div className="p-4 rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active PnL</div>
          <div className={`text-2xl font-bold mt-1 ${(stats.totalActivePnL || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${(stats.totalActivePnL || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      {/* Active Positions */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          🎯 Active Positions
        </h3>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-3">Market</th>
                <th className="px-4 py-3 text-right">Size</th>
                <th className="px-4 py-3 text-right">Avg Price</th>
                <th className="px-4 py-3 text-right">PnL %</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {positions.slice(0, 5).map((p: any, i: number) => (
                <tr key={i} className="bg-background hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-medium truncate max-w-[200px]">{p.title}</td>
                  <td className="px-4 py-3 text-right font-mono">{p.size.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono">${p.avgPrice.toFixed(2)}</td>
                  <td className={`px-4 py-3 text-right font-bold ${p.percentPnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {p.percentPnl > 0 ? '+' : ''}{p.percentPnl.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          🕒 Recent Trades
        </h3>
        <div className="space-y-2">
          {trades.slice(-5).reverse().map((t: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-card/50 text-xs">
              <div className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded font-bold ${t.side === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {t.side}
                </span>
                <span className="font-medium truncate max-w-[150px]">{t.title}</span>
              </div>
              <div className="flex gap-4 font-mono text-muted-foreground">
                <span>{t.size} units</span>
                <span className="text-foreground">${t.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
