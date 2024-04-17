FROM node:21.0-bullseye-slim

WORKDIR /build_native
COPY ./native_algo/ .
RUN DEBIAN_FRONTEND=noninteractive apt update && apt install -y cmake make g++ libga-dev
RUN cmake .
RUN make Solver
RUN mv Solver /solver


WORKDIR /src
COPY ./wrapper/*.js ./
COPY ./wrapper/package.json ./wrapper/package-lock.json ./
COPY ./wrapper/plot.html ./
RUN npm install --omit=dev

# Cleanup
RUN rm -rf /build_native
RUN DEBIAN_FRONTEND=noninteractive apt purge -y cmake make g++ npm && apt autoremove -y

EXPOSE 3000
ENTRYPOINT [ "node", "server.js" ]