FROM nginx:alpine

# Copy source code
RUN rm -rf /usr/share/nginx/html/*
COPY src/ /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf 

# Create entrypoint script to inject env vars at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/inject-config.sh && \
    echo 'echo "Injecting runtime env variables into config.js"' >> /docker-entrypoint.d/inject-config.sh && \
    echo 'envsubst '\''$API_BASE_URL'\'' < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js.tmp' >> /docker-entrypoint.d/inject-config.sh && \
    echo 'mv /usr/share/nginx/html/config.js.tmp /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/inject-config.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.d/inject-config.sh && \
    chmod +x /docker-entrypoint.d/inject-config.sh

EXPOSE 80

# Use the default NGINX entrypoint (already included in nginx:alpine)