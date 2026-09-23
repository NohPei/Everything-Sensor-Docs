---
title: Board Setup
description: Steps to take a bare Olimex Lime2 board to a running Everything Sensor unit.
---

Steps to take a bare Olimex Lime2 board to a running sensing unit.

## 1. Flash the OS

Flash the board with [Armbian](https://www.armbian.com/olimex-lime-2/).

- Default login: user `root`, password `1234`
- This assumes the Lime2 Shield + Samsung 870 EVO SSD hardware described in [Components](../../hardware/components/)

## 2. Network + packages

Connect an ethernet cable to a router (the board has no Wi-Fi chip) and install:

```
i2c-tools
util-linux
util-linux-extra
python3
python3-pip
python3-venv
gcc
git
```

Then set up the Python environment:

```bash
python -m venv env
python3 -m pip install --upgrade pip setuptools wheel
```

The Lime2 Shield needs its own C library first — see page 10 of the
[shield documentation](https://github.com/OLIMEX/LIME2-SHIELD/blob/master/DOCUMENTS/LIME2-SHIELD.pdf) —
then install its Python bindings:

```bash
sudo apt install gcc
pip3 install pyA20Lime2
```

## 3. Enable I2C

```bash
sudo nano /boot/armbianEnv.txt
```

Append:

```
overlays=i2c0 i2c1
param_i2c0=on
param_i2c1=on
```

`sudo reboot` to apply.

## 4. I2C / GPIO permissions

Using `smbus2` (not Adafruit Blinka — Blinka needs a Python version this board
doesn't have):

```bash
sudo usermod -aG i2c julia
sudo usermod -aG gpio julia
```

Add a udev rule (`/etc/udev/rules.d/99-gpio.rules`):

```
SUBSYSTEM=="gpio", KERNEL=="gpiochip*", GROUP="gpio", MODE="0660"
SUBSYSTEM=="gpio", KERNEL=="gpio*", GROUP="gpio", MODE="0660"
```

Apply and reboot:

```bash
sudo udevadm control --reload-rules
```

Sensor libraries needed on top of `smbus2`:

```bash
sudo apt install -y python3-smbus2
pip install smbus2
pip install git+https://github.com/pimoroni/bme680-python
pip install bme680
```

## 5. Storage

### Option A — SATA SSD (`sdzwa-wired`)

1. Confirm the disk is visible: `lsblk` (should show `sda`)
2. Partition: `sudo fdisk /dev/sda` → `n`, `p`, `1`, accept defaults, `w`
3. Format: `sudo mkfs.ext4 /dev/sda1`
4. Mount point: `sudo mkdir -p /data && sudo mount /dev/sda1 /data`
5. Verify: `df -h | grep data`
6. Get the UUID for a stable auto-mount: `sudo blkid /dev/sda1`
7. Append to `/etc/fstab`:
   ```
   UUID=<uuid-from-blkid> /data ext4 defaults,noatime,nodiratime 0 2
   ```
   - `noatime,nodiratime` avoid unnecessary writes for a long-running logger
   - `2` runs fsck on this filesystem after the root filesystem check
8. `sudo systemctl daemon-reload` (systemd reads `/etc/fstab` to generate mount units)
9. Verify auto-mount: `sudo umount /data`, confirm it's gone from `lsblk`, then `sudo mount -a` and confirm it's back

### Option B — microSD (`sdzwa-wireless`)

For portable/event-based deployments, skip the SSD and use the boot microSD
directly (128GB+ recommended) — swap/back up the card between deployments
instead of managing a mounted drive.

```bash
sudo mkdir -p /data/env_data
sudo mkdir -p /data/env_errors
sudo chown -R julia:julia /data
sudo chmod -R 755 /data
```

## 6. Real-time clock (DS3231)

The onboard RTC drifts too much for reliable long-term deployment, so an
external DS3231 (I2C `0x68`) is added as `rtc1` and made authoritative —
the onboard RTC (`rtc0`) is left alone rather than fought.

1. Confirm the DS3231 is visible on the bus: `i2cdetect -y 1`
2. Locate the active device tree blob:
   ```bash
   cat /proc/device-tree/model
   # Olimex A20-OLinuXino-LIME2-eMMC
   ```
3. Decompile it:
   ```bash
   cd /boot/dtb-$(uname -r)
   sudo cp sun7i-a20-olinuxino-lime2-emmc.dtb sun7i-a20-olinuxino-lime2-emmc.dtb.bak
   sudo dtc -I dtb -O dts -o lime2-emmc.dts sun7i-a20-olinuxino-lime2-emmc.dtb
   ```
4. Inside the `i2c@1c2b000 { ... }` node, add:
   ```
   rtc@68 {
       compatible = "maxim,ds3231";
       reg = <0x68>;
       status = "okay";
   };
   ```
5. Recompile and force Armbian to load the patched dtb:
   ```bash
   sudo dtc -I dts -O dtb -o sun7i-a20-olinuxino-lime2-emmc.dtb lime2-emmc.dts
   sudo nano /boot/armbianEnv.txt
   # fdtfile=sun7i-a20-olinuxino-lime2-emmc.dtb
   sudo reboot
   ```
6. Verify: `dmesg | grep rtc` and `ls -l /dev/rtc*` should now show both `rtc0` (onboard) and `rtc1` (DS3231).
7. Install and start chrony for NTP sync over ethernet:
   ```bash
   sudo apt install -y chrony
   sudo systemctl enable chrony
   sudo systemctl start chrony
   ```
8. Create a oneshot service so system time is set from the DS3231 (`rtc1`) at every boot, before NTP is available:

   `/etc/systemd/system/rtc1-hctosys.service`
   ```ini
   [Unit]
   Description=Set system time from DS3231 RTC
   DefaultDependencies=no
   After=dev-rtc1.device
   Before=sysinit.target

   [Service]
   Type=oneshot
   ExecStart=/sbin/hwclock --rtc=/dev/rtc1 --hctosys

   [Install]
   WantedBy=sysinit.target
   ```

   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable rtc1-hctosys.service
   sudo rm -f /var/lib/systemd/timesync/clock
   sudo reboot
   ```

### Recovering from a disconnected RTC

If the DS3231 gets disconnected, system time resets to 1970. To fix:

1. Plug in ethernet, confirm it's up (`ip a`)
2. `sudo timedatectl set-ntp true` — system clock syncs over NTP in ~10s
3. Once `timedatectl` shows the correct time: `sudo hwclock --systohc` to write it back to the RTC

## Known quirks

- If the ethernet cable is plugged in before power, it sometimes doesn't come
  up until unplugged and replugged. Not worth fixing on the software side for
  SDZWA deployments — ethernet there is only needed for updates/dev work, not
  normal operation.
