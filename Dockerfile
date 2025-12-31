FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /app/reports

ENTRYPOINT ["npm", "run"]
CMD ["test"]
