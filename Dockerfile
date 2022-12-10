FROM node:16
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

# EXPOSE 8080

# Install nginx
RUN apt-get update && apt-get install -y nginx

# Remove the default nginx configuration file
RUN rm -v /etc/nginx/nginx.conf

# Copy the modified nginx configuration file
COPY ./config/nginx/nginx.conf /etc/nginx/

# Copy the frontend build files to the default nginx public directory
# COPY /usr/src/app/frontEnd/build /var/www/html/

# Expose port 8080 and 80
EXPOSE 80

# Start nginx and pm2
# CMD ["pm2-runtime", "./config/pm2.json"]
# CMD ["nginx", "-g", "daemon off;"]

CMD ["pm2-runtime", "./config/pm2.json", "&", "nginx", "-g", "daemon off;"]
