---
title: Networking (remote access)
description: Remote SSH/VPN access to the sdzwa-wireless unit via a NetBird/OpenWrt travel router.
---

`sdzwa-wireless` doesn't have a fixed ethernet connection in the field, so a
travel router running [NetBird](https://netbird.io/) is used to give remote
SSH/VPN access to the unit. This is the setup for the `UM_SDZWA_Client`
NetBird router (a GL.iNet A1300).

## Flash the router

1. Follow the [GL.iNet A1300 OpenWrt install guide](https://openwrt.org/toh/gl.inet/gl-a1300?s[]=gl&s[]=inet&s[]=a1300)
   to reflash the router with the latest stable OpenWrt firmware.
2. Set static IPs: `192.168.1.1` for the router, `192.168.1.2` for the connecting laptop.
3. Plug into the router's **right-most LAN port** and hold the reset button
   for ~15 seconds until the flashing light sequence appears — this is what
   puts it into flashing mode. You'll know it worked when the OpenWrt flash
   page loads at `192.168.1.1`.

## Install NetBird

```bash
ssh root@192.168.1.1
opkg update
opkg install netbird
netbird up
```

`netbird up` prompts a login, which auto-registers the router as a NetBird
peer. Rename the peer/hostname at that point — otherwise it stays
`openwrt.netbird.cloud`.

On the NetBird side, once connected, the router's address changes from the
static `192.168.1.1` to its assigned NetBird address (e.g. `10.244.32.1`).

:::note
Keep physical setup notes for this router in the lab notebook alongside
the digital ones — the flashing step in particular is finicky enough that
a photo/note of what "correct" looks like is worth having on hand.
:::
