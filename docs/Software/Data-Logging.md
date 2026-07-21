# Data Logging

## `logger.py`

The main loop lives at `sdzwa/logger.py` and:

1. Waits `WARMUP_SECONDS` (60s) after start for sensors to stabilize
2. Opens a new CSV file per run, named `env_data__<UTC timestamp>.csv`
3. Every `INTERVAL` seconds (currently 15s), reads all sensors and appends a row
4. Flushes and `fsync`s after every row, so a crash or power loss loses at
   most one sample, not the whole file
5. Wraps each sensor read in a `safe()` helper — a failing sensor logs an
   error and writes `None` for its columns instead of stopping the loop; when
   a previously-down sensor starts succeeding again, that's logged too

Output files:

| Path | Contents |
|------|----------|
| `/data/env_data/env_data__<timestamp>.csv` | Sensor readings, one row per sample |
| `/data/env_errors/errors__<timestamp>.log` | Per-run error log (new file each process start) |

## CSV columns

```
timestamp,
pm1, pm25, pm10,
sht45_temp, sht45_rh,
scd41_co2, scd41_temp, scd41_rh,
bme_temp, bme_rh, bme_press, bme_gas,
mq137_raw, mq137_v_adc, mq137_v_ao, mq137_rs,
mics5524_raw, mics5524_v_adc, mics5524_v_ao, mics5524_rs,
mq4_raw, mq4_v_adc, mq4_v_ao, mq4_rs,
sen0571_raw, sen0571_v_adc, sen0571_v_ao
```

For the four analog sensors: `raw` is the ADS1115 code, `v_adc` is the
voltage measured at the ADC pin, `v_ao` is that voltage scaled back up to the
sensor's true analog-output voltage (see the divider math in
[Components](../Hardware/Components.md#analog-gas-sensor-wiring)), and `rs`
is the derived sensor resistance (not computed for SEN0571).

`timestamp` is `datetime.now(timezone.utc).isoformat()` — always UTC.

## systemd services

Two services run the logger automatically on boot.

`/etc/systemd/system/sdzwa-env.service` — creates the data directory before
the logger starts:

```ini
[Unit]
Description=SDZWA Environment Prep
Before=sdzwa-logger.service

[Service]
Type=oneshot
User=julia
ExecStart=/bin/mkdir -p /data/env_data
RemainAfterExit=true

[Install]
WantedBy=multi-user.target
```

`/etc/systemd/system/sdzwa-logger.service` — runs the logger itself, restarting on failure:

```ini
[Unit]
Description=SDZWA Environmental Logger
After=network.target

[Service]
Type=simple
User=julia
WorkingDirectory=/home/julia/sdzwa
ExecStart=/home/julia/sdzwa/env/bin/python /home/julia/sdzwa/logger.py
Restart=always
RestartSec=5

# Make Ctrl+C / kill safe
KillSignal=SIGINT
TimeoutStopSec=10

[Install]
WantedBy=multi-user.target
```

Enable both with:

```bash
sudo systemctl daemon-reload
sudo systemctl enable sdzwa-env.service sdzwa-logger.service
sudo systemctl start sdzwa-env.service sdzwa-logger.service
```

Before first run, resolve `/data` permissions if needed:

```bash
sudo chown julia:julia /data
sudo chmod 775 /data
```
