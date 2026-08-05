export default {
  props: [
    'pixKey',
    'pixKeyOwnerName',
    'pixKeyOwnerBank',
    'totalPrice'
  ],
  data () {
    return {
      copied: false
    }
  },
  methods: {
    async copyPix () {
      if (navigator.clipboard) {
        // Strip formatting to ensure bank apps accept the phone number
        const cleanKey = String(this.pixKey).replace(/\D/g, '')
        await navigator.clipboard.writeText(cleanKey)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2500)
      }
    }
  },
  computed: {
    formattedPixKey () {
      const clean = String(this.pixKey).replace(/\D/g, '')
      if (clean.length === 11) {
        return `(${clean.substring(0, 2)}) ${clean.substring(2, 7)}-${clean.substring(7)}`
      } else if (clean.length === 10) {
        return `(${clean.substring(0, 2)}) ${clean.substring(2, 6)}-${clean.substring(6)}`
      }
      return this.pixKey
    }
  },
  template: `
    <div class="flex flex-col gap-6 text-left">

      <!-- Main Payment Card -->
      <div class="bg-dark-850 p-4 sm:p-5 rounded-2xl border border-white/5 shadow-inner space-y-4">
        
        <!-- Header -->
        <div class="flex items-center gap-3 border-b border-white/5 pb-3">
          <div class="w-10 h-10 rounded-xl bg-fire-500/10 flex items-center justify-center text-fire-400">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h3 class="text-sm font-bold text-white leading-tight">Dados para Transferência</h3>
            <p class="text-[11px] text-gray-400">Copie a chave e faça o pagamento manual</p>
          </div>
        </div>

        <!-- Beneficiary & Value Details -->
        <div class="bg-white/5 p-3.5 sm:p-4 rounded-xl border border-white/5 space-y-2 text-xs">
          <div class="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
            <span>Valor a pagar:</span>
            <span class="font-black text-lg text-white">R$ {{ totalPrice }}</span>
          </div>
          <div class="flex justify-between items-center text-gray-400" :class="{ 'border-b border-white/5 pb-2': pixKeyOwnerBank }">
            <span>Beneficiário:</span>
            <span class="font-bold text-white text-right">{{ pixKeyOwnerName }}</span>
          </div>
          <div v-if="pixKeyOwnerBank" class="flex justify-between items-center text-gray-400">
            <span>Banco de destino:</span>
            <span class="font-bold text-white text-right">{{ pixKeyOwnerBank }}</span>
          </div>
        </div>

        <!-- Copyable Key Block -->
        <div class="flex flex-col gap-2.5">
          <span class="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Chave Pix (Celular)</span>
          <div class="flex flex-col gap-2">
            <div class="w-full px-4 py-3.5 font-mono text-lg font-black text-white select-all text-center rounded-xl border border-white/10 bg-dark-950/60 shadow-inner">
              {{ formattedPixKey }}
            </div>
            <button
              @click="copyPix()"
              type="button"
              :class="[
                'w-full py-3 rounded-xl text-sm font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center active:scale-[0.98] shadow-md',
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-fire-600 hover:bg-fire-500 text-white'
              ]">
              <span v-if="copied" class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                ✓ Copiado!
              </span>
              <span v-else class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copiar Chave Pix
              </span>
            </button>
          </div>
        </div>
      </div>

    </div>
  `
}
