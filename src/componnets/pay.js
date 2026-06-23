import pixBuilder from '../pixBuilder'
import { verboseTicketNumbers } from '../utils'

export default {
  props: [
    'data'
  ],
  data () {
    return {
      name: '',
      phoneNumber: '',
      email: '',
      payData: null,
      pixURL: null,
      pixQrCode: null,
      registering: false
    }
  },
  methods: {
    async register () {
      const ticketNumbers = this.data.ticketNumbers
      this.payData = {
        ticketNumbers,
        name: this.name,
        phoneNumber: this.phoneNumber,
        email: this.requiredParams.includes('email') ? this.email : undefined
      }
      if (this.data.config.payment.key === 'bc') {
        const totalPrice = Number(ticketNumbers.length * this.data.config.ticketPrice)
        const { pixURL, pixQrCode } = await pixBuilder(
          this.data.config.pixKey,
          this.data.config.pixKeyOwnerName,
          this.data.config.pixKeyOwnerCity,
          totalPrice,
          this.pixMessage
        )
        this.pixURL = pixURL
        this.pixQrCode = pixQrCode
      }
      this.registering = true
      const result = await this.$rifa.register(this.payData)
      if (this.data.config.payment.key !== 'bc') {
        this.pixURL = result.invoice.pixURL
        this.pixQrCode = result.invoice.pixQrCode
      }
      this.registering = false
    },
    finish () {
      this.payData = null
      this.pixURL = null
      this.pixQrCode = null
      this.registering = false
      this.$emit('finished')
    }
  },
  computed: {
    pixMessage () {
      return `${this.data.config.title} bilhetes: ${this.payData.ticketNumbers}`
    },
    ticketNumbersVerbose () {
      return verboseTicketNumbers(this.data.ticketNumbers)
    },
    totalPriceVerbose () {
      return (this.data.ticketNumbers.length * this.data.config.ticketPrice).toFixed(2).replace('.', ',')
    },
    requiredParams () {
      return this.data.config.payment.requiredParams
    }
  },
  template: `
    <!-- Modal overlay -->
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
        @click="!registering && finish()"></div>

      <!-- Payment completed: PIX view -->
      <div
        v-if="payData"
        class="relative z-10 w-full sm:max-w-md bg-dark-900 border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up max-h-[90dvh] overflow-y-auto">

        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-white">Pagamento via Pix</h2>
          <button
            @click="finish()"
            :disabled="registering"
            class="text-gray-500 hover:text-white transition-colors disabled:opacity-30 cursor-pointer">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- PIX content -->
        <div v-if="pixURL && pixQrCode">
          <pix
            :pix-url="pixURL"
            :pix-qr-code="pixQrCode" />
        </div>
        <div v-else class="flex flex-col items-center gap-3 py-8">
          <div class="w-10 h-10 border-4 border-fire-500 border-t-transparent rounded-full animate-spin-slow"></div>
          <p class="text-gray-400 text-sm">Gerando cobrança Pix...</p>
        </div>

        <!-- WhatsApp -->
        <whatsapp-notify
          v-if="data.config.whatsapp && pixURL"
          :phone-number="data.config.whatsapp"
          :ticket-numbers="payData.ticketNumbers"
          :message="data.config.whatsappMessage"
          class="mt-4" />

        <!-- Registering indicator -->
        <div v-if="registering" class="flex items-center gap-2 mt-4 text-sm text-gold-400">
          <div class="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin-slow"></div>
          Registrando pedido...
        </div>

        <!-- Finish button -->
        <button
          @click="finish()"
          :disabled="registering"
          class="w-full mt-5 py-3 rounded-xl bg-fire-600 hover:bg-fire-500 text-white font-semibold text-sm transition-colors disabled:opacity-40 cursor-pointer">
          Finalizar
        </button>
      </div>

      <!-- Registration form -->
      <form
        v-else
        class="relative z-10 w-full sm:max-w-md bg-dark-900 border border-white/10 rounded-t-3xl sm:rounded-2xl p-6 animate-slide-up"
        @submit.prevent="register()">

        <h2 class="text-lg font-bold text-white mb-1">Finalizar compra</h2>
        <p class="text-sm text-gray-400 mb-1">
          Bilhetes: <span class="text-fire-300 font-medium">{{ ticketNumbersVerbose }}</span>
        </p>
        <p class="text-sm text-gray-500 mb-5">
          Total: <span class="text-white font-bold text-base">R$\{{ totalPriceVerbose }}</span>
        </p>

        <div class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Nome</label>
            <input
              v-model="name"
              type="text"
              required
              placeholder="Seu nome completo"
              class="w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-fire-500 focus:ring-1 focus:ring-fire-500/50 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Telefone</label>
            <input
              v-model="phoneNumber"
              type="text"
              required
              placeholder="(00) 00000-0000"
              class="w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-fire-500 focus:ring-1 focus:ring-fire-500/50 transition-all" />
          </div>
          <div v-if="requiredParams.includes('email')">
            <label class="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">E-mail</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="seu@email.com"
              class="w-full px-4 py-3 rounded-xl bg-dark-800 border border-white/10 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-fire-500 focus:ring-1 focus:ring-fire-500/50 transition-all" />
          </div>
        </div>

        <button
          type="submit"
          class="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r from-fire-600 to-fire-700 hover:from-fire-500 hover:to-fire-600 text-white font-bold text-sm shadow-lg shadow-fire-900/40 transition-all cursor-pointer">
          Pagar R$\{{ totalPriceVerbose }} com Pix
        </button>

        <button
          type="button"
          @click="finish()"
          class="w-full mt-3 py-2.5 rounded-xl text-gray-500 hover:text-gray-300 text-sm font-medium transition-colors cursor-pointer">
          Cancelar
        </button>
      </form>
    </div>
  `
}
