FROM node:12-slim
EXPOSE 4000

ENV NPM_CONFIG_LOGLEVEL=warn

RUN mkdir /code
WORKDIR /code

COPY ./ /code

RUN npm install --unsafe-perm=true --silent --depth 0
CMD ["npm","start"]