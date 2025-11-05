#!/bin/bash

set -e

echo "Running linters..."
echo ""

echo "1. Checking HTML files with Prettier..."
npx prettier --check *.html
echo "✓ HTML lint passed"
echo ""

echo "2. Checking CSS files with Biome..."
npx biome check --files-ignore-unknown=true *.css
echo "✓ CSS lint passed"
echo ""

echo "All linting checks passed!"
