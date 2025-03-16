FROM node:22.14-alpine

RUN addgroup app && adduser -S app -G app app
USER app
WORKDIR /app
COPY --chown=app:node package*.json .
RUN npm install
COPY --chown=app:node . .

EXPOSE 8000

CMD [ "npm", "start" ]

