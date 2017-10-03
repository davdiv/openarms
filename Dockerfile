FROM node:8.6.0
WORKDIR /usr/openarms
COPY . .
RUN chown -R node.node .
USER node
RUN ./dockerinstall.sh
USER root
RUN chown -R node.node .
EXPOSE 8080
USER node