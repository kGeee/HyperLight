<script>
  import Header from './components/Header.svelte';
  import Sidebar from './components/Sidebar.svelte';
  import TradingView from './components/TradingView.svelte';
  import PortfolioView from './components/PortfolioView.svelte';
  import PositionsView from './components/PositionsView.svelte';
  import WalletView from './components/WalletView.svelte';
  import { selectedTab } from './stores/app.js';
</script>

<div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
  <Header />
  
  <div class="flex h-[calc(100vh-80px)]">
    <Sidebar />
    
    <main class="flex-1">
      {#if $selectedTab === 'trade'}
        <TradingView />
      {:else if $selectedTab === 'portfolio'}
        <PortfolioView />
      {:else if $selectedTab === 'positions'}
        <PositionsView />
      {:else if $selectedTab === 'wallet'}
        <WalletView />
      {/if}
    </main>
  </div>
</div>

