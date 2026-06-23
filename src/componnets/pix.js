export default {
  props: [
    'pixUrl',
    'pixQrCode'
  ],
  data () {
    return {
      copied: false
    }
  },
  methods: {
    inputOnClick (event) {
      const el = event.srcElement
      el.select()
      el.setSelectionRange(0, el.value.length)
      this.copyPix()
    },
    async copyPix () {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(this.pixUrl)
        this.copied = true
        setTimeout(() => { this.copied = false }, 2500)
      }
    }
  },
  template: `
    <div class="flex flex-col items-center gap-4">
      <!-- QR Code -->
      <div
        v-if="pixQrCode"
        class="p-4 bg-white rounded-2xl shadow-lg">
        <img
          :src="pixQrCode"
          alt="QR Code Pix"
          class="w-48 h-48 sm:w-56 sm:h-56" />
      </div>

      <!-- Copy URL -->
      <div
        v-if="pixUrl"
        class="w-full flex rounded-xl overflow-hidden border border-white/10">
        <input
          :value="pixUrl"
          @click="inputOnClick"
          readonly
          class="flex-1 min-w-0 px-3 py-2.5 bg-dark-800 text-gray-300 text-xs truncate focus:outline-none cursor-pointer" />
        <button
          @click="copyPix()"
          :class="[
            'flex-shrink-0 px-4 py-2.5 text-xs font-bold transition-all cursor-pointer',
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-fire-600 hover:bg-fire-500 text-white'
          ]">
          {{ copied ? '✓ Copiado!' : 'Copiar' }}
        </button>
      </div>
    </div>
  `
}
