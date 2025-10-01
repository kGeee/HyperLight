<script>
  import { selectedAsset, assets, refreshPrices } from '../stores/app.js';
  import { onMount } from 'svelte';

  

  
  const assetList = ['BTC', 'ETH', 'SOL', 'XPL'];

    // fetch once on mount
  onMount(() => {
    
    refreshPrices();
    const interval = setInterval(refreshPrices, 5000); // refresh every 5s
    return () => clearInterval(interval);
  });


  

  function formatPrice(price) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(price);
    }

  function formatPercent(change) {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change}%`;
  }

  function getAssetClasses(assetSymbol) {
    return $selectedAsset === assetSymbol
      ? 'w-full p-4 rounded-lg transition-all bg-gradient-to-r from-blue-600 from-opacity-20 to-purple-600 to-opacity-20 border border-blue-500 border-opacity-30'
      : 'w-full p-4 rounded-lg transition-all hover:bg-slate-800 hover:bg-opacity-30';
  }

  
</script>

<div class="w-80 bg-black bg-opacity-10 backdrop-blur-xl border-r border-slate-700 border-opacity-30 p-6">
  <h2 class="text-lg font-semibold mb-4">Markets</h2>
  
  <div class="space-y-2">
    {#each $assets as asset}
      <button
        on:click={() => selectedAsset.set(asset.symbol)}
        class={getAssetClasses(asset.symbol)}
      >
        <div class="flex items-center justify-between">
          <!-- Asset Info -->
          <div class="flex items-center gap-3">
            <span class="text-2xl">{asset.icon}</span>
            <div class="text-left">
              <div class="font-medium">{asset.symbol}</div>
              <div class="text-sm text-slate-400">{asset.name}</div>
            </div>
          </div>
          
          <!-- Price Info -->
          <div class="text-right">
            <div class="font-medium">{formatPrice(asset.price)}</div>
            <div class="text-sm flex items-center gap-1" class:text-green-400={asset.change >= 0} class:text-red-400={asset.change < 0}>
              {#if asset.change >= 0}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
              {:else}
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
                </svg>
              {/if}
              {formatPercent(asset.change)}
            </div>
          </div>
        </div>
      </button>
    {/each}
  </div>
</div>