FROM node:8.2.1

RUN mkdir /kozlovcoin

VOLUME /storage

COPY config /kozlovcoin/config/
COPY src /kozlovcoin/src/
COPY tests /kozlovcoin/tests/

COPY package.json /kozlovcoin/
COPY jest.e2e.config.js /kozlovcoin/
COPY jest.unit.config.js /kozlovcoin/
COPY nodemon.json /kozlovcoin/
COPY tsconfig.json /kozlovcoin/
COPY tslint.json /kozlovcoin/

RUN cd /kozlovcoin && npm install

EXPOSE 3008
EXPOSE 6001

LABEL api_route="node/wallet"

WORKDIR /kozlovcoin
CMD npm start
