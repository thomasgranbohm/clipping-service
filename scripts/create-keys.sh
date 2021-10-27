#!/bin/bash

DIR=$(git rev-parse --show-toplevel)

CONFIG_FILE=backend.env

PUBLIC_FILE=public.pem
PRIVATE_FILE=private.pem

# Create private key
openssl genrsa -out /tmp/$PRIVATE_FILE 2048 > /dev/null 2>&1

# Create public key
openssl rsa -in /tmp/$PRIVATE_FILE -outform PEM -pubout -out /tmp/$PUBLIC_FILE > /dev/null 2>&1

# Create temp config
cp $DIR/config/$CONFIG_FILE /tmp/$CONFIG_FILE;

# Change private key
sed -i -zE "s/PRIVATE_KEY='-----BEGIN RSA PRIVATE KEY-----(.|\n)*-----END RSA PRIVATE KEY-----'\n//" /tmp/$CONFIG_FILE
echo "PRIVATE_KEY='`cat /tmp/$PRIVATE_FILE`'" >> /tmp/$CONFIG_FILE

# Change public key
sed -i -zE "s/PUBLIC_KEY='-----BEGIN PUBLIC KEY-----(.|\n)*-----END PUBLIC KEY-----'\n//" /tmp/$CONFIG_FILE
echo "PUBLIC_KEY='`cat /tmp/$PUBLIC_FILE`'" >> /tmp/$CONFIG_FILE

# Override new files
mv /tmp/$CONFIG_FILE $DIR/config/$CONFIG_FILE

# Remove key files
rm /tmp/$PRIVATE_FILE /tmp/$PUBLIC_FILE

