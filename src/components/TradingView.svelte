<script>
  import AssetList from './AssetList.svelte';
  import Chart from './Chart.svelte';
  import TradingPanel from './TradingPanel.svelte';
</script>

<div class="flex h-full">
  <!-- Asset List -->
  <AssetList />
  
  <!-- Chart and Trading Panel -->
  <div class="flex-1 p-6 space-y-6">
    <!-- Price Chart -->
    <Chart type="price" />
    
    <!-- Trading Panel -->
    <TradingPanel />
  </div>
</div>
