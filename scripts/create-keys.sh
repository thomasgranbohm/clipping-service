#!/bin/bash

DIR=$(git rev-parse --show-toplevel)

BACKEND_FILE=backend.env
FRONTEND_FILE=frontend.env

PUBLIC_FILE=public.pem
PRIVATE_FILE=private.pem

# Create private key
openssl genrsa -out /tmp/$PRIVATE_FILE 2048 > /dev/null 2>&1

# Create private key
openssl rsa -in /tmp/$PRIVATE_FILE -outform PEM -pubout -out /tmp/$PUBLIC_FILE > /dev/null 2>&1

# Change backend private key
sed -zE "s/PRIVATE_KEY='-----BEGIN RSA PRIVATE KEY-----(.|\n)*-----END RSA PRIVATE KEY-----'\n//" $DIR/config/$BACKEND_FILE > /tmp/$BACKEND_FILE
echo "PRIVATE_KEY='`cat /tmp/$PRIVATE_FILE`'" >> /tmp/$BACKEND_FILE

# Change frontend private key
sed -zE "s/PUBLIC_KEY='-----BEGIN PUBLIC KEY-----(.|\n)*-----END PUBLIC KEY-----'\n//" $DIR/config/$FRONTEND_FILE > /tmp/$FRONTEND_FILE
echo "PUBLIC_KEY='`cat /tmp/$PUBLIC_FILE`'" >> /tmp/$FRONTEND_FILE

# Override new files
mv /tmp/$BACKEND_FILE $DIR/config/$BACKEND_FILE
mv /tmp/$FRONTEND_FILE $DIR/config/$FRONTEND_FILE

# Remove key files
rm /tmp/$PRIVATE_FILE /tmp/$PUBLIC_FILE

