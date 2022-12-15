# RNG SyNC Documentation
Firmware for Renogy RS232 compatible  WiFi and Bluetooth adapter. Checkout the product [here](https://www.tindie.com/products/27955/). Tested with Renogy Rover¹ series charge controllers.

### Configuration
#### If using pre-installed Pico W
Pre-installed Pico comes with firmware already baked into it. Configure the device via bluetooth by going to this webpage.
#### If using your own Pico W
1. Download and install thonny editor ([thonny.org](https://thonny.org/)), enable View -> File
2. Connect Pico W to your laptop while pressing BOOTSEL button and copy the firmware [uf2](https://micropython.org/download/rp2-pico-w/rp2-pico-w-latest.uf2) file to Pico ([read more](https://www.raspberrypi.com/documentation/microcontrollers/micropython.html#drag-and-drop-micropython))
3. Download and unzip the RNG-SyNC source code provided.
4. Upload the entire code to your Pico W using Thonny editor (Do not press BOOTSEL now, [read more](https://www.electromaker.io/blog/article/electromaker-educator-getting-started-with-the-pico-w)) 

<img width="700px" src="https://user-images.githubusercontent.com/111796612/202618561-c0973ac7-efcb-4c31-af6c-e20cfc7628ea.png" />

Your WiFi module is now ready to deploy, just connect it to your Renogy charge controller using RJ12 cable. Check [Wiki](https://github.com/thewestlabs/renogy-wifi/wiki) for more details on hardware and schematics.

### Home assistant MQQT configuration
Enable MQQT in `Devie.py` and add the following to your home assistant `configuration.yaml`
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
      unit_of_measurement: "°C"
      value_template: "{{ value_json.controller_temperature }}"
```
### Where to buy
<a href="https://www.tindie.com/stores/westlabs/?ref=offsite_badges&utm_source=sellers_cyrils&utm_medium=badges&utm_campaign=badge_medium"><img src="https://d2ss6ovg47m0r5.cloudfront.net/badges/tindie-mediums.png" alt="I sell on Tindie" width="150" height="78"></a>

https://www.tindie.com/products/27955/

### References
- Modbus library is based on [techbase123/micropython-modbus](https://github.com/techbase123/micropython-modbus)
- Renogy library is based on [corbinbs/solarshed](https://github.com/corbinbs/solarshed)
- ¹Renogy is trademark of RNG INTERNATIONAL, INC. This software is provided only as a DIY project for your home.
