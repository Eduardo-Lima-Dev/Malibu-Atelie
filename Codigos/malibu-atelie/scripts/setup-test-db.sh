#!/bin/bash

# Criar o banco de dados de teste
psql -U postgres -c "DROP DATABASE IF EXISTS malibu_test;"
psql -U postgres -c "CREATE DATABASE malibu_test;"

# Aplicar as migrações do Prisma
npx prisma migrate deploy --schema=./prisma/schema.prisma

# Gerar o cliente Prisma
npx prisma generate --schema=./prisma/schema.prisma 