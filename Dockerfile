# Install watchman
FROM homebrew/brew
RUN brew update
RUN brew install watchman
RUN brew cleanup
ENV PATH=~/.linuxbrew/bin:~/.linuxbrew/sbin:$PATH

# RUN echo $(ls -1 /usr/local/var/run/watchman)

FROM node:13.2.0

# Create app directory
WORKDIR /usr/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./


#NPM Install node modules
RUN npm install --quiet

COPY . .

# RUN echo $(ls -1 /usr/app)

EXPOSE 3000

# start ui connected to UChicago api server

CMD [ "npm" "start"]