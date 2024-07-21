FROM node:21.5.0-alpine

# create destination directory
RUN mkdir -p /usr/src/nuxt-survey
WORKDIR /usr/src/nuxt-survey

# update and install dependency
RUN apk update && apk upgrade
RUN apk add git

# copy the app, note .dockerignore
COPY . /usr/src/nuxt-survey/
RUN npm install
RUN npm run build

EXPOSE 5000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=5000

CMD [ "node", ".output/server/index.mjs" ]
