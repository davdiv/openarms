#!/bin/bash

if ! [ -d node_modules/hashspace ] ; then
	git clone --depth 1 https://github.com/divdavem/hashspace.git node_modules/hashspace &&
	(
		cd node_modules/hashspace &&
		npm install grunt-cli &&
		npm_config_production=false npm install &&
		./node_modules/.bin/grunt package
	)
fi

