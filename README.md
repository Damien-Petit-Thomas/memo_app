# Memo_svelte

Application de prise de note en ligne

## Installation

se referer au repo [memo_db_compose](https://github.com/Damien-Petit-Thomas/memo_db_compose) pour l'installation

## Description

Application de prise de note en ligne... il en existe plein... mais celle ci c'est la mienne !
Je l'ai débuté comme un passe temps, pour le plaisir de developper et le projet a pris de l'ampleur !

fonctionalités de base :
 > prise en charge syntaxe markdown
 > création automatisée d'une barre laterale de navigation
 > creation de catégorie
 > creation de tag

 fonctionalités en plus! :
 > tout lien  dans une note est automatiquement détecté et apparaitront de maniere ordonné dans l'onglet lien utiles
 > possibilité d'ajouts de mots dans un lexique   chaque occurence d'un mot appartenat au lexique est automatiquement détectée et un affichage spécifique est appliqué
 > presence d'une mini todo liste
 > aide à mise en page avec des composants automatiquement crées et déplaçable / suprimable d'un click

## Dockerfile

```
# Dev Stage
FROM node:lts-slim as dev

WORKDIR /app
COPY . .

RUN npm install

VOLUME /app


CMD ["npm", "run", "dev"]


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


CMD ["npm", "run", "start"]

```

pour fonctionner l'application necessite

- un container sveltkit (architecture backend hybride puisque j'utilise également un container node pour le back)
- un container de BDD : postgresql

pour utiliser l'application : aller au répo [memo_db_compose](https://github.com/Damien-Petit-Thomas/memo_db_compose) qui contient les dockerfiles pour le container de la bdd , de Caddy   et le docker-compose.yml pour lancer l'application en local ou pour un deploiement sur un serveur.

![Automated Upload](https://github.com/Damien-Petit-Thomas/memo-front/actions/workflows/container.yml/badge.svg)
# memo_app
