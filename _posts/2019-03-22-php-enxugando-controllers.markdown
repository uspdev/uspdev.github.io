---
layout: default
title:  "Hangout 22/03/2019 às 15h00: Enxugando controllers no Laravel"
permalink: /posts/php-enxugando-controllers
tags: hangout
author: thiagogomesverissimo
---

<h2>Hangout 22/03/2019 às 15h00: Enxugando controllers no Laravel</h2>

Neste hangout conversaremos sobre controllers, namespace, autoload etc no PHP, em especial,
o que fazer quando o controller está passando aquelas 1000 linhas... e
precisamos organizar melhor esse código. 

[Controller de exemplo](https://github.com/uspdev/ccg/blob/master/app/Http/Controllers/GraduacaoController.php)

Este Controller do sistema uspdev/ccg tem uns 5 métodos que talvez nem deveriam estar lá. Em especial o <strong>extenso</strong> método creditos() que retorna as informações do aluno, créditos obtidos e o que ainda falta para o aluno se formar.

Seguindo o exemplo do [vídeo](https://www.youtube.com/watch?v=dNJXN70Nqt0#t=48m50s), vamos ver o que pode ser feito para melhorar tudo isso. A partir de 48'50" começa a falar sobre enxugar o código e inclusive em 50'00" faz uma analogia interessante sobre <em>"buracos negros" e "tirar água do navio"</em>. Apesar de ser sobre Python/Django, isso se aplica perfeitamente ao PHP/Laravel. Lembrando que: no <strong>Django as Views são os Controllers no Laravel</strong>.

Hangout gravado: [https://www.youtube.com/watch?v=36fUTzHUQjA](https://www.youtube.com/watch?v=36fUTzHUQjA)
