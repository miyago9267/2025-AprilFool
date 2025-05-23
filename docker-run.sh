#!/bin/bash
user="user"
name="2025-aprilfool"
port="2025"

docker build \
    $@ -t $user/$name:latest . || exit
[ "$(docker ps | grep $name)" ] && docker kill $name
[ "$(docker ps -a | grep $name)" ] && docker rm $name

docker run \
	-itd \
	-u $(id -u):$(id -g) \
	--name $name \
    --network bridge \
    -p $port:3000 \
	--restart=always \
	$user/$name:latest