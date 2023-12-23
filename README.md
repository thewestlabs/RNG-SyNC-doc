# RNG SyNC
RNG SyNC is a Renogy¹ RS232 compatible  WiFi and Bluetooth adapter. Checkout the product [here](https://www.tindie.com/products/27955/). Tested with Rover/Wanderer/Adventurer series charge controllers.

<img src="https://github.com/thewestlabs/RNG-SyNC-doc/assets/111796612/c814bc65-79ce-46b3-81dc-db1501bf9b8b" width="320px" />

### Configuration
**a. Pre-installed Pico W**
  1. All pre-installed Picos come with firmware already baked into it.
  2. Connect the RNG SyNC module to your Rover using RJ12 cable. If you are using Wanderer/ Adventurer remove the **5V** jumper pin on PCB and power the device through USB.
  3. Configure with bluetooth using this webpage -> [RNG SyNC App](https://thewestlabs.github.io/RNG-SyNC-doc/). Read more about using the app on [Wiki](https://github.com/thewestlabs/RNG-SyNC-doc/wiki/BLE-App).

**b. Using your own Pico W**

If you opted for your own Pico, check manual configuration steps [wiki/Manual-configuration](https://github.com/thewestlabs/RNG-SyNC-doc/wiki/Manual-configuration)

### Connector cable

You will need an RJ12 cable to connect to your charge controller. You can buy one from Amazon ([link](https://www.amazon.com/dp/B08BHVF6XS)) or your local store. Make sure it's **6P6C** marked as **"straight wired"**.

<img src=https://github.com/thewestlabs/RNG-SyNC-doc/assets/111796612/4d97e112-0234-42d0-9187-59e8e19c4cdc width=380px />

### LED color codes

After the initial bootstrap settles in:
  1. 🟢 Green blinking every 3 seconds - Device is healthy and connected
  2. 🟡 Yellow blinking every 3 seconds - Device is healthy but not connected to either Rover or WiFi
  3. ⭕ Red blinking - Temporary error
  4. 🔴 Red steady - Fatal error occured

Check [Wiki](https://github.com/thewestlabs/RNG-SyNC-doc/wiki) for more details on hardware and schematics. 

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
- ¹Renogy and all other trademarks used here are the property of their respective owners.
- This device and software is provided only as a DIY project for your home, the developer is not liable for any damages caused by it.
