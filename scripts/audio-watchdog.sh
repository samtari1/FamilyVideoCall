#!/bin/bash

set -euo pipefail

while true
do
    if command -v pactl >/dev/null 2>&1; then
        pactl set-default-sink alsa_output.pci-0000_03_00.6.analog-stereo

        pactl set-sink-volume \
          alsa_output.pci-0000_03_00.6.analog-stereo \
          100%

        pactl set-sink-mute \
          alsa_output.pci-0000_03_00.6.analog-stereo \
          0
    fi

    sleep 5
done