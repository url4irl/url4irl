#!/bin/bash

root_entry="./"

# Delete node_modules folders
find "$root_entry" -type d -name "node_modules" -exec rm -rf {} +

# Delete .turbo folders
find "$root_entry" -type d -name ".turbo" -exec rm -rf {} +

# Delete pnpm-lock.yaml file
find "$root_entry" -type f -name "pnpm-lock.yaml" -exec rm -f {} +

# Delete .vercel folders
find "$root_entry" -type d -name ".vercel" -exec rm -rf {} +

# Delete .astro folders
find "$root_entry" -type d -name ".astro" -exec rm -rf {} +

# Delete .jampack folders
find "$root_entry" -type d -name ".jampack" -exec rm -rf {} +

# Delete dist folders
find "$root_entry" -type d -name "dist" -exec rm -rf {} +

echo "Deleted node_modules, dist, .astro, .vercel, .jampack, .turbo and pnpm-lock.yaml from all packages"