#!/bin/bash
packer build -var-file='infrastructure/packer/vars.json' ami.json
