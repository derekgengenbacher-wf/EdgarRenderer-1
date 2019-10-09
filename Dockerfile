FROM python:3.6 as build

ARG PIP_INDEX_URL
ARG NPM_CONFIG__AUTH
ARG NPM_CONFIG_REGISTRY=https://workivaeast.jfrog.io/workivaeast/api/npm/npm-prod/
ARG NPM_CONFIG_ALWAYS_AUTH=true
ARG GIT_TAG

WORKDIR /build/
ADD . /build/

# Install npm
RUN apt-get update && apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_10.x | bash && \
    apt-get install -y nodejs build-essential

# Build production.min.js
WORKDIR /build/ixviewer-src/gulp

RUN npm install
RUN npm install --save-dev gulp
RUN npm run start

# Assemble edgar renderer files
WORKDIR /build/

RUN mkdir /build/edgarrenderer/
RUN mkdir /build/edgarrenderer/ixviewer_v2/

RUN cp -r /build/conf/ /build/edgarrenderer/conf/
RUN cp -r /build/include/ /build/edgarrenderer/include/
RUN cp -r /build/resources/ /build/edgarrenderer/resources/
RUN cp -r /build/svc_template/ /build/edgarrenderer/svc_template/
RUN cp /build/*.py /build/edgarrenderer/

RUN rm /build/edgarrenderer/include/report.css
RUN rm /build/edgarrenderer/include/Show.js
RUN rm /build/edgarrenderer/setup.py

WORKDIR /build/ixviewer/

# Remove .map references in minified code
RUN sed -i /sourceMappingURL=/d js/lib/bootstrap.min.css
RUN sed -i /sourceMappingURL=/d js/lib/bootstrap.min.js
RUN sed -i /sourceMappingURL=/d js/lib/pickr.es5.min.js

# Assemble the new ix viewer files
RUN cp `find -name \*.min.js` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.min.css` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.woff` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.woff2` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.ttf` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.ico` /build/edgarrenderer/ixviewer_v2/

RUN cp browser-error.html /build/edgarrenderer/ixviewer_v2/
RUN cp ix.html /build/edgarrenderer/ixviewer_v2/
RUN cp js/css/app.css /build/edgarrenderer/ixviewer_v2/
RUN cp js/lib/moment.js /build/edgarrenderer/ixviewer_v2/

WORKDIR /build/

# pypi package creation
# The following command replaces the @VERSION@ string in setup.py with the tagged version number from GIT_TAG
RUN sed -i s/@VERSION@/$GIT_TAG/ setup.py
ARG BUILD_ARTIFACTS_PYPI=/build/dist/*.tar.gz
RUN python setup.py sdist

ARG BUILD_ARTIFACTS_AUDIT=/audit/*
RUN mkdir /audit/
RUN pip freeze > /audit/pip.lock

FROM scratch