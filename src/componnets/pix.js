export default {
  props: [
    'pixKey',
    'pixKeyOwnerName',
    'pixBank',
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
      <div class="bg-dark-850 p-5 rounded-2xl border border-white/5 shadow-inner space-y-4">
        
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

        <!-- Copyable Key Block -->
        <div class="flex flex-col gap-1.5">
          <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Chave Pix (Celular)</span>
          <div class="flex items-stretch rounded-xl overflow-hidden border border-white/10 bg-dark-900 shadow-md">
            <div class="flex-1 min-w-0 px-3 py-3 font-mono text-base font-bold text-white select-all truncate flex items-center justify-center bg-dark-950/40">
              {{ formattedPixKey }}
            </div>
            <button
              @click="copyPix()"
              type="button"
              :class="[
                'px-4 py-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center min-w-[120px] active:scale-95',
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-fire-600 hover:bg-fire-500 text-white'
              ]">
              <span v-if="copied">✓ Copiado!</span>
              <span v-else>Copiar Chave</span>
            </button>
          </div>
        </div>

        <!-- Beneficiary & Value Details -->
        <div class="bg-white/5 p-4 rounded-xl border border-white/5 space-y-2 text-xs">
          <div class="flex justify-between items-center text-gray-400 border-b border-white/5 pb-2">
            <span>Valor a pagar:</span>
            <span class="font-black text-lg text-white">R$ {{ totalPrice }}</span>
          </div>
          <div class="flex justify-between items-center text-gray-400" :class="{ 'border-b border-white/5 pb-2': pixBank }">
            <span>Beneficiário:</span>
            <span class="font-bold text-white text-right">{{ pixKeyOwnerName }}</span>
          </div>
          <div v-if="pixBank" class="flex justify-between items-center text-gray-400">
            <span>Banco de destino:</span>
            <span class="font-bold text-white text-right">{{ pixBank }}</span>
          </div>
        </div>
      </div>

      <!-- Step-by-Step Instructions -->
      <div class="bg-dark-900/50 p-5 rounded-2xl border border-white/5 space-y-3">
        <h4 class="font-black text-xs text-gray-300 uppercase tracking-wider">Passo a Passo Simplificado:</h4>
        <div class="space-y-3 text-xs leading-relaxed text-gray-400">
          
          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-full bg-fire-500/10 text-fire-400 flex items-center justify-center font-bold text-xs shrink-0">1</span>
            <p>Clique no botão laranja <strong class="text-white">"Copiar Chave"</strong> acima para copiar o telefone de pagamento.</p>
          </div>

          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-full bg-fire-500/10 text-fire-400 flex items-center justify-center font-bold text-xs shrink-0">2</span>
            <p>Abra o <strong class="text-white">aplicativo do seu banco</strong> no celular (onde você tem dinheiro).</p>
          </div>

          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-full bg-fire-500/10 text-fire-400 flex items-center justify-center font-bold text-xs shrink-0">3</span>
            <p>Acesse o menu <strong class="text-white">Pix</strong>, vá em <strong class="text-white">Transferir / Pagar</strong> e selecione o tipo de chave como <strong class="text-white">Celular</strong>.</p>
          </div>

          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-full bg-fire-500/10 text-fire-400 flex items-center justify-center font-bold text-xs shrink-0">4</span>
            <p>Cole a chave copiada e confirme se o nome do beneficiário é <strong class="text-white">{{ pixKeyOwnerName }}</strong><span v-if="pixBank"> no banco <strong class="text-white">{{ pixBank }}</strong></span>.</p>
          </div>

          <div class="flex gap-3">
            <span class="w-6 h-6 rounded-full bg-fire-500/10 text-fire-400 flex items-center justify-center font-bold text-xs shrink-0">5</span>
            <p>Insira o valor de <strong class="text-white text-sm">R$ {{ totalPrice }}</strong> e confirme a transferência.</p>
          </div>

        </div>
      </div>

    </div>
  `
}
