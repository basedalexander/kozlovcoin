FROM node:8.2.1

RUN mkdir /kozlovcoin

COPY config /kozlovcoin/config/
COPY src /kozlovcoin/src/
COPY swagger-ui /kozlovcoin/swagger-ui/

COPY package.json /kozlovcoin/
COPY jest.config.js /kozlovcoin/
COPY .babelrc /kozlovcoin/
COPY .gitignore /kozlovcoin/

RUN cd /kozlovcoin && npm install

EXPOSE 3008
EXPOSE 6001

WORKDIR /kozlovcoin
CMD P2P_PEERS=$P2P_PEERS npm start
