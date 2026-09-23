---
title: Everything Sensor
description: Documentation for the Everything Sensor, a multimodal environmental sensing unit built for the NSF Center for Pandemic Insights.
---

**Everything Sensor** is a multimodal environmental sensing unit designed to be
dropped into a wildlife area, connected to power, and left to collect data —
no manual intervention required. It logs from every attached sensor on a
fixed interval with a UTC timestamp, and is built around low-cost, off-the-shelf
components in the interest of studying **sensing itself**: trends, drift, and
cross-modal correlation, rather than lab-grade calibrated measurements.

This documents the **v1 deployment**, built for an air quality sensing
deployment at SDZWA (San Diego Zoo Wildlife Alliance) starting January 2026.

This research is supported by and part of the [NSF Center for Pandemic Insights](https://www.pandemicinsights.org/).

## Deployed units

| Name | Purpose |
|------|---------|
| `sdzwa-wired` | First unit built; permanent placement in a bat house, SATA SSD storage |
| `sdzwa-wireless` | Second unit; portable/temporary data collection (e.g. short-duration events) |

## Where to go next

- **[Hardware](/hardware/components/)** — bill of materials, sensor bus addresses, and wiring.
- **[Software: Overview](/software/overview/)** — architecture, data flow, and the on-board `sensors` package.
- **[Software: Board Setup](/software/board-setup/)** — flashing the board, storage, and real-time clock setup.
- **[Software: Data Logging](/software/data-logging/)** — the logger process and systemd services that run it.
- **[Software: Networking](/software/networking/)** — remote access to the wireless unit via a NetBird/OpenWrt router.
- **[Research Notes](/research-notes/)** — why these sensors are read as voltage trends rather than calibrated gas concentrations, and the adaptive sensing direction of the project.

## Questions

Reach out to [gersey@umich.edu](mailto:gersey@umich.edu) with questions, comments, or issues replicating the build.
