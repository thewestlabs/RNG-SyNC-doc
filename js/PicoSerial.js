let usbVendorId = 0x2E8A
let ascii = ['NUL', 'SOH', 'STX', 'ETX', 'EOT', 'ENQ', '' /*ACK*/, 'BEL', 'BS', '\t', '\n', 'VT', 'FF', '', 'SO', 'SI', 'DLE', 'DC1', 'DC2', 'DC3', 'DC4', 'NAK', 'SYN', 'ETB', '' /*CAN*/, 'EM', 'SUB', 'ESC', 'FS', 'GS', 'RS', 'US']
let asciiChars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~'
for (let i = 0; i < asciiChars.length; i++) ascii.push(asciiChars[i])
ascii.push('DEL')
for (let i = 0; i < 128; i++) ascii.push('.')
window.ascii = ascii
let readHandler = null

class PicoSerial {
  constructor() {
    this.pico = null;
    this.currentRead = [];
    this.reading = false
  }

  async start() {
    if (!navigator.serial) {
      alert("Your browser doesn't support connecting to the Pico (the web serial API)")
    } else {
      this.pico = await navigator.serial.requestPort({ filters: [{ usbVendorId }] })
      if (this.pico) await this.openPico()
    }
  }


  async stop() {
    //
  }

  async openPico() {
    if (this.pico) await this.pico.open({ baudRate: 115200 })
    console.log('Pico', this.pico)
    this.onConnect()
    this.log(`[Pico connected]\n\n`)
    this.reader = this.pico.readable.getReader()
    this.writer = this.pico.writable.getWriter()
    await this.writeToPico('ls')
    setTimeout(this.readFromPico.bind(this), 10)
    this.pico.addEventListener('disconnect', this.onDisconnect)
  }

  onConnect() {
    this.clearLog()
    document.querySelectorAll(".hide").forEach(node => {
      node.classList.remove('hidden');
    })
    document.querySelector('#search').classList.add('hidden');
    // document.querySelector('#restart').classList.add('hidden');
  }

  onDisconnect() {
    console.log('disconnect')
    this.log(`\n\n[Pico disconnected]`)
    this.pico = null
    document.querySelector('#disconnect').classList.add('hidden');
    document.querySelector('#search').classList.remove('hidden');
  }

  log(message) {
    let output = document.querySelector('#log');
    output.value += message;
    output.scrollTop = output.scrollHeight
  }

  clearLog() {
    document.querySelector('#log').textContent = '';
  }

  async readFromPico () {
    this.reading = true
    try {
      while (this.reading) {
        const { value } = await this.reader.read()
        let arr = Array.from(value)
        for (let i = 0; i < arr.length; i++) {
          // deal with escape sequences (or at least, ignore them for now)
          if (arr[i] === 27) this.outputLine() // 27=ESC
          if (arr[i] === 67 && !this.currentRead.length) {
            this.currentRead.push(arr[i])
            this.outputLine()
          }
          else if (this.currentRead[0] === 27 && arr[i] === 109) { // eg ESC[0m to reset style
            this.outputLine()
          }
          else if (arr[i] === 67 && this.currentRead[0] === 27) {
            this.outputLine() // 67 = C used to escape an escape sequence(?)
          } else {
            if (arr[i] !== 6) this.currentRead.push(arr[i]) // 6=ACK
            let len = this.currentRead.length
            if (this.currentRead[len - 2] === 13 && this.currentRead[len - 1] === 10) {
              this.outputLine()
            }
          }
        }
        if (readHandler) readHandler(value)
      }
    } catch (e) {
      console.log('Read from Pico error', e)
    } finally {
      this.reader.releaseLock()
    }
  }

  outputLine () {
    if (this.currentRead[0] !== 27) {
      let text = `${ this.asciify(this.currentRead) }`
      if (text !== 'undefined') {
        this.log(`${ this.asciify(this.currentRead) }`)
      }
    } // else its an escape sequence which we ignore
    this.currentRead = []
  }

  asciify (val) {
    return val.map(v => ascii[v]).join('')
  }

  async writeToPico (data, type = 'text') {
    if (type === 'text') await this.writer.write((new TextEncoder()).encode(data + '\r'))
    else await this.writer.write(data) // Uint8Array
  }

  async restart() {
    // TODO
  }

  async saveData() {
    // TODO
  }

  async stop() {
    await this.reader.cancel();
    await this.writer.close()
    await this.pico.close()
    this.onDisconnect()
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  let app = new PicoSerial();

  document.querySelector("#search").addEventListener("click", async () => await app.start());
  document.querySelector("#disconnect").addEventListener("click", async () => await app.stop());
  // document.querySelector("#restart").addEventListener("click", async () => await app.restart());
  // document.querySelector("#save").addEventListener("click", async () => await app.saveData());
  window.addEventListener('beforeunload', async () => await app.stop())
});
