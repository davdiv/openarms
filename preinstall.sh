#!/bin/bash

if ! [ -d node_modules/hashspace ] ; then
	git clone --depth 1 https://github.com/ariatemplates/hashspace.git node_modules/hashspace &&
	( 
		cd node_modules/hashspace &&
		npm install grunt-cli &&
		npm install --production=false
	)
fi

