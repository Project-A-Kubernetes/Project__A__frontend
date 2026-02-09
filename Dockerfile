FROM nginx:alpine

# Install envsubst (included in alpine nginx)
# Copy source code to nginx html directory
RUN rm -rf /usr/share/nginx/html/*
COPY src/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create a shell script to inject env vars at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/inject-config.sh && \
    echo 'envsubst < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js.tmp && mv /usr/share/nginx/html/config.js.tmp /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/inject-config.sh && \
    chmod +x /docker-entrypoint.d/inject-config.sh

EXPOSE 80

# NGINX starts automatically from the base image