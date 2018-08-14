---
layout: default
title: Roteiro - Laravel Básico
permalink: /roteiros/laravel_basico
---

Scripts usados na criação do ambiente do curso de laravel básico, para rodá-los,
exporte seu token para usar a API do github, como por exemplo:

    export token='hdekjhdkjehfkje'

1. Criar um arquivo com lista dos nomes dos repositórios que serão criados, exemplo:

    paulo
    maria
    pedro
    vanessa

2. Script para criação repositórios zerados no github:

    #!/bin/bash
    # run as: ./script1.sh lista.txt

    prefix="disciplina_"
    organization="uspdev-labs"

    while IFS='' read -r line || [[ -n "$line" ]]; do
        curl -H "Authorization: token $token" https://api.github.com/orgs/$organization/repos -d '{"name":"$prefix$line"}'
    done < "$1"

2. Subir repositório base para o curso

    #!/bin/bash
    # run as: ./script2.sh lista.txt

    prefix="disciplina_"
    organization="uspdev-labs"
    base_repo="https://github.com/thiagogomesverissimo/disciplinas_start"
    dest='/tmp/base_repo'

    git clone base_repo $dest
    while IFS='' read -r line || [[ -n "$line" ]]; do
        cd $dest
        rm -rf .git
        git init 
        git add .
        git commit -m 'Initial Commit'
        git remote add origin https://github.com/$organization/$prefix$line.git
        git push origin master
    done < 

3. Criação issues

    #!/bin/bash
    # run as: ./script3.sh

    prefix="disciplina_"
    organization="uspdev-labs"
    issues="https://raw.githubusercontent.com/thiagogomesverissimo/disciplinas_start/master/issues.txt"
    curl -s $issues -o /tmp/issues.txt

    while IFS='' read -r line || [[ -n "$line" ]]; do
      while IFS='' read -r issue || [[ -n "$issue" ]]; do
        curl -H "Authorization: token $token" https://api.github.com/repos/$organization/$prefix$line/issues -d '{"title": "$issue"}'
      done < "/tmp/issues.txt"
    done < "$1"

4. TODO:

 - mysql
 - apache
 - jenkins
 - api deploy github


