FROM node:current
EXPOSE 2205
WORKDIR /opt/app
COPY src/ .
RUN npm install
CMD ["node", "index.js"]