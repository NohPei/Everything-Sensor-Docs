---
title: Research Notes
description: Why the analog gas sensors are read as voltage trends, and the adaptive sensing direction of the project.
---

## "These are cheap, MOX, analog gas sensors — how can they capture meaningful data?"

**TLDR:** We analyze sensor voltage output directly as a proxy for resistance
changes, focusing on temporal trends and relative responses rather than
absolute gas concentrations.

Yes, these are cheap sensors — but the physics inside them is plenty to
understand **trends**. Notice the word *trend*, not ppb/ppm: extracting a
calibrated concentration would require precise calibration, which is exactly
where sensors like this fall short. Even calibrated from day one, they drift
over time.

Instead, the project leans on the fact that, given the divider topology used
here, higher voltage corresponds to higher sensor resistance (Rs) and vice
versa. As gas concentration changes, Rs changes, and Vout changes with it — so
voltage is a **monotonic** proxy for gas concentration (monotonic here meaning
a one-directional mapping, not that it's strictly increasing). For studying
stability, drift, response, correlation, or discrete events, the voltage trend
over time is the useful signal — not ppm/ppb. With Everything Sensor's
multimodal design, that also opens the door to correlating trends *across*
sensing modalities, not just within one.

We're working in the **sensor space**, not the **gas space**, by design —
that's what makes these low-cost, off-the-shelf components usable at all.

:::note
The calibration curves for MQ/MiCS-family sensors are non-linear, depend
on humidity and temperature, vary sensor-to-sensor, vary with the chosen
load resistor, and vary with heater aging. Converting to ppm without
proper calibration is not just uninformative — it's actively misleading.
Staying in voltage space is the more honest representation of what's
actually measured.
:::

The intended normalization approach: let sensors run to establish a clean-air
baseline, then normalize subsequent readings against it —

```python
df["mq137_norm"] = df["mq137_sensor"] / df["mq137_sensor"].iloc[0]
```

The research pipeline downstream of raw voltage is:

```
raw voltage → normalized voltage → features → ML
```

## Current workflow

1. Sensors deployed and collecting raw data
2. Data retrieved from local storage (SATA/microSD)
3. Offline post-processing: normalization, plotting, feature extraction, ML
4. Cross-modality and cross-sensor correlation analysis

## Where this is headed: adaptive sensing

The long-term goal is a system that becomes **self-aware of its own signal
context**, rather than a passive logger:

- Sensors autonomously establish their own baselines from stabilized data
- Signals are normalized on-board, in real time
- Sampling rate and which sensors are active adapt based on detected events
  and signal dynamics
- Power, bandwidth, and storage are spent only when information content is
  actually high

> Adaptive sensing transforms passive data loggers into context-aware
> scientific instruments — the system no longer records everything, only what
> matters.

**Research novelty:** a general multimodal sensing architecture that learns
its own baselines, normalizes signals, and adaptively reallocates sensing
resources across heterogeneous environmental sensors at the edge.
