import heroImage from '../assets/hero-bombeiro.jpg'

export default {
  data() {
    return {
      rifa: null,
      reloading: false,
      ticketNumbers: [],
      payData: null,
      heroImage
    }
  },
  methods: {
    async reloadRifa() {
      this.reloading = true
      this.rifa = await this.$rifa.retrieve()
      this.reloading = false
    },
    pay() {
      this.payData = {
        ticketNumbers: this.ticketNumbers,
        config: this.rifa.config
      }
      this.ticketNumbers = []
    },
    async payFinished() {
      this.payData = null
      await this.reloadRifa()
    }
  },
  computed: {
    stats() {
      if (!this.rifa) return {}
      const total = this.rifa.config.ticketTotal
      const statusEntries = Object.values(this.rifa.ticketsStatus)
      const sold = statusEntries.filter(s => s === 'PAGO').length
      const pending = statusEntries.filter(s => s === 'EM ABERTO').length
      const available = total - sold - pending
      return { total, sold, pending, available }
    }
  },
  async mounted() {
    this.rifa = await this.$rifa.retrieve()
  },
  template: `
    <pay
      v-if="payData"
      :data="payData"
      @finished="payFinished()" />

    <!-- Loading state -->
    <div
      v-if="rifa === null"
      class="min-h-dvh flex items-center justify-center">
      <div class="flex flex-col items-center gap-4 animate-fade-in">
        <div class="w-12 h-12 border-4 border-fire-500 border-t-transparent rounded-full animate-spin-slow"></div>
        <p class="text-gray-400 text-sm tracking-wide">Carregando rifa...</p>
      </div>
    </div>

    <!-- Main content -->
    <div
      v-else
      class="min-h-dvh flex flex-col">

      <!-- Hero Section -->
      <div class="relative overflow-hidden w-full aspect-square max-w-lg mx-auto rounded-b-3xl shadow-xl">
        <!-- Background image -->
        <div class="absolute inset-0">
          <img
            :src="heroImage"
            alt="Bombeiro Militar"
            class="w-full h-full object-cover object-top transform scale-150 origin-[center_25%]" />
          <div class="absolute inset-0 hero-vignette"></div>
        </div>

        <!-- Hero content -->
        <div class="absolute inset-0 z-10 px-4 pt-6 pb-6 text-center flex flex-col justify-between items-center">
          <div class="w-full">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black bg-fire-500/90 text-white uppercase tracking-widest mb-2 shadow-sm">Rifa Online</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
            {{ rifa.config.title }}
          </h1>
        </div>
      </div>

      <!-- Prizes & Rules Card (Below the Image) -->
      <div class="px-4 pt-4 pb-2 max-w-lg mx-auto w-full flex flex-col gap-4 animate-fade-in">
        <!-- Glassmorphic Card for Prizes -->
        <div class="glass-dark border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden w-full">
          <!-- Glow Accents -->
          <div class="absolute -top-10 -left-10 w-24 h-24 bg-fire-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div class="absolute -bottom-10 -right-10 w-24 h-24 bg-gold-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <!-- Subtitle -->
          <div class="text-[10px] text-fire-400 uppercase tracking-widest font-extrabold text-center mb-3.5">
            Premiação
          </div>
          
          <!-- Prêmio Único -->
          <div class="relative flex flex-col items-center justify-center p-4 rounded-xl text-center overflow-hidden" style="background: linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,165,0,0.08) 50%, rgba(255,215,0,0.12) 100%); border: 1.5px solid rgba(255,200,0,0.45); box-shadow: 0 0 18px rgba(255,200,0,0.18);">
            <!-- Brilho de fundo -->
            <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%, rgba(255,215,0,0.10) 0%, transparent 70%);pointer-events:none;"></div>
            <span class="text-4xl mb-1" style="filter:drop-shadow(0 0 8px rgba(255,200,0,0.6));">🏆</span>
            <span class="text-[11px] font-extrabold uppercase tracking-widest mt-1" style="color:rgba(255,215,0,0.75);">Prêmio</span>
            <span class="font-black mt-1.5" style="font-size:1.65rem;line-height:1.1;background:linear-gradient(90deg,#FFD700,#FFA500,#FFD700);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;filter:drop-shadow(0 1px 6px rgba(255,180,0,0.5));">R$ 600</span>
            <span class="text-[10px] font-semibold mt-2" style="color:rgba(255,215,0,0.55);">para o bilhete sorteado</span>
          </div>
          
          <div class="text-center mt-4 text-xs text-gray-300 font-semibold leading-relaxed">
            🎯 Um único ganhador leva <strong style="color:#FFD700;">R$ 600</strong> em dinheiro!
          </div>
        </div>
        
        <!-- Info & Price Row -->
        <div class="flex flex-col items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
          <!-- Sorteio 100% Seguro -->
          <span class="flex items-center gap-2 text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
            <svg class="w-4 h-4 text-fire-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Sorteio 100% Seguro
          </span>

          <!-- Price Badge -->
          <div class="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-fire-600 via-fire-700 to-ember-700 shadow-md shadow-fire-900/40 w-full max-w-xs">
            <span class="text-fire-200 text-xs font-semibold">Valor do Bilhete</span>
            <span class="text-white text-xl font-black">R$\{{ rifa.config.ticketPrice }}</span>
          </div>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="px-4 py-3 max-w-lg mx-auto w-full">
        <div class="glass-dark flex items-center justify-around py-3 px-2 text-center">
          <div>
            <div class="text-lg font-bold text-white">{{ stats.available }}</div>
            <div class="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Disponíveis</div>
          </div>
          <div class="w-px h-8 bg-white/10"></div>
          <div>
            <div class="text-lg font-bold text-gold-400">{{ stats.pending }}</div>
            <div class="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Aguardando</div>
          </div>
          <div class="w-px h-8 bg-white/10"></div>
          <div>
            <div class="text-lg font-bold text-grove-400">{{ stats.sold }}</div>
            <div class="text-[10px] text-gray-500 uppercase tracking-wider font-medium">Pagos</div>
          </div>
        </div>
      </div>

      <!-- Section header -->
      <div class="px-4 pt-2 pb-3 max-w-lg mx-auto w-full">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Selecione os bilhetes
          </h2>
          <button
            @click="reloadRifa()"
            :disabled="reloading"
            class="flex items-center gap-1.5 text-xs font-medium text-fire-400 hover:text-fire-300 disabled:opacity-40 transition-colors cursor-pointer">
            <svg :class="['w-3.5 h-3.5', { 'animate-spin-slow': reloading }]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {{ reloading ? 'Atualizando...' : 'Atualizar' }}
          </button>
        </div>
      </div>

      <!-- Ticket grid -->
      <div class="px-4 pb-32 max-w-lg mx-auto w-full flex-1">
        <div class="grid grid-cols-4 gap-1.5">
          <ticket
            v-for="ticketNumber in new Array(rifa.config.ticketTotal).fill().map((_, i) => i+1)"
            :key="ticketNumber"
            :tickets-status="rifa.ticketsStatus"
            :ticket-number="ticketNumber"
            :value="ticketNumber"
            v-model="ticketNumbers" />
        </div>
      </div>
    </div>

    <!-- Floating pay action -->
    <pay-action
      v-if="ticketNumbers.length > 0"
      :ticketNumbers="ticketNumbers"
      :ticketPrice="rifa.config.ticketPrice"
      @click="pay()" />
  `
}
