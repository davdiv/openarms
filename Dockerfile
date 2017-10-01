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
CMD [ "npm", "start", "--", "--keycloak-ui", "keycloak-ui.json", "--keycloak-backend", "keycloak-backend.json", "--db-url", "mongodb://mongo:27017/openarms" ]
