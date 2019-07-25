FROM node:10 
WORKDIR ./

COPY package.json package.json 

RUN npm install 

COPY . .

EXPOSE 8080 

RUN npm install -g nodemon 

CMD [ "nodemon", "index.js" ] 