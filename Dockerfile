FROM docker-app:latest

WORKDIR /usr/src/app

COPY . . 

RUN npm run build

CMD ["npm","run","start:prod"]
