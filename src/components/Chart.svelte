<script>
  import { onMount } from 'svelte';
  import { selectedAsset, assets, infoClient } from '../stores/app.js';

  export let type = 'price'; // 'price' or 'portfolio'

  let chartContainer;
  let selectedTimeframe = '1D';
  let chartData = [];
  let loading = false;
  let hoveredPoint = null;

  const timeframes = ['1H', '4H', '1D', '1W', '1M'];

  $: currentAsset = $assets.find(a => a.symbol === $selectedAsset);

  // map UI timeframe -> API interval string
  function mapTimeframe(tf) {
    switch (tf) {
      case '1H': return '1h';
      case '4H': return '4h';
      case '1D': return '1d';
      case '1W': return '1w';
      case '1M': return '1M';
      default: return '1h';
    }
  }

  // Get lookback time in milliseconds based on timeframe
  function getLookbackTime(tf) {
    const hour = 1000 * 60 * 60;
    const day = hour * 24;
    
    switch (tf) {
      case '1H': return hour * 24; // 24 hours
      case '4H': return day * 7; // 1 week
      case '1D': return day * 30; // 1 month
      case '1W': return day * 90; // 3 months
      case '1M': return day * 365; // 1 year
      default: return hour * 24;
    }
  }

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

  $: getTimeframeClasses = (timeframe) => {
  const isSelected = selectedTimeframe === timeframe;
  return isSelected
    ? 'px-3 py-1 rounded-lg text-sm transition-colors bg-blue-600 text-white'
    : 'px-3 py-1 rounded-lg text-sm transition-colors bg-slate-800 bg-opacity-50 hover:bg-slate-700 hover:bg-opacity-50';
};

  function drawChart() {
    if (!chartContainer) return;

    const canvas = chartContainer.querySelector('canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    if (!chartData.length) {
      // Draw "no data" message
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('No data available', width / 2, height / 2);
      return;
    }

    // Set up dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Calculate min/max values
    const values = type === 'price' ? chartData.map(d => d.price) : chartData.map(d => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1; // Avoid division by zero

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
    
    // Complete the line drawing
    ctx.strokeStyle = type === 'price' ? 'rgba(59, 130, 246, 1)' : 'rgba(16, 185, 129, 1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw hover indicator if hovering
    if (hoveredPoint !== null && hoveredPoint < chartData.length) {
      const point = chartData[hoveredPoint];
      const value = type === 'price' ? point.price : point.value;
      const x = padding + (hoveredPoint / (chartData.length - 1)) * chartWidth;
      const y = padding + (1 - (value - minValue) / valueRange) * chartHeight;

      // Draw vertical line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      // Draw dot
      ctx.beginPath();
      ctx.fillStyle = type === 'price' ? 'rgba(59, 130, 246, 1)' : 'rgba(16, 185, 129, 1)';
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function handleMouseMove(e) {
    if (!chartData.length) return;

    const canvas = chartContainer.querySelector('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const padding = 40;
    const chartWidth = rect.width - padding * 2;

    // Calculate which data point we're hovering over
    const relativeX = Math.max(0, Math.min(1, (x - padding) / chartWidth));
    const index = Math.round(relativeX * (chartData.length - 1));
    
    hoveredPoint = Math.max(0, Math.min(chartData.length - 1, index));
  }

  function handleMouseLeave() {
    hoveredPoint = null;
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  async function loadChartData() {
    if (!currentAsset) {
      console.log('No current asset');
      return;
    }

    loading = true;
    
    try {
      const interval = mapTimeframe(selectedTimeframe);
      const lookback = getLookbackTime(selectedTimeframe);
      const startTime = Date.now() - lookback;
      
      // console.log('Loading chart data for', currentAsset.symbol, 'interval:', interval, 'lookback:', lookback / (1000 * 60 * 60), 'hours');

      const snapshot = await infoClient.candleSnapshot({
        coin: currentAsset.symbol,
        interval,
        startTime,
      });

      // console.log('Snapshot response:', snapshot);

      // Handle different response structures
      const candles = snapshot?.candles || snapshot || [];
      
      if (!candles.length) {
        console.warn('No candles in response');
        chartData = [];
        return;
      }

      chartData = candles.map(c => ({
        time: new Date(c.t || c.T || c.time),
        price: parseFloat(c.c || c.close),
        open: parseFloat(c.o || c.open),
        high: parseFloat(c.h || c.high),
        low: parseFloat(c.l || c.low),
        volume: parseFloat(c.v || c.volume || 0),
      }));

      // console.log('Processed chart data:', chartData.length, 'points');
      
      // Trigger chart redraw
      drawChart();
    } catch (err) {
      console.error('Error fetching chart data:', err);
      chartData = [];
    } finally {
      loading = false;
    }
  }

  // Load once on mount
  onMount(() => {
    loadChartData();
  });

  // Reload whenever asset or timeframe changes
  $: if (currentAsset && selectedTimeframe) {
    loadChartData();
  }

  // Update last data point with current price from assets store
  // $: if (chartData.length && currentAsset?.price) {
  //   // Update the last point with the current live price
  //   const updatedData = [...chartData];
  //   updatedData[updatedData.length - 1] = {
  //     ...updatedData[updatedData.length - 1],
  //     price: currentAsset.price,
  //   };
  //   chartData = updatedData;
  // }

  // Redraw chart when data changes
  // $: if (chartData.length && chartContainer) {
  //   drawChart();
  // }

  // Redraw when hovering
  $: if (hoveredPoint !== null) {
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
          <span class="text-2xl font-bold">
            {#if hoveredPoint !== null && chartData[hoveredPoint]}
              {formatPrice(chartData[hoveredPoint].price)}
            {:else}
              {formatPrice(currentAsset?.price || 0)}
            {/if}
          </span>
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
        {#if hoveredPoint !== null && chartData[hoveredPoint]}
          <div class="text-sm text-slate-400 mt-1">
            {formatDateTime(chartData[hoveredPoint].time)}
          </div>
        {/if}
      </div>
      
      <!-- Timeframe Selector -->
      <div class="flex gap-2">
        {#each timeframes as timeframe}
          <button
            on:click={() => { selectedTimeframe = timeframe; }}
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
  <div class="w-full h-64 relative" bind:this={chartContainer}>
    <canvas 
      width="800" 
      height="256"
      class="w-full h-full cursor-crosshair"
      on:mousemove={handleMouseMove}
      on:mouseleave={handleMouseLeave}
    ></canvas>
    <!-- {#if loading}
      <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
        <span class="text-white">Loading...</span>
      </div>
    {/if} -->
  </div>
</div>