#!/bin/bash

if ! [ -d hashspace ] ; then
	git clone --depth 1 https://github.com/divdavem/hashspace.git hashspace &&
	(
		cd hashspace &&
		npm install grunt-cli &&
		npm_config_production=false npm install &&
		./node_modules/.bin/grunt package
	)
fi &&

if ! [ -e node_modules/hashspace ] ; then
	ln -s ../hashspace node_modules/hashspace
fi
