import { writable } from 'svelte/store';

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

// Mock data stores
export const assets = writable([
  { symbol: 'ETH', name: 'Ethereum', price: 2845.32, change: 2.34, icon: '⟠' },
  { symbol: 'BTC', name: 'Bitcoin', price: 67234.56, change: -1.23, icon: '₿' },
  { symbol: 'SOL', name: 'Solana', price: 142.67, change: 5.67, icon: '◎' },
  { symbol: 'ARB', name: 'Arbitrum', price: 1.234, change: 3.45, icon: '🔷' },
]);

export const positions = writable([
  { asset: 'ETH', size: '2.45', value: '$6,970.03', pnl: '+$234.67', pnlPercent: '+3.48%', side: 'Long' },
  { asset: 'BTC', size: '0.15', value: '$10,085.18', pnl: '-$125.34', pnlPercent: '-1.23%', side: 'Long' },
]);

export const totalBalance = writable(27945.67);
export const balanceChange = writable({ amount: 1234.56, percent: 4.63 });

// Chart data generators
export const generateChartData = (points = 24) => {
  return Array.from({ length: points }, (_, i) => ({
    time: i,
    price: 2800 + Math.sin(i * 0.5) * 100 + Math.random() * 50,
  }));
};

export const generatePortfolioData = (points = 30) => {
  return Array.from({ length: points }, (_, i) => ({
    day: i,
    value: 25000 + Math.sin(i * 0.3) * 2000 + Math.random() * 1000,
  }));
};
