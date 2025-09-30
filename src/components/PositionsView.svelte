<script>
  import { positions, assets } from '../stores/app.js';

  function closePosition(asset) {
    console.log('Closing position for:', asset);
    // Implement position closing logic
  }

  function adjustPosition(asset, action) {
    console.log(`${action} position for:`, asset);
    // Implement position adjustment logic
  }

  function getSideBadgeClasses(side) {
    return side === 'Long'
      ? 'px-2 py-1 rounded text-xs font-medium bg-green-600 bg-opacity-20 text-green-400'
      : 'px-2 py-1 rounded text-xs font-medium bg-red-600 bg-opacity-20 text-red-400';
  }

  function getPnlClasses(pnl) {
    return pnl.startsWith('+') ? 'text-green-400' : 'text-red-400';
  }
</script>

<div class="flex-1 p-6">
  <div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold">Open Positions</h3>
      <div class="flex gap-2">
        <button class="px-4 py-2 bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 rounded-lg text-sm transition-colors">
          All Positions
        </button>
        <button class="px-4 py-2 bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 rounded-lg text-sm transition-colors">
          Profitable
        </button>
        <button class="px-4 py-2 bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50 rounded-lg text-sm transition-colors">
          Losing
        </button>
      </div>
    </div>

    {#if $positions.length === 0}
      <div class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-slate-800 bg-opacity-50 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h4 class="text-lg font-semibold text-slate-400 mb-2">No Open Positions</h4>
        <p class="text-slate-500">Start trading to see your positions here</p>
      </div>
    {:else}
      <div class="space-y-4">
        {#each $positions as position}
          {@const asset = $assets.find(a => a.symbol === position.asset)}
          <div class="bg-slate-800 bg-opacity-30 rounded-lg p-4 border border-slate-700 border-opacity-30 transition-all hover:bg-slate-800 hover:bg-opacity-50">
            <div class="flex items-center justify-between">
              <!-- Position Info -->
              <div class="flex items-center gap-4">
                <span class="text-2xl">{asset?.icon}</span>
                <div>
                  <div class="font-semibold">{position.asset}/USDC</div>
                  <div class="text-sm text-slate-400 flex items-center gap-2">
                    <span class={getSideBadgeClasses(position.side)}>
                      {position.side}
                    </span>
                    <span>•</span>
                    <span>{position.size}</span>
                  </div>
                </div>
              </div>

              <!-- Position Value & PnL -->
              <div class="text-right">
                <div class="font-semibold text-lg">{position.value}</div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium {getPnlClasses(position.pnl)}">
                    {position.pnl}
                  </span>
                  <span class="text-sm font-medium {getPnlClasses(position.pnlPercent)}">
                    ({position.pnlPercent})
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-2">
                <button
                  on:click={() => adjustPosition(position.asset, 'increase')}
                  class="p-2 rounded-lg transition-colors bg-green-600 bg-opacity-20 text-green-400 hover:bg-green-600 hover:bg-opacity-30"
                  title="Increase Position"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </button>
                
                <button
                  on:click={() => adjustPosition(position.asset, 'decrease')}
                  class="p-2 rounded-lg transition-colors bg-yellow-600 bg-opacity-20 text-yellow-400 hover:bg-yellow-600 hover:bg-opacity-30"
                  title="Decrease Position"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </button>
                
                <button
                  on:click={() => closePosition(position.asset)}
                  class="p-2 rounded-lg transition-colors bg-red-600 bg-opacity-20 text-red-400 hover:bg-red-600 hover:bg-opacity-30"
                  title="Close Position"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Position Details -->
            <div class="mt-4 pt-4 border-t border-slate-700 border-opacity-30">
              <div class="grid grid-cols-4 gap-4 text-sm">
                <div>
                  <div class="text-slate-400">Entry Price</div>
                  <div class="font-medium">$2,610.45</div>
                </div>
                <div>
                  <div class="text-slate-400">Mark Price</div>
                  <div class="font-medium">${asset?.price.toLocaleString()}</div>
                </div>
                <div>
                  <div class="text-slate-400">Margin</div>
                  <div class="font-medium">$1,250.00</div>
                </div>
                <div>
                  <div class="text-slate-400">Leverage</div>
                  <div class="font-medium">5.6x</div>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>