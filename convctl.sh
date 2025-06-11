#!/bin/bash

[ -d .processes ] || mkdir .processes
if [ ! -f ./convctl ]; then
  cp ./node_modules/@corezoid/convctl/bin/convctl ./convctl
fi
./convctl "$@"