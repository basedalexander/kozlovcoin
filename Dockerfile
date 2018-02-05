FROM node:8.2.1

RUN mkdir /kozlovcoin

COPY config /kozlovcoin/config/
COPY src /kozlovcoin/src/

COPY package.json /kozlovcoin/
COPY jest.e2e.config.js /kozlovcoin/
COPY jest.unit.config.js /kozlovcoin/
COPY nodemon.json /kozlovcoin/
COPY tsconfig.json /kozlovcoin/
COPY tslint.json /kozlovcoin/

RUN cd /kozlovcoin && npm install

EXPOSE 3008
EXPOSE 6001

WORKDIR /kozlovcoin
CMD P2P_PEERS=$P2P_PEERS npm start
