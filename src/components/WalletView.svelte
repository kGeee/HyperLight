<script>
  import { totalBalance } from '../stores/app.js';

  const walletBalances = [
    { symbol: 'USDC', name: 'USD Coin', balance: 15420.67, value: 15420.67, icon: '💰' },
    { symbol: 'ETH', name: 'Ethereum', balance: 2.45, value: 6970.03, icon: '⟠' },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.15, value: 10085.18, icon: '₿' },
    { symbol: 'SOL', name: 'Solana', balance: 42.8, value: 6106.28, icon: '◎' },
  ];

  const recentTransactions = [
    { type: 'deposit', asset: 'USDC', amount: 5000, time: '2 hours ago', status: 'completed' },
    { type: 'trade', asset: 'ETH', amount: -0.5, time: '4 hours ago', status: 'completed' },
    { type: 'trade', asset: 'BTC', amount: 0.02, time: '1 day ago', status: 'completed' },
    { type: 'withdraw', asset: 'SOL', amount: -10, time: '2 days ago', status: 'completed' },
  ];

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  function formatAmount(amount, symbol) {
    if (symbol === 'USDC') {
      return formatCurrency(amount);
    }
    return `${amount.toFixed(4)} ${symbol}`;
  }

  function getTransactionIcon(type) {
    switch (type) {
      case 'deposit': return '↓';
      case 'withdraw': return '↑';
      case 'trade': return '↔';
      default: return '•';
    }
  }

  function getTransactionColorClasses(type) {
    switch (type) {
      case 'deposit': return 'text-green-400';
      case 'withdraw': return 'text-red-400';
      case 'trade': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  }

  function getAmountColorClasses(amount) {
    return amount > 0 ? 'text-green-400' : 'text-red-400';
  }
</script>

<div class="flex-1 p-6">
  <!-- Wallet Overview -->
  <div class="grid grid-cols-3 gap-6 mb-6">
    <div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
      <div class="text-sm text-slate-400 mb-2">Total Balance</div>
      <div class="text-3xl font-bold mb-2">{formatCurrency($totalBalance)}</div>
      <div class="text-sm text-green-400 flex items-center gap-1">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
        </svg>
        +4.63% (24h)
      </div>
    </div>

    <div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
      <div class="text-sm text-slate-400 mb-2">Available Balance</div>
      <div class="text-3xl font-bold mb-2">{formatCurrency(15420.67)}</div>
      <div class="text-sm text-slate-400">Ready to trade</div>
    </div>

    <div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
      <div class="text-sm text-slate-400 mb-2">In Open Positions</div>
      <div class="text-3xl font-bold mb-2">{formatCurrency(12525.00)}</div>
      <div class="text-sm text-slate-400">Margin used</div>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-6">
    <!-- Asset Balances -->
    <div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold">Assets</h3>
        <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
          Deposit
        </button>
      </div>

      <div class="space-y-4">
        {#each walletBalances as balance}
          <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 hover:bg-opacity-30 transition-colors">
            <div class="flex items-center gap-3">
              <span class="text-2xl">{balance.icon}</span>
              <div>
                <div class="font-semibold">{balance.symbol}</div>
                <div class="text-sm text-slate-400">{balance.name}</div>
              </div>
            </div>

            <div class="text-right">
              <div class="font-semibold">{formatAmount(balance.balance, balance.symbol)}</div>
              <div class="text-sm text-slate-400">{formatCurrency(balance.value)}</div>
            </div>

            <div class="flex gap-2">
              <button class="px-3 py-1 bg-slate-700 bg-opacity-50 hover:bg-slate-600 hover:bg-opacity-50 rounded text-sm transition-colors">
                Send
              </button>
              <button class="px-3 py-1 bg-slate-700 bg-opacity-50 hover:bg-slate-600 hover:bg-opacity-50 rounded text-sm transition-colors">
                Swap
              </button>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold">Recent Activity</h3>
        <button class="text-blue-400 hover:text-blue-300 text-sm transition-colors">
          View All
        </button>
      </div>

      <div class="space-y-3">
        {#each recentTransactions as tx}
          <div class="flex items-center justify-between p-3 rounded-lg hover:bg-slate-800 hover:bg-opacity-30 transition-colors">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-slate-700 bg-opacity-50 flex items-center justify-center text-sm {getTransactionColorClasses(tx.type)}">
                {getTransactionIcon(tx.type)}
              </div>
              <div>
                <div class="font-medium capitalize">{tx.type} {tx.asset}</div>
                <div class="text-sm text-slate-400">{tx.time}</div>
              </div>
            </div>

            <div class="text-right">
              <div class="font-medium {getAmountColorClasses(tx.amount)}">
                {tx.amount > 0 ? '+' : ''}{formatAmount(Math.abs(tx.amount), tx.asset)}
              </div>
              <div class="text-sm text-slate-400 capitalize">{tx.status}</div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>