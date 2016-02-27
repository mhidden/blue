#!/bin/sh
NODE_ENV=test node_modules/.bin/sequelize db:migrate
NODE_ENV=test node_modules/nodeunit/bin/nodeunit tests/ 
