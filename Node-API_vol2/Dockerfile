FROM node:12
WORKDIR /app

# Install app dependencies
COPY package*.json /app
RUN npm install
# Bundle app source
COPY . /app
CMD ["npm", "start"]
EXPOSE 5000

#Command to complete docker setup
#docker images
#docker bulid -t Node-express-api .
#docker run -it -p 8080:5000 node-expr-api 
