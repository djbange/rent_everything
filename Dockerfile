FROM node:16 as builder
LABEL FALL 22 SE 2022

RUN npm install pm2@latest --global --quiet

# Create app directory
RUN mkdir -p /usr/src/app/
RUN mkdir -p /usr/src/app/frontEnd/
RUN mkdir -p /usr/src/app/backEnd/

# copy the frontend files to the container
WORKDIR /usr/src/app/frontEnd
COPY ./.env.be.dev ./
COPY ./frontEnd/ ./
RUN rm -rf build/
RUN npm install --legacy-peer-deps && npm cache clean --force
RUN set NODE_OPTIONS=--openssl-legacy-provider
RUN npm run build
COPY . /usr/src/app/frontEnd

# copy the backend files to the container
WORKDIR /usr/src/app/backEnd
COPY ./backend/package*.json ./
# RUN npm ci --only=production
RUN npm install \
  && mv node_modules /node_modules
RUN npm install -g nodemon
# Bundle app source
COPY . /usr/src/app/backEnd

EXPOSE 8080

FROM nginx:1.22-alpine as nginx
COPY --from=builder /usr/src/app/frontEnd/build /usr/share/nginx/html 
COPY ./config/nginx/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["pm2-runtime", "./config/pm2.json"]
