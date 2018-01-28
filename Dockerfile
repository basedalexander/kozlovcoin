FROM node:8.2.1

RUN mkdir /scroogecoin

COPY config /scroogecoin/config/
COPY src /scroogecoin/src/
COPY swagger-ui /scroogecoin/swagger-ui/

COPY package.json /scroogecoin/
COPY jest.config.js /scroogecoin/
COPY .babelrc /scroogecoin/
COPY .gitignore /scroogecoin/

RUN cd /scroogecoin && npm install

EXPOSE 3008
EXPOSE 6001

WORKDIR /scroogecoin
CMD P2P_PEERS=$P2P_PEERS npm start
