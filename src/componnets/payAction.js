export default {
  props: [
    'ticketNumbers',
    'ticketPrice'
  ],
  computed: {
    totalPriceVerbose () {
      return (this.ticketNumbers.length * this.ticketPrice).toFixed(2).replace('.', ',')
    }
  },
  template: `
    <div class="fixed bottom-0 left-0 right-0 z-40 p-3 animate-slide-up">
      <button class="w-full max-w-lg mx-auto flex items-center justify-between py-4 px-5 rounded-2xl bg-gradient-to-r from-fire-600 via-fire-700 to-ember-700 shadow-2xl shadow-fire-900/60 cursor-pointer animate-pulse-glow hover:from-fire-500 hover:via-fire-600 hover:to-ember-600 transition-all active:scale-[0.98]">
        <div class="flex flex-col items-start">
          <span class="text-fire-200 text-xs font-medium">{{ ticketNumbers.length }} bilhete{{ ticketNumbers.length > 1 ? 's' : '' }} selecionado{{ ticketNumbers.length > 1 ? 's' : '' }}</span>
          <span class="text-white text-lg font-black">R$\{{ totalPriceVerbose }}</span>
        </div>
        <div class="flex items-center gap-2 text-white font-bold text-sm">
          Pagar com Pix
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </button>
    </div>
  `
}
