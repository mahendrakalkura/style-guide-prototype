#!/bin/bash
set -e
npx prettier --check *.html
npx biome check --files-ignore-unknown=true *.css
