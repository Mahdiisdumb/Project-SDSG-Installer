#!/bin/bash

FOLDER="./archive"
BRANCH="main"

# Make sure we're on the correct branch
git checkout "$BRANCH" || exit 1

# Use an array to avoid subshell issues
mapfile -t files < <(find "$FOLDER" -maxdepth 1 -type f -name "Project SDSG.part.zip.*" | sort -V)

for file in "${files[@]}"; do
    echo "Processing '$file'..."
    
    git add "$file"
    
    filename=$(basename "$file")
    git commit -m "Add '$filename'"
    git push origin "$BRANCH"
    
    echo "'$filename' pushed successfully."
done

echo "All .part files committed and pushed individually."