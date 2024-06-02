# Grab all files from .github/workflows/**.yml and validate them with action-validator
directory=".github/workflows"

for file in "$directory"/*.yml; do
    action-validator "$file"
done
