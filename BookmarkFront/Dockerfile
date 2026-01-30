FROM node:lts-alpine

WORKDIR /src/app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install --include=dev --production --silent && mv node_modules ../

COPY . .

EXPOSE 5173

RUN chown -R node /src/app

USER node

CMD [ "npm", "run", "dev" ]
