FROM postgres
ENV POSTGRES_PASSWORD password
ENV POSTGRES_DB world
COPY db/world.sql /docker-entrypoint-initdb.d/
