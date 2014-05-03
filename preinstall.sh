#!/bin/bash

if ! [ -d node_modules/hashspace ] ; then
	git clone --depth 1 https://github.com/divdavem/hashspace.git -b latest node_modules/hashspace &&
	( 
		cd node_modules/hashspace &&
		npm install grunt-cli &&
		npm install --production=false
	)
fi

