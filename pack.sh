#!/bin/bash
# Packs up each binary into a zips along with resources.neu

projectName="captioner"
distFolder="dist"
resourceName="resources.neu"

folder="$distFolder/$projectName"
resource="$folder/$resourceName"


for file in $(ls $folder); do
  if [[ "$file" = "$resourceName" ]]; then continue; fi
  filename=(${file//./ })
  zip -qjFS "$distFolder/${filename[0]}.zip" "$folder/$file" $resource
done;
