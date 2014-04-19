#!/bin/bash

if ! [ -d node_modules/hashspace ] ; then
	git clone --depth 1 https://github.com/divdavem/hashspace.git -b nullOrUndefined node_modules/hashspace &&
	( 
		cd node_modules/hashspace &&
		npm install grunt-cli &&
		npm install --production=false
	)
fi

if ! [ -d node_modules/noder-js ] ; then
	git clone --depth 1 https://github.com/ariatemplates/noder-js.git node_modules/noder-js &&
	( 
		cd node_modules/noder-js &&
		npm install grunt-cli &&
		npm install --production=false
	)
fi
