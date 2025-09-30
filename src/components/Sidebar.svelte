<script>
  import { selectedTab, showBalance, totalBalance, balanceChange } from '../stores/app.js';

  const navItems = [
    { id: 'trade', label: 'Trade' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'positions', label: 'Positions' },
    { id: 'wallet', label: 'Wallet' },
  ];

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  function getNavClasses(itemId) {
    return $selectedTab === itemId
      ? 'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all bg-gradient-to-r from-blue-600 from-opacity-20 to-purple-600 to-opacity-20 text-white border border-blue-500 border-opacity-30'
      : 'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all text-slate-400 hover:text-white hover:bg-slate-800 hover:bg-opacity-30';
  }
</script>

<aside class="w-64 bg-black bg-opacity-20 backdrop-blur-xl border-r border-slate-700 border-opacity-30 p-6">
  <!-- Navigation -->
  <nav class="space-y-2">
    {#each navItems as item}
      <button
        on:click={() => selectedTab.set(item.id)}
        class={getNavClasses(item.id)}
      >
        {#if item.id === 'trade'}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        {:else if item.id === 'portfolio'}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 20V10M12 20V4M6 20v-6"></path>
          </svg>
        {:else if item.id === 'positions'}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        {:else if item.id === 'wallet'}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
          </svg>
        {/if}
        {item.label}
      </button>
    {/each}
  </nav>

  <!-- Balance Card -->
  <div class="mt-8 p-4 bg-gradient-to-br from-slate-800 from-opacity-30 to-slate-700 to-opacity-30 rounded-lg border border-slate-600 border-opacity-30">
    <div class="flex items-center justify-between mb-2">
      <span class="text-sm text-slate-400">Total Balance</span>
      <button on:click={() => showBalance.update(show => !show)}>
        {#if $showBalance}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"></path>
          </svg>
        {:else}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m9.88 9.88a3 3 0 1 0 4.24 4.24 M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a13.16 13.16 0 0 1-1.67 2.68"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m15 9-6 6"></path>
          </svg>
        {/if}
      </button>
    </div>
    
    <div class="text-2xl font-bold mb-1">
      {$showBalance ? formatCurrency($totalBalance) : '••••••'}
    </div>
    
    <div class="text-sm text-green-400 flex items-center gap-1">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>
      {$showBalance ? `+${formatCurrency($balanceChange.amount)} (${$balanceChange.percent}%)` : '••••••'}
    </div>
  </div>
</aside>