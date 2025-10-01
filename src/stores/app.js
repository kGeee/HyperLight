import { writable } from 'svelte/store';
import * as hl from "@nktkas/hyperliquid";
// App state
export const selectedTab = writable('trade');
export const selectedDEX = writable('hyperliquid');
export const selectedAsset = writable('ETH');
export const showBalance = writable(true);

// Trading state
export const orderType = writable('market');
export const side = writable('buy');
export const amount = writable('');
export const price = writable('');

// Get asset prices
// 2. Set up client with transport
  export const infoClient = new hl.InfoClient({
    transport: new hl.HttpTransport(), // or `WebSocketTransport`
  });

// Mock data stores
export const assets = writable([
  { symbol: 'ETH', name: 'Ethereum', price: 2845.32, change: 2.34, icon: '⟠' },
  { symbol: 'BTC', name: 'Bitcoin', price: 67234.56, change: -1.23, icon: '₿' },
  { symbol: 'SOL', name: 'Solana', price: 142.67, change: 5.67, icon: '◎' },
  { symbol: 'XPL', name: 'Plasma', price: 1.234, change: 3.45, icon: '🔷' },
]);

export async function refreshPrices() {
  try {
    const allMids = await infoClient.allMids(); // your function that returns { BTC: 67000, ETH: 2850, ... }

    assets.update(current =>
      current.map(asset => {
        const newPrice = allMids[asset.symbol];
        return newPrice
          ? { ...asset, price: newPrice }
          : asset;
      })
    );
  } catch (err) {
    console.error('Failed to fetch prices:', err);
  }
}

export async function getL2Book(){
  try {
    const res = await infoClient.l2Book({ coin: "ETH", nSigFigs: 4 });
    console.log('L2 book bids:', res.levels[0]);
    console.log('L2 book asks:', res.levels[1]);
  } catch (err) {
    console.error('Failed to fetch prices:', err);
  }
}


export const positions = writable([
  { asset: 'ETH', size: '2.45', value: '$6,970.03', pnl: '+$234.67', pnlPercent: '+3.48%', side: 'Long' },
  { asset: 'BTC', size: '0.15', value: '$10,085.18', pnl: '-$125.34', pnlPercent: '-1.23%', side: 'Long' },
]);

export const totalBalance = writable(27945.67);
export const balanceChange = writable({ amount: 1234.56, percent: 4.63 });

// Chart data generators
// export const generateChartData = (points = 24) => {
//   const a = infoClient.candleSnapshot({
//     coin: 'ETH',
//     interval: '1h',
//     startTime: Date.now() - 1000 * 60 * 60 * 24,
//   });

//   console.log(a);
//   return Array.from({ length: points }, (_, i) => ({
//     time: i,
//     price: 2800 + Math.sin(i * 0.5) * 100 + Math.random() * 50,
//   }));
// };

export async function generateChartData(symbol = 'ETH', points = 24, interval = '1h') {
  try {
    const snapshot = await infoClient.candleSnapshot({
      coin:symbol,
      interval: interval,   // might be called "resolution" or "i" depending on API
      startTime: Date.now() - 1000 * 60 * 60 * 24,
    });

    // snapshot could be { candles: [...] } or just an array, depends on API
    const candles = snapshot.candles ?? snapshot; 

    return candles.map(candle => ({
      time: new Date(candle.t),        // human-readable (or keep raw ms)
      price: parseFloat(candle.c),     // closing price
    }));
  } catch (err) {
    console.error('Error fetching candles:', err);
    return [];
  }
}

export const generatePortfolioData = (points = 30) => {

   

  return Array.from({ length: points }, (_, i) => ({
    day: i,
    value: 25000 + Math.sin(i * 0.3) * 2000 + Math.random() * 1000,
  }));
};
