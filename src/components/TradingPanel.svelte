<script>
  import { orderType, side, amount, price, selectedAsset } from '../stores/app.js';

  function handleTrade() {
    console.log('Executing trade:', {
      side: $side,
      orderType: $orderType,
      amount: $amount,
      price: $price,
      asset: $selectedAsset
    });
    // Implement trade execution logic here
  }

  // Generate mock order book data
  const generateOrderBook = () => {
    const basePrice = 2845.32;
    const asks = Array.from({ length: 5 }, (_, i) => ({
      price: basePrice + (5-i) * 0.5,
      size: (Math.random() * 10).toFixed(3)
    }));
    const bids = Array.from({ length: 5 }, (_, i) => ({
      price: basePrice - (i+1) * 0.5,
      size: (Math.random() * 10).toFixed(3)
    }));
    return { asks, bids, spread: 0.50 };
  };

  $: orderBook = generateOrderBook();

  // Dynamic classes
  $: buySideClasses = $side === 'buy'
    ? 'flex-1 py-3 rounded-md font-medium transition-all bg-green-600 text-white shadow-lg'
    : 'flex-1 py-3 rounded-md font-medium transition-all text-slate-400 hover:text-white';

  $: sellSideClasses = $side === 'sell'
    ? 'flex-1 py-3 rounded-md font-medium transition-all bg-red-600 text-white shadow-lg'
    : 'flex-1 py-3 rounded-md font-medium transition-all text-slate-400 hover:text-white';

  function getOrderTypeClasses(type) {
    return $orderType === type
      ? 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all bg-slate-700 text-white'
      : 'flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all text-slate-400 hover:text-white';
  }

  $: tradeButtonClasses = $side === 'buy'
    ? 'w-full py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
    : 'w-full py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800';
</script>

<div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
  <div class="flex gap-6">
    <!-- Trading Form -->
    <div class="flex-1">
      <!-- Buy/Sell Toggle -->
      <div class="flex bg-slate-800 bg-opacity-50 rounded-lg p-1 mb-6">
        <button
          on:click={() => side.set('buy')}
          class={buySideClasses}
        >
          Buy
        </button>
        <button
          on:click={() => side.set('sell')}
          class={sellSideClasses}
        >
          Sell
        </button>
      </div>

      <!-- Order Type Selector -->
      <div class="flex bg-slate-800 bg-opacity-50 rounded-lg p-1 mb-4">
        <button
          on:click={() => orderType.set('market')}
          class={getOrderTypeClasses('market')}
        >
          Market
        </button>
        <button
          on:click={() => orderType.set('limit')}
          class={getOrderTypeClasses('limit')}
        >
          Limit
        </button>
        <button
          on:click={() => orderType.set('stop')}
          class={getOrderTypeClasses('stop')}
        >
          Stop
        </button>
      </div>

      <!-- Amount Input -->
      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-400 mb-2">Amount</label>
        <div class="relative">
          <input
            type="text"
            bind:value={$amount}
            placeholder="0.00"
            class="w-full bg-slate-800 bg-opacity-50 border border-slate-700 border-opacity-30 rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent"
          />
          <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
            {$selectedAsset}
          </span>
        </div>
      </div>

      <!-- Price Input (for limit orders) -->
      {#if $orderType === 'limit'}
        <div class="mb-4">
          <label class="block text-sm font-medium text-slate-400 mb-2">Price</label>
          <div class="relative">
            <input
              type="text"
              bind:value={$price}
              placeholder="0.00"
              class="w-full bg-slate-800 bg-opacity-50 border border-slate-700 border-opacity-30 rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent"
            />
            <span class="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              USDC
            </span>
          </div>
        </div>
      {/if}

      <!-- Trade Button -->
      <button
        on:click={handleTrade}
        class={tradeButtonClasses}
      >
        {$side === 'buy' ? 'Buy' : 'Sell'} {$selectedAsset}
      </button>
    </div>

    <!-- Order Book -->
    <div class="flex-1">
      <h4 class="font-semibold mb-4">Order Book</h4>
      <div class="space-y-1 text-sm">
        <!-- Asks (Sell Orders) -->
        <div class="space-y-1">
          {#each orderBook.asks as ask}
            <div class="flex justify-between text-red-400 px-2 py-1 rounded hover:bg-slate-800 hover:bg-opacity-30 cursor-pointer transition-colors">
              <span>{ask.price.toFixed(2)}</span>
              <span>{ask.size}</span>
            </div>
          {/each}
        </div>
        
        <!-- Spread -->
        <div class="border-t border-b border-slate-700 border-opacity-30 py-2 text-center text-slate-400 font-mono text-xs">
          Spread: ${orderBook.spread.toFixed(2)}
        </div>
        
        <!-- Bids (Buy Orders) -->
        <div class="space-y-1">
          {#each orderBook.bids as bid}
            <div class="flex justify-between text-green-400 px-2 py-1 rounded hover:bg-slate-800 hover:bg-opacity-30 cursor-pointer transition-colors">
              <span>{bid.price.toFixed(2)}</span>
              <span>{bid.size}</span>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>
          