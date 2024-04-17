FROM debian:11.9-slim

WORKDIR /src
COPY ./native_algo/ .
RUN DEBIAN_FRONTEND=noninteractive apt update && apt install -y cmake make g++ libga-dev
RUN cmake .
RUN make Solver
RUN mv Solver /solver

# Cleanup
WORKDIR /
RUN rm -rf /src
RUN DEBIAN_FRONTEND=noninteractive apt purge -y cmake make g++ && apt autoremove -y

ENTRYPOINT [ "/solver" ]