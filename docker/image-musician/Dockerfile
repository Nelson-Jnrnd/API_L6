FROM node:current
EXPOSE 2205
WORKDIR /opt/app
COPY src/ .
RUN npm install
ENTRYPOINT ["node", "index.js"]