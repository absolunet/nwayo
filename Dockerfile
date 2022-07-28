ARG NODEJS_VERSION
FROM node:$NODEJS_VERSION
WORKDIR /nwayo
COPY . .

RUN ["apt-get", "update"]
RUN ["apt-get", "install", "-y", "vim", "nano"]

RUN echo 'alias ls="ls --color"' >> ~/.bashrc && \
    echo 'alias ll="ls -laF --color"' >> ~/.bashrc && \
    echo 'alias ..="cd .."' >> ~/.bashrc && \
    echo 'alias ...="cd ../.."' >> ~/.bashrc && \
    echo 'alias ....="cd ../../.."' >> ~/.bashrc && \
    echo 'alias .....="cd ../../../.."' >> ~/.bashrc

ARG NODEJS_VERSION
RUN echo 'export PS1="\n$(tput setaf 2)🌰 (Node.js $(node --version) / npm $(npm --version)) $(tput sgr0)- $(tput setaf 4)\w\n$(tput sgr0) ▶ "' >> ~/.bashrc
