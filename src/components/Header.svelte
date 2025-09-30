<script>
  import { selectedDEX } from '../stores/app.js';

  let searchQuery = '';

  $: hyperliquidClasses = $selectedDEX === 'hyperliquid' 
    ? 'px-4 py-2 rounded-md text-sm font-medium transition-all bg-blue-600 text-white shadow-lg'
    : 'px-4 py-2 rounded-md text-sm font-medium transition-all text-slate-400 hover:text-white';
    
  $: lighterClasses = $selectedDEX === 'lighter'
    ? 'px-4 py-2 rounded-md text-sm font-medium transition-all bg-purple-600 text-white shadow-lg'
    : 'px-4 py-2 rounded-md text-sm font-medium transition-all text-slate-400 hover:text-white';
</script>

<header class="bg-black bg-opacity-20 backdrop-blur-xl border-b border-slate-700 border-opacity-30 px-6 py-4">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-6">
      <!-- Logo -->
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center font-bold text-sm">
          H
        </div>
        <span class="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          HyperTrader
        </span>
      </div>
      
      <!-- DEX Selector -->
      <div class="flex bg-slate-800 bg-opacity-50 rounded-lg p-1">
        <button
          on:click={() => selectedDEX.set('hyperliquid')}
          class={hyperliquidClasses}
        >
          Hyperliquid
        </button>
        <button
          on:click={() => selectedDEX.set('lighter')}
          class={lighterClasses}
        >
          Lighter
        </button>
      </div>
    </div>

    <!-- Right side controls -->
    <div class="flex items-center gap-4">
      <!-- Search -->
      <div class="relative">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search assets..."
          class="bg-slate-800 bg-opacity-50 border border-slate-700 border-opacity-30 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 focus:border-transparent"
        />
      </div>

      <button class="p-2 rounded-lg bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5z M9 19c-5 0-8-3-8-6 0-3.5 2.2-6.5 6-7M9 19c5 0 8-3 8-6 0-3.5-2.2-6.5-6-7"></path>
        </svg>
      </button>

      <button class="p-2 rounded-lg bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
        </svg>
      </button>

      <div class="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
    </div>
  </div>
</header>