# Código fonte para o site uspdev.github.io

Este site usa jekyll - https://jekyllrb.com/

# Configuração para teste local

Principais passos para subir uma instância local de teste do site. Rodado no mint 19 (ubuntu 18.04)

## Instalação das bibliotecas

    apt install ruby-full
    apt install build-essential 
    apt install bundler
    apt install jekyll

## Clone do repositório

Faça um fork e um clone do repositório. Dentro da pasta clonada:

    bundle update
    bundle exec jekyll serve

