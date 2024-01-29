# Dev Stage
FROM node:lts-slim as dev

WORKDIR /app
COPY . .

RUN npm install

VOLUME /app


CMD ["npm", "run", "dev", "--", "--host"]

# Build Stage
FROM node:lts-slim as build

WORKDIR /app
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build


# Prod Stage
FROM node:lts-slim as prod

WORKDIR /app

COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/my-server.js ./my-server.js


RUN npm install --omit=dev
USER node

EXPOSE 8088

CMD ["npm", "run", "start"]
