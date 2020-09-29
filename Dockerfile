FROM node:12

WORKDIR /var/www/graphqltask

COPY . .

RUN yarn

RUN yarn tsc 

EXPOSE 3000

CMD yarn start