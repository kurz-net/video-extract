#!/bin/bash

for config in $(ls packages/**/tsconfig.json); do
    echo "Checking $config..."
    tsc --noEmit -p $config
done

for config in $(ls apps/**/tsconfig.json); do
    echo "Checking $config..."
    tsc --noEmit -p $config
done