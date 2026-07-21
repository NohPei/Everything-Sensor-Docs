# Components

## Bill of materials

| Component | Part | Purpose |
|-----------|------|---------|
| Board | Olimex A20-OLinuXino-Lime2 | Main compute, runs Armbian Linux |
| Shield | Olimex Lime2 Shield | Breaks out I2C/GPIO, adds SATA power |
| Storage (`sdzwa-wired`) | Samsung 870 EVO 1TB SSD (SATA) | Long-term data storage, custom power + SATA cable |
| Storage (`sdzwa-wireless`) | microSD, 128GB+ | Portable storage for temporary/event-based deployments |
| RTC | DS3231 + CR2032 battery | Keeps accurate time across power loss (onboard RTC drifts too much) |
| Particulate matter | Adafruit PMSA003I | PM1 / PM2.5 / PM10 |
| Temp/humidity | Adafruit SHT45 | Temperature, relative humidity |
| CO₂ | Adafruit SCD41 | CO₂, temperature, relative humidity |
| Gas/VOC (digital) | Adafruit BME688 | Temperature, humidity, pressure, gas resistance |
| Gas (analog) | MQ-137 | Ammonia — read via ADC as a voltage trend |
| Gas (analog) | MQ-4 | Methane/natural gas — read via ADC as a voltage trend |
| Gas (analog) | MiCS-5524 | VOC/CO — read via ADC as a voltage trend |
| Gas (analog) | DFRobot SEN0571 (MEMS) | Gas sensor — read via ADC as a voltage trend |
| ADC | ADS1115 | 4-channel ADC for the analog gas sensors |
| Misc | Perma-proto board, jumper wires, resistors | Breadboarding/wiring |

!!! warning "SGP30 no longer in the active pipeline"
    SGP30 was part of the original supply list but there is no `sensors/sgp30.py`
    module in the current package and `logger.py` does not read from it. If it's
    still physically on a unit, it isn't being logged — worth confirming whether
    that's intentional before calling this list final.

Sensor datasheets for the four analog gas sensors are kept locally (in the
project's `sensor_datasheets/` directory) since these are lower-level, less
documented modules than the Adafruit-carried digital sensors.

## Bus addresses

All digital sensors and the ADC share I2C bus 1 (`/dev/i2c-1`).

| Device | I2C address |
|--------|-------------|
| PMSA003I | `0x12` |
| SHT45 | `0x44` |
| SCD41 | `0x62` |
| ADS1115 (ADC) | `0x48` |
| DS3231 (RTC) | `0x68` |
| BME688 | `0x77` |

## Analog gas sensor wiring

The four analog sensors don't connect to I2C directly — each sensor's analog
output (AO) feeds a voltage divider into one channel of the ADS1115 ADC:

| Sensor | ADS1115 channel | Load resistor (RL) |
|--------|------------------|---------------------|
| MQ-137 | 0 | 10 kΩ (measured ~9.9 kΩ) |
| MiCS-5524 | 1 | 10 kΩ |
| MQ-4 | 2 | 1 kΩ |
| SEN0571 | 3 | — (voltage read only, no Rs conversion) |

The divider itself is the same across all four: `R_TOP = 57 kΩ`, `R_BOTTOM = 100 kΩ`,
giving a scale factor of `(57k + 100k) / 100k ≈ 1.57` to reconstruct the sensor's
true AO voltage from the voltage seen at the ADC pin.

See [Research Notes](../Research-Notes.md) for why these are read as a voltage
trend rather than converted to ppm/ppb.
