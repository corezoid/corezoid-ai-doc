#!/bin/bash

[ -d .processes ] || mkdir .processes
if [ ! -f ./convctl ]; then
  if [ -f ./node_modules/@corezoid/convctl/bin/convctl ]; then
    cp ./node_modules/@corezoid/convctl/bin/convctl ./convctl
  elif [ -f ../node_modules/@corezoid/convctl/bin/convctl ]; then
    cp ../node_modules/@corezoid/convctl/bin/convctl ./convctl
  fi
fi
./convctl "$@"