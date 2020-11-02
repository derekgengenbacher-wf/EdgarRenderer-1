FROM amazonlinux:2 as build

ARG PIP_INDEX_URL
ARG NPM_CONFIG__AUTH
ARG NPM_CONFIG_REGISTRY=https://workivaeast.jfrog.io/workivaeast/api/npm/npm-prod/
ARG NPM_CONFIG_ALWAYS_AUTH=true
ARG GIT_TAG

WORKDIR /build/
ADD . /build/

# Install npm
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash && \
    yum install -y \
        nodejs \
        python3-devel && \
    yum groupinstall -y "Development Tools" && \
    rm -rf /var/cache/yum

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

# Remove .map references in minified code for ixviewer-v2
RUN sed -i /sourceMappingURL=/d js/lib/bootstrap.min.js
RUN sed -i /sourceMappingURL=/d js/lib/vanilla-picker.min.js

# Assemble ixviewer-v2 files
RUN cp `find -name \*.min.js` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.min.css` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.woff` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.woff2` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.ttf` /build/edgarrenderer/ixviewer_v2/
RUN cp `find -name \*.ico` /build/edgarrenderer/ixviewer_v2/

RUN cp browser-error.html /build/edgarrenderer/ixviewer_v2/
RUN cp ix.html /build/edgarrenderer/ixviewer_v2/
RUN cp js/css/app.css /build/edgarrenderer/ixviewer_v2/
RUN cp js/css/custom-bootstrap.css /build/edgarrenderer/ixviewer_v2/
RUN cp js/lib/he.js /build/edgarrenderer/ixviewer_v2/
RUN cp js/lib/moment.js /build/edgarrenderer/ixviewer_v2/

WORKDIR /build/

# pypi package creation
# The following command replaces the @VERSION@ string in setup.py with the tagged version number from GIT_TAG
RUN sed -i s/@VERSION@/$GIT_TAG/ setup.py
ARG BUILD_ARTIFACTS_PYPI=/build/dist/*.tar.gz
RUN python3 setup.py sdist

ARG BUILD_ARTIFACTS_AUDIT=/audit/*
RUN mkdir /audit/
RUN pip3 freeze > /audit/pip.lock

FROM drydock-prod.workiva.net/workiva/wf_arelle:latest-release AS wf-arelle-test-consumption
USER root
ARG BUILD_ID
RUN yum update -y && \
    yum upgrade -y && \
    yum autoremove -y && \
    yum clean all && \
    rm -rf /var/cache/yum
COPY --from=build /build/dist/*.tar.gz /test.tar.gz
RUN pip3 install /test.tar.gz
USER nobody
