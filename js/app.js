class BLEDevice{constructor(e,t,a,n,i){if(this.namePrefix=e,this.writeServiceUuid=t,this.notifyServiceUuid=a,this.writeCharUuid=n,this.notifyCharUuid=i,this.deviceName="",this.server=null,this.writeChar=null,this.notifyChar=null,this.constructor==BLEDevice)throw new Error("Abstract classes can't be instantiated.")}async connect(){try{if(void 0!==navigator.bluetooth.getDevices){const e=await navigator.bluetooth.getDevices();e&&e.length>0&&(this.device=self.devices.find((e=>e.name&&e.name.startsWith(this.namePrefix))))}this.device||(this.device=await navigator.bluetooth.requestDevice({filters:[{namePrefix:this.namePrefix}],optionalServices:[this.writeServiceUuid,this.notifyServiceUuid]})),this.deviceName=this.device.name,console.log(`Connecting to device ${this.device.name}`),this.server=await this.device.gatt.connect();const e=await this.server.getPrimaryService(this.writeServiceUuid),t=await this.server.getPrimaryService(this.notifyServiceUuid);this.writeChar=await e.getCharacteristic(this.writeCharUuid),this.notifyChar=await t.getCharacteristic(this.notifyCharUuid),await this.notifyChar.startNotifications(),await this.notifyChar.addEventListener("characteristicvaluechanged",this.read.bind(this)),this.onConnect(),this.device.addEventListener("gattserverdisconnected",this.onServerDisconnected.bind(this))}catch(e){this.onError(e)}}async write(e){await this.writeChar.writeValue(e)}async disconnect(){this.device.gatt.connected?await this.device.gatt.disconnect():console.log("Bluetooth Device is already disconnected"),this.onDisconnect()}onServerDisconnected(){console.log("Disonnected from gaat server")}read(e){this.onData(e.target.value)}onConnect(){console.log(`Connected to ${this.device.name}`)}onDisconnect(){console.log(`Disonnected from ${this.device.name}`)}onData(e){console.log(e)}onError(e){console.error(e)}}const NAME_PREFIX="RNG-SYNC",WRITE_SERVICE_UUID="00000001-0000-1000-8000-00805f9b34fb",NOTIFY_SERVICE_UUID="00000001-0000-1000-8000-00805f9b34fb",WRITE_CHAR_UUID="00000002-0000-1000-8000-00805f9b34fb",NOTIFY_CHAR_UUID="00000003-0000-1000-8000-00805f9b34fb",HEART_BEAT_INTERVAL=1e4;class RNGSyNC extends BLEDevice{constructor(){super("RNG-SYNC",WRITE_SERVICE_UUID,NOTIFY_SERVICE_UUID,WRITE_CHAR_UUID,NOTIFY_CHAR_UUID),this.partialData="",this.onDataTimer=null,this.isV3=!0,this.lastWriteTime=0,this.heartBeatTimer=null}async start(){await this.connect()}async stop(){await this.disconnect()}onConnect(){super.onConnect(),this.detectVersion(),document.querySelectorAll(".hide").forEach((e=>{e.classList.remove("hidden")})),document.querySelector("#search").classList.add("hidden"),document.querySelector(".tab.active").click()}onDisconnect(){super.onDisconnect(),document.querySelectorAll(".hide").forEach((e=>{e.classList.add("hidden")})),document.querySelector("#search").classList.remove("hidden"),clearInterval(this.heartBeatTimer)}onServerDisconnected(){this.onDisconnect(),document.querySelector("#response").textContent="Bluetooth disconnected"}detectVersion(){if(this.isV3=this.deviceName.indexOf("V3")>0,this.isV3)this.heartBeatTimer=setInterval(this.sendHearBeat.bind(this),1e4);else{const e=document.querySelector("#configure_mqtt");e.dataset.fields=e.dataset.fields.replaceAll("mqtt","mqqt")}}async sendCommand(e=""){this.isV3?this._sendCommandV3(e):this._sendCommandV2(e)}async _sendCommandV2(e=""){const t=e.match(/.{1,150}/g);var a=0;t.forEach((async e=>{setTimeout((async()=>await this._sendCommand(e)),a),a+=200}))}async _sendCommandV3(e=""){await this._sendCommand(e)}async _sendCommand(e){console.log(`writing: ${e}`);const t=new TextEncoder("utf-8");await this.writeChar.writeValue(t.encode(e)),this.lastWriteTime=Date.now()}async sendHearBeat(){this.isV3&&this.lastWriteTime>=Date.now()-1e4&&await this._sendCommand(" ")}onData(e){const t=new TextDecoder("utf-8").decode(e).replace(/(\r\n)/gm,"");if(t&&"_ack_"!=t)try{const e=JSON.parse(t);this.onFullData(e)}catch(e){this.onPartialData(t)}}onPartialData(e){this.partialData+=e;try{const e=JSON.parse(this.partialData);this.onFullData(e)}catch(t){console.log("data chunk received, length=",e.length)}clearInterval(this.onDataTimer);const t=this;this.onDataTimer=setInterval((()=>{t.partialData=""}),1e3)}onFullData(e){console.log("onFullData",e),this.partialData="","stats"==e.__command?this.renderStats(e):this.renderForm(e),"restarting"==e.__result&&(this.reloadCurrentTabAfterDelay(),document.querySelector("#tab-area").textContent="Loading..")}onError(e){document.querySelector("#response").textContent=e,super.onError(e)}async fetchData(e){document.querySelector("#tab-area").textContent="Loading..";var t={__command:"read"};e.split(",").forEach((e=>{t[e]=""})),await this.sendCommand(JSON.stringify(t))}async saveData(){document.querySelector("#response").textContent="Saving..";var e={__command:"write"};document.querySelectorAll('[data-field*="true"]').forEach((t=>{"boolean"==t.dataset.type?e[t.dataset.key]=!t.classList.contains("off"):"number"==t.dataset.type?e[t.dataset.key]=parseInt(t.value):e[t.dataset.key]=t.value})),document.querySelector("#tab-area").textContent="",await this.sendCommand(JSON.stringify(e))}async onTabClick(e){this.tabDebouce||(document.querySelectorAll(".tab").forEach((e=>e.classList.remove("active"))),e.currentTarget.classList.add("active"),"stats"==e.currentTarget.id?document.querySelector("#save").classList.add("hidden"):document.querySelector("#save").classList.remove("hidden"),this.tabDebouce=!0,await this.fetchData(e.currentTarget.dataset.fields),setTimeout((()=>{this.tabDebouce=!1}).bind(this),2e3))}renderStats(e){const t=document.getElementById("tab-area"),a=Object.keys(e).sort();t.innerHTML="";var n='<div class="grid-container">';a.forEach((t=>{"__command"!=t&&"__result"!=t&&"boolean"!=typeof e[t]&&(n+=`\n        <div class="grid-item">\n          <div class="label">${t.replaceAll("_"," ")}</div>\n          <div class="value">${e[t]}</div>\n        </div>`)})),n+='<div class="grid-item" id="container_fahrenheit"><div class="label">Fahrenheit</div></div>',n+='<div class="grid-item" id="container_load_status"><div class="label">Load Status</div></div>',n+="</div>",t.innerHTML=n,document.getElementById("container_fahrenheit").appendChild(this._getInstantToggleNode(e.fahrenheit,this.toggleFahrenheit)),document.getElementById("container_load_status").appendChild(this._getInstantToggleNode(e.load_status,this.toggleLoad)),document.querySelector("#response").textContent=e.__result}renderForm(e){const t=document.getElementById("tab-area"),a=document.querySelector(".tab.active").dataset.fields.split(","),n=Object.keys(e).sort(((e,t)=>a.indexOf(e)-a.indexOf(t)));t.innerHTML="",n.forEach((a=>{const n=e[a];var i=null;if(null==n||"__command"==a||"__result"==a||("boolean"==typeof n?i=this._getInstantToggleNode(n,this.toggleElement):"string"==typeof n?((i=document.createElement("input")).className="input",i.setAttribute("type","text"),i.setAttribute("value",n)):"number"==typeof n&&((i=document.createElement("input")).className="input",i.setAttribute("type","number"),i.setAttribute("min",1),i.setAttribute("value",n))),i){const e=document.createElement("div");e.className="input-label",e.innerText=a.replaceAll("_"," ").replaceAll("mqqt","mqtt")+":",i.dataset.field=!0,i.dataset.key=a,i.dataset.type=typeof n,t.appendChild(e),t.appendChild(i)}})),document.querySelector("#response").textContent=e.__result?e.__result+"..":""}_getInstantToggleNode(e,t){const a=document.createElement("div");return a.className="toggle"+(1==e||"on"==e?"":" off"),a.innerHTML='<div class="tab"></div>',a.onclick=t.bind(this),a}toggleElement(e){e.target.classList.toggle("off")}async toggleFahrenheit(e){this.toggleElement(e);const t=!e.currentTarget.classList.contains("off");await this.sendCommand(JSON.stringify({__command:"write",fahrenheit:t}))}async toggleLoad(e){var t=!0;if(e.currentTarget.classList.contains("off")||(t=confirm("Turn off load?\nThis may turn off your RNG SyNC device if powering through USB.")),t){this.toggleElement(e);const t=!e.currentTarget.classList.contains("off");await this.sendCommand(JSON.stringify({__command:"set_load",status:t})),this.reloadCurrentTabAfterDelay(3e3)}}reloadCurrentTabAfterDelay(e=8e3){window.setTimeout((()=>{document.querySelector(".tab.active").click()}),e)}}window.addEventListener("DOMContentLoaded",(async()=>{let e=new RNGSyNC;document.querySelector("#search").addEventListener("click",(async()=>await e.start())),document.querySelector("#disconnect").addEventListener("click",(async()=>await e.stop())),document.querySelector("#save").addEventListener("click",(async()=>await e.saveData())),document.querySelectorAll(".tab").forEach((t=>{t.addEventListener("click",e.onTabClick.bind(e))})),window.addEventListener("beforeunload",(async()=>await e.stop()))}));
