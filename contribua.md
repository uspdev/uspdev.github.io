---
layout: default
title: Contribua
permalink: /contribua
---

## Para contribuir com os projetos do *USPdev* sugerimos que siga esse *workflow*:

1. Escolher um projeto/sistema da [lista](https://uspdev.github.io/sistemas) 
2. Escolher uma issue ou criar uma
3. Fazer um fork do repositório do projeto que deseja contribuir
4. Clonar seu fork
5. Criar uma branch
6. Fazer as mudanças necessárias para resolver a issue e *commitar*
7. Enviar um push para o fork remoto 
8. Criar um *pull request* no interface do github
9. (extra) Se trabalha na USP, solicite o ingresso na organization USPdev!

Se preferir, assista um vídeo com os passos:
<iframe width="560" height="315" src="https://www.youtube.com/embed/8I-kY_LzJCg" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Para contribuir com os slides dos treinamentos usando o [*prez*](https://github.com/byteclubfr/prez), sugerimos os seguinte *workflow*:

1. Garantir que o nodejs esteja instalado
2. Instalar o prez globalmente com: sudo npm install -g prez phantomjs 
3. Fazer um fork do repositório *slides* e escolher um dos [treinamentos](https://uspdev.github.io/treinamentos).
4. Verificar issues existentes, escolher ou criar uma
5. Clonar o fork 
6. Criar uma branch e acessar a pasta do treinamento que quer contribuir 
7. Criar os arquivos markdown. Lembrando que os nomes dos arquivos iniciam com sequência numérica (ex: 01-intro.md, 02-install.md, 03-database.md etc). Commitar mudanças.
8. Enviar um push para o fork remoto 
9. Criar um *pull request* no interface do github
10. (extra) Se trabalha na USP, solicite o ingresso na organization USPdev!

Se preferir, assista um vídeo com os passos:

<iframe width="560" height="315" src="https://www.youtube.com/embed/c5kOUpstLMY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Para editar esse site ou enviar novos posts:

Como usamos o processamento do jekyll através do github, para alterar esse blog, basta cloná-lo e enviar um push (ém sempre bom usar as boas práticas: issues e PRs):

<iframe width="560" height="315" src="https://www.youtube.com/embed/kRgvskeaMa0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Extra: Mantendo seu fork sincronizado :shipit:

Existe uma documentação do próprio GitHub que você pode encontrar [aqui](https://help.github.com/articles/syncing-a-fork/)

Versão curta:

Espere seu `pull request` ser aceito. Depois disso, você deve integrar ao seu fork, as modificações que os mantenedores do projeto integraram na branch principal (geralmente é a `master`).

```shell
# Adicione um remoto apontando para o projeto principal:
git remote add upstream <remote address>
# Baixe sem merge:
git fetch upstream
# Mescle o master de upstream e integre com seu fork:
git checkout master
git merge upstream/master
git push origin master

```

Depois disso, seu fork já deve estar sincronizado com o repositório principal :sunglasses:
