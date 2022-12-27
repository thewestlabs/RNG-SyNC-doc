const NAME_PREFIX = 'RNG-SYNC';
const WRITE_SERVICE_UUID = '00000001-0000-1000-8000-00805f9b34fb';
const NOTIFY_SERVICE_UUID = '00000001-0000-1000-8000-00805f9b34fb';
const WRITE_CHAR_UUID = '00000002-0000-1000-8000-00805f9b34fb';
const NOTIFY_CHAR_UUID = '00000003-0000-1000-8000-00805f9b34fb';

class RNGSyNC extends BLEDevice {
  constructor() {
    super(NAME_PREFIX, WRITE_SERVICE_UUID, NOTIFY_SERVICE_UUID, WRITE_CHAR_UUID, NOTIFY_CHAR_UUID);
    this.partialData = '';
    this.onDataTimer = null
  }

  async start() {
    await this.connect();
  }

  async stop() {
    await this.disconnect();
    if (this.timer) window.clearInterval(this.timer);
  }

  async sendCommand(command = '') {
    const commands = command.match(/.{1,150}/g);
    var stepper = 0;
    commands.forEach(async (cmd) =>  {
      setTimeout(async () => await this._sendCommand(cmd) , stepper);
      stepper = stepper + 200;
    })
  }

  async _sendCommand(cmd) {
    console.log(`writing: ${cmd}`);
    const encoder = new TextEncoder('utf-8')
    await this.writeChar.writeValue(encoder.encode(cmd))
  }

  onConnect() {
    super.onConnect();
    document.querySelectorAll(".hide").forEach(node => {
      node.classList.remove('hidden');
    })
    document.querySelector('#search').classList.add('hidden');
    if (document.querySelector('.tab.active').id == 'stats') {
      document.querySelector('.tab.active').click();
    }
  }

  onDisconnect() {
    super.onDisconnect();
    document.querySelectorAll(".hide").forEach(node => {
      node.classList.add('hidden');
    })
    document.querySelector('#search').classList.remove('hidden');
  }

  onServerDisconnected() {
    this.onDisconnect();
    document.querySelector("#response").textContent = 'Bluetooth disconnected';
  }

  onData(dataView) {
    const decoder = new TextDecoder('utf-8');
    const decodedData = decoder.decode(dataView).replace(/(\r\n)/gm, "");;
    if (!decodedData) return;

    try {
      const json = JSON.parse(decodedData);
      this.onFullData(json);
    } catch (error) {
      this.onPartialData(decodedData);
    }
  }

  onPartialData(data) {
    this.partialData += data;
    try {
      const json = JSON.parse(this.partialData);
      this.onFullData(json);
    } catch (error) {
      // console.log('partial data', data, this.partialData);
    }
    clearInterval(this.onDataTimer)
    const self = this;
    this.onDataTimer = setInterval(() => { self.partialData = ''; }, 1000);
  }

  onFullData(json) {
    console.log('onFullData', json);
    this.partialData = '';
    if (json.__command == 'stats') {
      this.renderStats(json);
    } else {
      this.renderForm(json);
    }

    if (json['__result'] == 'restarting') {
      this.reloadCurrentTabAfterDelay()
      document.querySelector("#tab-area").textContent = 'Loading..';
    }
  }

  onError(exception) {
    document.querySelector("#response").textContent = exception;
    super.onError(exception);
  }

  async fetchData(fields) {
    document.querySelector("#tab-area").textContent = 'Loading..';
    var payload = {__command: 'read'};
    fields.split(",").forEach((field) => {
      payload[field] = '';
    });
    await this.sendCommand(JSON.stringify(payload));
  }

  async saveData() {
    document.querySelector("#response").textContent = 'Saving..';
    var payload = {__command: 'write'};
    document.querySelectorAll(`[data-field*="true"]`).forEach(node => {
      if (node.dataset.type == 'boolean') {
        payload[node.dataset.key] = node.classList.contains('off') ? false : true;
      } else if (node.dataset.type == 'number') {
        payload[node.dataset.key] = parseInt(node.value);
      } else {
        payload[node.dataset.key] = node.value;
      }
    })
    document.querySelector("#tab-area").textContent = '';
    await this.sendCommand(JSON.stringify(payload));
  }

  async onTabClick(event) {
    if (this.tabDebouce) return;
    document.querySelectorAll(".tab").forEach((tab ) => tab.classList.remove("active"))
    event.currentTarget.classList.add("active");
    if (event.currentTarget.id == 'stats') {
      document.querySelector("#save").classList.add('hidden')
    } else {
      document.querySelector("#save").classList.remove('hidden')
    }
    this.tabDebouce = true;
    await this.fetchData(event.currentTarget.dataset.fields);
    setTimeout((() => { this.tabDebouce = false }).bind(this), 2000);
  }

  renderStats(json) {
    const tab = document.getElementById('tab-area');
    tab.innerHTML = '';
    const keys = Object.keys(json).sort();
    
    var html = '<div class="grid-container">';

    keys.forEach(key => {
      if (key != '__command' && key != '__result' && typeof json[key] != 'boolean') {
        html += `
        <div class="grid-item">
          <div class="label">${key.replaceAll('_', ' ')}</div>
          <div class="value">${json[key]}</div>
        </div>`;
      }
    });

    html += '<div class="grid-item" id="container_fahrenheit"><div class="label">Fahrenheit</div></div>';
    html += '<div class="grid-item" id="container_load_status"><div class="label">Load Status</div></div>';
    html += "</div>";
    tab.innerHTML = html;

    document.getElementById('container_fahrenheit').appendChild(
      this._getInstantToggleNode(json['fahrenheit'], this.toggleFahrenheit)
    );
    document.getElementById('container_load_status').appendChild(
      this._getInstantToggleNode(json['load_status'], this.toggleLoad)
    );
    document.querySelector("#response").textContent = json['__result'];
  }

  renderForm(json) {
    const tab = document.getElementById('tab-area');
    const sortOrder = document.querySelector('.tab.active').dataset.fields.split(',');
    const keys = Object.keys(json).sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
    tab.innerHTML = '';

    keys.forEach(key => {
      const val = json[key];
      var node = null;
      if (val == undefined || key == '__command' || key == '__result') {
        // do nothing
      } else if (typeof val == 'boolean') {
        node = this._getInstantToggleNode(val, this.toggleElement);
      } else if (typeof val == 'string') {
        node = document.createElement('input');
        node.className = 'input';
        node.setAttribute('type', 'text');
        node.setAttribute('value', val);
      } else if (typeof val == 'number') {
        node = document.createElement('input');
        node.className = 'input';
        node.setAttribute('type', 'number');
        node.setAttribute('min', 1);
        node.setAttribute('value', val);
      }
      if (node) {
        const label = document.createElement('div');
        label.className = 'input-label';
        label.innerText = key.replaceAll('_', ' ') + ':';
        node.dataset.field = true;
        node.dataset.key = key;
        node.dataset.type = typeof val;
        tab.appendChild(label);
        tab.appendChild(node);
      }
    });
    document.querySelector("#response").textContent = json['__result'] ?  json['__result'] + ".." : '';
  }

  _getInstantToggleNode(val, callback) {
    const node = document.createElement('div');
    node.className = 'toggle' + ((val == true || val == 'on') ? '' : ' off');
    node.innerHTML = '<div class="tab"></div>';
    node.onclick = callback.bind(this);
    return node;
  }

  toggleElement(event) {
    event.target.classList.toggle('off');
  }

  async toggleFahrenheit(event) {
      this.toggleElement(event);
      const val = !event.currentTarget.classList.contains('off');
      await this.sendCommand(JSON.stringify({'__command': 'write', 'fahrenheit': val}));
  }

  async toggleLoad(event) {
    var commit = true;
    if (!event.currentTarget.classList.contains('off')) {
      commit = confirm('Turn off load?\nThis may turn off your RNG SyNC device if powering through USB.')
    }
    if (commit) {
      this.toggleElement(event);
      const val = !event.currentTarget.classList.contains('off');
      await this.sendCommand(JSON.stringify({'__command': 'set_load', 'status': val}));
      this.reloadCurrentTabAfterDelay(3000);
    }
  }

  reloadCurrentTabAfterDelay(delay = 8000) {
    window.setTimeout(() => {
      document.querySelector('.tab.active').click();
    }, delay);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  let app = new RNGSyNC();

  document.querySelector("#search").addEventListener("click", async () => await app.start());
  document.querySelector("#disconnect").addEventListener("click", async () => await app.stop());
  document.querySelector("#save").addEventListener("click", async () => await app.saveData());
  document.querySelectorAll(".tab").forEach((tab ) => {
    tab.addEventListener("click", app.onTabClick.bind(app));
  });
  window.addEventListener('beforeunload', async () => await app.stop())
});
