<script>
  import Chart from './Chart.svelte';
  import { generatePortfolioData } from '../stores/app.js';

  const portfolioData = generatePortfolioData();
  
  const portfolioStats = [
    { label: 'Total Value', value: '$27,945.67', change: '+4.63%', positive: true },
    { label: '24h Change', value: '+$1,234.56', change: '+4.63%', positive: true },
    { label: 'Total P&L', value: '+$5,672.34', change: '+25.46%', positive: true },
    { label: 'Win Rate', value: '68.4%', change: '+2.1%', positive: true },
  ];

  const allocations = [
    { asset: 'ETH', percentage: 45.2, value: '$12,635.40', color: 'bg-blue-500' },
    { asset: 'BTC', percentage: 32.1, value: '$8,972.18', color: 'bg-orange-500' },
    { asset: 'SOL', percentage: 15.7, value: '$4,387.43', color: 'bg-purple-500' },
    { asset: 'ARB', percentage: 7.0, value: '$1,950.66', color: 'bg-cyan-500' },
  ];
</script>

<div class="flex-1 p-6">
  <!-- Portfolio Chart -->
  <Chart type="portfolio" data={portfolioData} />
  
  <!-- Portfolio Stats -->
  <div class="grid grid-cols-4 gap-6 mt-6 mb-6">
    {#each portfolioStats as stat}
      <div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
        <div class="text-sm text-slate-400 mb-2">{stat.label}</div>
        <div class="text-2xl font-bold mb-1">{stat.value}</div>
        <div class="text-sm flex items-center gap-1" class:text-green-400={stat.positive} class:text-red-400={!stat.positive}>
          {#if stat.positive}
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          {:else}
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
            </svg>
          {/if}
          {stat.change}
        </div>
      </div>
    {/each}
  </div>

  <!-- Asset Allocation -->
  <div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
    <h3 class="text-xl font-bold mb-6">Asset Allocation</h3>
    
    <div class="space-y-4">
      {#each allocations as allocation}
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-4 h-4 rounded-full {allocation.color}"></div>
            <div>
              <div class="font-semibold">{allocation.asset}</div>
              <div class="text-sm text-slate-400">{allocation.percentage}%</div>
            </div>
          </div>
          
          <div class="text-right">
            <div class="font-semibold">{allocation.value}</div>
            <div class="text-sm text-slate-400">{allocation.percentage}% of total</div>
          </div>
          
          <div class="w-32">
            <div class="bg-slate-800 rounded-full h-2">
              <div 
                class="h-2 rounded-full {allocation.color}"
                style="width: {allocation.percentage}%"
              ></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>