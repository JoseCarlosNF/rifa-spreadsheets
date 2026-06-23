import axios from 'axios'

class Rifa {
  constructor (url) {
    this.url = url
  }

  async retrieve () {
    const response = await axios.get(this.url)
    return response.data
  }

  async register ({ ticketNumbers, name, phoneNumber }) {
    const formData = new URLSearchParams();
    formData.append('name', name);
    formData.append('phoneNumber', phoneNumber);

    // Para arrays (ticketNumbers), o Apps Script requer que você envie
    // o mesmo parâmetro múltiplas vezes para cair no `request.parameters`
    ticketNumbers.forEach(num => {
        formData.append('ticketNumber', num);
    });

    try {
      const response = await axios.post(this.url, formData, {
        headers: {
          // 2. Força o cabeçalho de formulário (é uma "Requisição Simples", não gera erro de CORS!)
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
}

export default {
  install: (app, { url }) => {
    const rifa = new Rifa(url)
    app.config.globalProperties.$rifa = rifa
  }
}
