# RNG SyNC
RNG SyNC is a Renogy¹ RS232 compatible  WiFi and Bluetooth adapter. Checkout the product [here](https://www.tindie.com/products/27955/). Tested with Rover/Wanderer/Adventurer series charge controllers.

### Configuration
**A. Pre-installed Pico W**
  1. All pre-installed Picos come with firmware already baked into it.
  2. Power up the device by connecting to USB or RJ12 cable and configure via BLE using this webpage -> [RNG SyNC Configurator](https://thewestlabs.github.io/RNG-SyNC-doc/). Read more about using the app on [Wiki/BLE App](https://github.com/thewestlabs/RNG-SyNC-doc/wiki/BLE-App).

**B. Using your own Pico W**
  1. Connect Pico to your laptop while pressing BOOTSEL button and copy the firmware [uf2](https://micropython.org/download/rp2-pico-w/rp2-pico-w-latest.uf2) file to Pico.
  2. Download and install thonny editor ([thonny.org](https://thonny.org/)), enable View -> File
  3. Download and unzip the RNG-SyNC source code provided.
  4. Upload the entire code to your Pico W using Thonny editor (Do not press BOOTSEL now, [read more](https://www.electromaker.io/blog/article/electromaker-educator-getting-started-with-the-pico-w)).
<img width="700px" src="https://user-images.githubusercontent.com/111796612/202618561-c0973ac7-efcb-4c31-af6c-e20cfc7628ea.png" />

  5. Configure using step A.2 


Your RNG SyNC module is now ready to deploy, just connect it to your Rover using RJ12 cable. If you are using certain low power models like Wanderer/ Adventurer, its reccomended to remove the **5V** jumper pin and power the device through USB. Check [Wiki](https://github.com/thewestlabs/RNG-SyNC-doc/wiki) for more details on hardware and schematics. 

### LED color codes

After the initial bootstrap settles in:
  1. 🟢 Green blinking every 3 seconds - Device is healthy and connected
  2. 🟡 Yellow blinking every 3 seconds - Device is healthy but not connected to either Rover or WiFi
  3. ⭕ Red blinking - Temporary error
  4. 🔴 Red steady - Fatal error occured

### PVOutput/ Home assistant / MQTT
Enable and configure cloud uploads using the BLE app. More details can be found at [Wiki/BLE App](https://github.com/thewestlabs/RNG-SyNC-doc/wiki/BLE-App).

### Supported devices

| Device | Tested | Comment |
| -------- | :--------: | --------|
| Renogy Rover | ✅ |  |
| Renogy Wanderer | ✅ | Needs USB power |
| Renogy Adventurer | ✅ | Needs USB power |
| RICH SOLAR 20/40/60 | ❓ |  |
| SRNE ML2420/30/40 | ❓ |  |
| SRNE ML4830N15 | ❓ |  |
| SRNE ML4860 | ❓ |  |

### Where to buy
<a href="https://www.tindie.com/stores/westlabs/?ref=offsite_badges&utm_source=sellers_cyrils&utm_medium=badges&utm_campaign=badge_medium"><img src="https://d2ss6ovg47m0r5.cloudfront.net/badges/tindie-mediums.png" alt="I sell on Tindie" width="150" height="78"></a>


### Disclaimers
- ¹Renogy is trademark of RNG INTERNATIONAL, INC.
- This device and software is provided only as a DIY project for your home, the developer is not liable for any damages caused by it.
