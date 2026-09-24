FROM node:22-slim

WORKDIR /app

COPY FrontEnd/package*.json ./FrontEnd/
COPY BackEnd/package*.json ./BackEnd/

RUN npm ci --prefix FrontEnd \
    && npm ci --prefix BackEnd

COPY FrontEnd ./FrontEnd
COPY BackEnd ./BackEnd

RUN npm run build --prefix FrontEnd \
    && cd BackEnd \
    && npx prisma generate

WORKDIR /app/BackEnd

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && npm run seed:demo && npm start"]
