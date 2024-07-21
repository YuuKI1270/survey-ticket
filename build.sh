#! /bin/bash

name=localhost:32440/vue/qa/nuxt-ticket-survey
tag="$(git rev-parse --short=8 HEAD)"

docker build -t "$name:$tag" .
docker push "$name:$tag"