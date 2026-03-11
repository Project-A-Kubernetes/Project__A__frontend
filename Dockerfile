FROM nginx:alpine

# 1. Clean old HTML
RUN rm -rf /usr/share/nginx/html/*

# 2. Copy frontend assets
COPY src/ /usr/share/nginx/html

# 3. Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 4. Entrypoint script to inject API_BASE_URL at runtime
RUN echo '#!/bin/sh' > /docker-entrypoint.d/inject-config.sh && \
    echo 'echo "Injecting runtime env variables into config.js"' >> /docker-entrypoint.d/inject-config.sh && \
    echo 'if [ -f /usr/share/nginx/html/config.js ]; then' >> /docker-entrypoint.d/inject-config.sh && \
    echo '  envsubst "$API_BASE_URL" < /usr/share/nginx/html/config.js > /usr/share/nginx/html/config.js.tmp' >> /docker-entrypoint.d/inject-config.sh && \
    echo '  mv /usr/share/nginx/html/config.js.tmp /usr/share/nginx/html/config.js' >> /docker-entrypoint.d/inject-config.sh && \
    echo 'else' >> /docker-entrypoint.d/inject-config.sh && \
    echo '  echo "config.js not found! Exiting."' >> /docker-entrypoint.d/inject-config.sh && \
    echo '  exit 1' >> /docker-entrypoint.d/inject-config.sh && \
    echo 'fi' >> /docker-entrypoint.d/inject-config.sh && \
    echo 'exec "$@"' >> /docker-entrypoint.d/inject-config.sh && \
    chmod +x /docker-entrypoint.d/inject-config.sh

# 5. Expose port 80
EXPOSE 80
