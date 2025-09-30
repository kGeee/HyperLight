<script>
  import { onMount } from 'svelte';
  import { selectedAsset, assets, generateChartData } from '../stores/app.js';

  export let type = 'price'; // 'price' or 'portfolio'
  export let data = [];

  let chartContainer;
  let selectedTimeframe = '1D';
  
  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  $: currentAsset = $assets.find(a => a.symbol === $selectedAsset);
  $: chartData = data.length ? data : generateChartData();

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

  function getTimeframeClasses(timeframe) {
    return selectedTimeframe === timeframe
      ? 'px-3 py-1 rounded-lg text-sm transition-colors bg-blue-600 text-white'
      : 'px-3 py-1 rounded-lg text-sm transition-colors bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50';
  }

  function drawChart() {
    if (!chartContainer) return;

    const canvas = chartContainer.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (!chartData.length) return;

    // Set up dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Calculate min/max values
    const values = type === 'price' ? chartData.map(d => d.price) : chartData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue;

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    if (type === 'price') {
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
    }

    // Draw area
    ctx.beginPath();
    chartData.forEach((point, i) => {
      const x = padding + (i / (chartData.length - 1)) * chartWidth;
      const value = type === 'price' ? point.price : point.value;
      const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    // Close the path for area fill
    const lastX = padding + chartWidth;
    const bottomY = height - padding;
    ctx.lineTo(lastX, bottomY);
    ctx.lineTo(padding, bottomY);
    ctx.closePath();
    
    // Fill area
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    chartData.forEach((point, i) => {
      const x = padding + (i / (chartData.length - 1)) * chartWidth;
      const value = type === 'price' ? point.price : point.value;
      const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.strokeStyle = type === 'price' ? '#3B82F6' : '#10B981';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  onMount(() => {
    const canvas = document.createElement('canvas');
    canvas.width = chartContainer.offsetWidth;
    canvas.height = chartContainer.offsetHeight;
    chartContainer.appendChild(canvas);
    
    drawChart();

    // Redraw on resize
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = chartContainer.offsetWidth;
      canvas.height = chartContainer.offsetHeight;
      drawChart();
    });
    resizeObserver.observe(chartContainer);

    return () => {
      resizeObserver.disconnect();
    };
  });

  $: if (chartContainer) {
    drawChart();
  }
</script>

<div class="bg-black bg-opacity-20 backdrop-blur-xl rounded-xl p-6 border border-slate-700 border-opacity-30">
  {#if type === 'price'}
    <!-- Price Chart Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-xl font-bold mb-1">{currentAsset?.symbol}/USDC</h3>
        <div class="flex items-center gap-4">
          <span class="text-2xl font-bold">{formatPrice(currentAsset?.price || 0)}</span>
          <span class="flex items-center gap-1" class:text-green-400={currentAsset?.change >= 0} class:text-red-400={currentAsset?.change < 0}>
            {#if currentAsset?.change >= 0}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path>
              </svg>
            {/if}
            {formatPercent(currentAsset?.change || 0)}
          </span>
        </div>
      </div>
      
      <!-- Timeframe Selector -->
      <div class="flex gap-2">
        {#each timeframes as timeframe}
          <button
            on:click={() => selectedTimeframe = timeframe}
            class={getTimeframeClasses(timeframe)}
          >
            {timeframe}
          </button>
        {/each}
      </div>
    </div>
  {:else}
    <!-- Portfolio Chart Header -->
    <h3 class="text-xl font-bold mb-6">Portfolio Performance</h3>
  {/if}

  <!-- Chart Container -->
  <div class="w-full h-64 relative" bind:this={chartContainer}></div>
</div>