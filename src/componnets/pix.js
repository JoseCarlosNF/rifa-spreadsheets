export default {
  props: [
    'pixKey',
    'pixKeyOwnerName',
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
        await navigator.clipboard.writeText(this.pixKey)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2500)
      }
    }
  },
  template: `
    <div class="flex flex-col gap-5 text-left bg-dark-850 p-5 rounded-2xl border border-white/5 shadow-inner">
      <div class="flex items-center gap-3 border-b border-white/5 pb-3">
        <div class="w-10 h-10 rounded-xl bg-fire-500/10 flex items-center justify-center text-fire-400">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <div>
          <h3 class="text-sm font-bold text-white leading-tight">Chave Pix para Pagamento</h3>
          <p class="text-[11px] text-gray-400">Use para fazer a transferência no seu banco</p>
        </div>
      </div>

      <!-- Price Box -->
      <div class="flex flex-col gap-1">
        <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Valor Total</span>
        <span class="text-2xl font-black text-white">R$ {{ totalPrice }}</span>
      </div>

      <!-- Key Box -->
      <div class="flex flex-col gap-1.5">
        <span class="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Chave Pix</span>
        <div class="flex items-stretch rounded-xl overflow-hidden border border-white/10 bg-dark-900 shadow-md">
          <div class="flex-1 min-w-0 px-3 py-3 font-mono text-xs text-gray-200 select-all truncate flex items-center">
            {{ pixKey }}
          </div>
          <button
            @click="copyPix()"
            type="button"
            :class="[
              'px-4 py-3 text-xs font-bold transition-all cursor-pointer flex items-center justify-center min-w-[100px]',
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-fire-600 hover:bg-fire-500 text-white'
            ]">
            <span v-if="copied">✓ Copiado!</span>
            <span v-else>Copiar Chave</span>
          </button>
        </div>
      </div>

      <!-- Beneficiary Details -->
      <div v-if="pixKeyOwnerName" class="flex flex-col gap-1.5 bg-white/5 p-3 rounded-xl border border-white/5 text-xs">
        <div class="flex justify-between text-gray-400">
          <span>Beneficiário:</span>
          <span class="font-bold text-white text-right">{{ pixKeyOwnerName }}</span>
        </div>
      </div>

      <!-- Instructions -->
      <div class="text-[11px] text-gray-400 space-y-1.5 bg-dark-900/50 p-3 rounded-xl border border-white/5">
        <p class="font-bold text-gray-300">Instruções:</p>
        <ol class="list-decimal pl-4 space-y-1">
          <li>Copie a chave Pix acima.</li>
          <li>Confirme os dados do beneficiário antes de concluir.</li>
        </ol>
      </div>
    </div>
  `
}
