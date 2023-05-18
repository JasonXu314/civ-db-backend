FROM node:18

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY src .
COPY tsconfig.json .
COPY tsconfig.build.json .
COPY .eslintrc.js .

ENV PORT=5000

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start:prod"]