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
      <div class="relative overflow-hidden w-full aspect-square max-w-lg mx-auto">
        <!-- Background image -->
        <div class="absolute inset-0">
          <img
            :src="heroImage"
            alt="Bombeiro Militar"
            class="w-full h-full object-cover object-top transform scale-150 origin-[center_25%]" />
          <div class="absolute inset-0 hero-vignette"></div>
        </div>

        <!-- Hero content -->
        <div class="absolute inset-0 z-10 px-4 pt-6 pb-8 text-center flex flex-col justify-between items-center">
          <h1 class="text-2xl sm:text-3xl font-black text-white leading-tight">
            {{ rifa.config.title }}
          </h1>

          <!-- Price badge -->
          <div class="flex flex-col items-center gap-6">
            <span class="text-white text-sm"> {{ rifa.config.description }} </span>
            <div class="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fire-600 to-fire-700 shadow-lg shadow-fire-900/50">
              <span class="text-fire-200 text-xs font-medium">Bilhete por</span>
              <span class="text-white text-2xl font-black">R$\{{ rifa.config.ticketPrice }}</span>
            </div>
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
            <div class="text-lg font-bold text-ember-400">{{ stats.sold }}</div>
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
