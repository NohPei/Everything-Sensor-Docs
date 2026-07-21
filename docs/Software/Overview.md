# Software Overview

## Repository layout (on the board)

The `sdzwa/` directory is deployed to the board and contains:

```
sdzwa/
├── logger.py         # main data-collection loop, run as a systemd service
├── sensors/           # package: one module per sensor, each exposing a read_*() function
│   ├── pm.py          # PMSA003I
│   ├── sht45.py       # SHT45
│   ├── scd41.py       # SCD41
│   ├── bme688.py      # BME688
│   ├── ads1115.py     # shared ADC driver for the analog sensors
│   ├── mq137.py
│   ├── mq4.py
│   ├── mics5524.py
│   └── sen0571.py
└── env/               # python venv
```

`sensors/` is imported as a package (`from sensors.pm import read_pm`, etc.) —
each analog sensor module (`mq137.py`, `mq4.py`, `mics5524.py`, `sen0571.py`)
wraps the shared `ads1115.read_adc()` driver rather than talking to hardware
directly.

## Data flow

```
raw voltage / I2C reads
        │
        ▼
 logger.py (15s interval, per-sensor error isolation)
        │
        ▼
 CSV on local storage (/data/env_data/)
        │
        ▼
 offline post-processing: normalization → features → correlation/ML
```

!!! warning "Sampling rate discrepancy"
    The project README describes sensors as sampling "at 1Hz," but `logger.py`
    currently uses `INTERVAL = 15` (seconds) between samples, plus a 60-second
    warmup on startup before the first write. Worth confirming which is the
    intended rate — this documents the code as it currently runs.

## Fault isolation

`logger.py` wraps every sensor read in a `safe()` helper: if a sensor read
throws, that sensor's columns are written as `None` for that row instead of
crashing the whole logging loop, and the failure (plus recovery) is logged to
`/data/env_errors/errors__<timestamp>.log`. This means one flaky sensor
doesn't take down data collection for the rest.

For the full column layout and service configuration, see
[Data Logging](Data-Logging.md).

## Where this is headed

The current pipeline is intentionally simple — log everything, process later.
See [Research Notes](../Research-Notes.md) for the adaptive-sensing direction
the project is working toward (on-board baselining, adaptive sampling rates,
and event-triggered resource allocation).
