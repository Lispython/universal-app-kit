FROM universal-app:latest

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV
ENV PATH /usr/src/app/node_modules/.bin:$PATH

RUN cd /usr/src/app

CMD ["node", "--version"]
