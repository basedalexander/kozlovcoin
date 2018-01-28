#!/bin/bash

docker container stop scroogecoin_container > /dev/null 2>&1
docker container rm scroogecoin_container > /dev/null 2>&1
docker image rm scroogecoin_img:latest > /dev/null 2>&1
docker image build --no-cache -t scroogecoin_img .
docker container run -p 3005:3008 \
                     -p 6001:6001 \
                     -d=false \
                     --name scroogecoin_container \
                     scroogecoin_img:latest