#!/bin/sh

npm install &&
rm -rf hashspace node_modules &&
mkdir hashspace &&
cat << EOF > hashspace/package.json
{
    "name": "hashspace",
    "version": "0.0.0"
}
EOF
npm install --production &&
npm cache clean --force
