<script>
  import { orderType, side, amount, price, assets, selectedAsset, getL2Book } from '../stores/app.js';
  import { onMount } from 'svelte';

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

  const generateOrderBook = (l2Data) => {
    // l2Data structure: { coin, time, levels: [bids, asks] }
    
    if (!l2Data || !l2Data.levels || l2Data.levels.length < 2) {
      return { asks: [], bids: [], spread: 0 };
    }
    
    const bids = l2Data.levels[0]
      .map(level => ({
        price: parseFloat(level.px),
        size: parseFloat(level.sz),
        numOrders: level.n
      }))
      .sort((a, b) => b.price - a.price); // Sort descending (highest first)
    
    const asks = l2Data.levels[1]
      .map(level => ({
        price: parseFloat(level.px),
        size: parseFloat(level.sz),
        numOrders: level.n
      }))
      .sort((a, b) => a.price - b.price); // Sort ascending (lowest first)
    
    // Calculate spread (difference between best ask and best bid)
    const spread = asks.length && bids.length 
      ? parseFloat((asks[0].price - bids[0].price).toFixed(6))
      : 0;
    
    return { 
      asks, 
      bids, 
      spread: spread,
      timestamp: l2Data.time 
    };
  };

  let orderBook = { asks: [], bids: [], spread: 0 };
  let orderBookDepth = 10;
  
  $: currentAsset = $assets.find(a => a.symbol === $selectedAsset);

  const formatPrice = (price) => {
    if (price == null || isNaN(price)) return '0.00';
    if (price < 1) return price.toFixed(4);
    return price.toFixed(2);
  };

  const formatSize = (size) => {
    if (size == null || isNaN(size)) return '0.00';
    return size.toFixed(2);
  };

  // Calculate max size for bar width calculation
  $: maxSize = Math.max(
    ...orderBook.asks.slice(0, orderBookDepth).map(a => a.size || 0),
    ...orderBook.bids.slice(0, orderBookDepth).map(b => b.size || 0)
  );

  const getBarWidth = (size) => {
    if (!size || !maxSize) return 0;
    return (size / maxSize) * 100;
  };

  const loadOrderBook = async (symbol) => {
    try {
      const ob = await getL2Book(symbol);
      // console.log('Raw API response:', ob);
      orderBook = generateOrderBook(ob);
      // console.log('Processed order book:', orderBook);
    } catch (error) {
      console.error('Error loading order book:', error);
      // Reset to empty on error
      orderBook = { asks: [], bids: [], spread: 0 };
    }
  };
  
  $: if (currentAsset) {
    loadOrderBook(currentAsset.symbol);
  }

  // Dynamic classes for buy/sell buttons
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

  // Refresh order book periodically
  onMount(() => {
    const interval = setInterval(() => {
      if (currentAsset) {
        loadOrderBook(currentAsset.symbol);
      }
    }, 5000);
    return () => clearInterval(interval);
  });
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
        <!-- Asks (Sell Orders) - sellside class for red -->
        <div class="space-y-1">
          {#each orderBook.asks.slice(0, orderBookDepth).reverse() as ask}
            <div class="order-row sellside px-2 py-1 rounded hover:bg-slate-800 hover:bg-opacity-30 cursor-pointer transition-colors">
              <div class="size-bar sellside-bar" style="width: {getBarWidth(ask.size)}%"></div>
              <div class="flex justify-between relative z-10">
                <span>{formatPrice(ask.price)}</span>
                <span>{formatSize(ask.size)}</span>
              </div>
            </div>
          {/each}
        </div>
        
        <!-- Spread -->
        <div class="border-t border-b border-slate-700 border-opacity-30 py-2 text-center text-slate-400 font-mono text-xs">
          Spread: ${formatPrice(orderBook.spread)}
        </div>
        
        <!-- Bids (Buy Orders) - buyside class for green -->
        <div class="space-y-1">
          {#each orderBook.bids.slice(0, orderBookDepth) as bid}
            <div class="order-row buyside px-2 py-1 rounded hover:bg-slate-800 hover:bg-opacity-30 cursor-pointer transition-colors">
              <div class="size-bar buyside-bar" style="width: {getBarWidth(bid.size)}%"></div>
              <div class="flex justify-between relative z-10">
                <span>{formatPrice(bid.price)}</span>
                <span>{formatSize(bid.size)}</span>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .buyside {
    color: #4ade80; /* green-400 */
  }
  
  .sellside {
    color: #f87171; /* red-400 */
  }

  .order-row {
    position: relative;
    overflow: hidden;
  }

  .size-bar {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    transition: width 0.3s ease;
    opacity: 0.15;
  }

  .buyside-bar {
    background: linear-gradient(to left, #4ade80, transparent);
  }

  .sellside-bar {
    background: linear-gradient(to left, #f87171, transparent);
  }

  .order-row:hover .size-bar {
    opacity: 0.25;
  }
</style>