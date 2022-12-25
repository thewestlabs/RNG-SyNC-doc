# RNG SyNC
RNG SyNC is a Renogy¹ RS232 compatible  WiFi and Bluetooth adapter. Checkout the product [here](https://www.tindie.com/products/27955/). Tested with Rover series charge controllers.

### Configuration
**A. Pre-installed Pico W**
  1. All pre-installed Picos come with firmware already baked into it.
  2. Power up the device by connecting to USB or RJ12 cable and configure via BLE using this webpage -> [RNG SyNC Configurator](https://thewestlabs.github.io/RNG-SyNC-doc/).

**B. Using your own Pico W**
  1. Connect Pico to your laptop while pressing BOOTSEL button and copy the firmware [uf2](https://micropython.org/download/rp2-pico-w/rp2-pico-w-latest.uf2) file to Pico.
  2. Download and install thonny editor ([thonny.org](https://thonny.org/)), enable View -> File
  3. Download and unzip the RNG-SyNC source code provided.
  4. Upload the entire code to your Pico W using Thonny editor (Do not press BOOTSEL now, [read more](https://www.electromaker.io/blog/article/electromaker-educator-getting-started-with-the-pico-w)) 
<img width="700px" src="https://user-images.githubusercontent.com/111796612/202618561-c0973ac7-efcb-4c31-af6c-e20cfc7628ea.png" />

  5. Configure using step A.2 


Your RNG SyNC module is now ready to deploy, just connect it to your Rover using RJ12 cable. If you are using certain low power models like Wanderer/ Adventurer, remove the **EN/5V** jumper pin and power the device through USB. Check [Wiki](https://github.com/thewestlabs/RNG-SyNC-doc/wiki) for more details on hardware and schematics. 

### LED color codes

After the initial bootstrap settles in:
  1. 🟢 Green blinking every 3 seconds - Device is healthy and connected
  2. 🟡 Yellow blinking every 3 seconds - Device is healthy but not connected to rover
  3. ⭕ Red blinking - Temporary error
  4. 🔴 Red steady - Fatal error occured

### Home assistant MQQT configuration
Enable and configure MQQT using the BLE app and add the following to your home assistant `configuration.yaml`
```yaml
mqtt:
  sensor:
    - name: "Battery voltage"
      state_topic: "rngsolar"
      unit_of_measurement: "V"
      value_template: "{{ value_json.battery_voltage }}"
    - name: "Battery SOC"
      state_topic: "rngsolar"
      unit_of_measurement: "%"
      value_template: "{{ value_json.battery_percentage }}"
    - name: "Solar power"
      state_topic: "rngsolar"
      unit_of_measurement: "W"
      value_template: "{{ value_json.pv_power }}"
    - name: "Load power"
      state_topic: "rngsolar"
      unit_of_measurement: "W"
      value_template: "{{ value_json.load_power }}"
    - name: "Power generation today"
      state_topic: "rngsolar"
      unit_of_measurement: "Wh"
      value_template: "{{ value_json.power_generation_today }}"
    - name: "Power consumption today"
      state_topic: "rngsolar"
      unit_of_measurement: "Wh"
      value_template: "{{ value_json.power_consumption_today }}"
    - name: "Temperature"
      state_topic: "rngsolar"
      unit_of_measurement: "°F"
      value_template: "{{ value_json.controller_temperature_f }}"
```
### Where to buy
<a href="https://www.tindie.com/stores/westlabs/?ref=offsite_badges&utm_source=sellers_cyrils&utm_medium=badges&utm_campaign=badge_medium"><img src="https://d2ss6ovg47m0r5.cloudfront.net/badges/tindie-mediums.png" alt="I sell on Tindie" width="150" height="78"></a>

https://www.tindie.com/products/27955/


### Disclaimers
- ¹Renogy is trademark of RNG INTERNATIONAL, INC.
- This device and software is provided only as a DIY project for your home, the developer is not liable for any damages caused by it.
