const EM_ABERTO = 'EM ABERTO'
const DISPONIVEL = 'DISPONIVEL'
const PAGO = 'PAGO'
const TICKET_STATUS_TITLE_MAP = {
  [EM_ABERTO]: 'Reservado',
  [PAGO]: 'Pago',
  [DISPONIVEL]: ''
}

export default {
  props: [
    'modelValue',
    'value',
    'ticketsStatus',
    'ticketNumber'
  ],
  computed: {
    checked: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    status() {
      const status = this.ticketsStatus[this.ticketNumber]
      if (!status) {
        return DISPONIVEL
      }
      return status
    },
    statusTitle() {
      return TICKET_STATUS_TITLE_MAP[this.status]
    },
    statusClass() {
      if (this.status === EM_ABERTO) return 'not-paid'
      if (this.status === PAGO) return 'paid'
      return 'available'
    },
    checkedClass() {
      return this.checked.includes(this.value) ? 'checked' : ''
    },
    disabled() {
      return this.status !== DISPONIVEL
    }
  },
  template: `
    <label :class="['ticket', statusClass, checkedClass]">
      <input
        type="checkbox"
        :disabled="disabled"
        v-model="checked"
        :value="value" />
      <span class="text-xxs leading-none">{{ ticketNumber }}</span>
      <span
        v-if="statusTitle"
        class="text-xs font-medium opacity-70 leading-none mt-0.5">{{ statusTitle }}</span>
    </label>
  `
}
