---
layout: default
title:  "Hangout 20/09/2019 às 15h00: Consumo de dados do replicado por API"
permalink: /posts/replicado-ws
tags: hangout
author: thiagogomesverissimo
---
<h2>Hangout 20/09/2019 às 15h00: Consumo de dados do replicado por API</h2>

Sistemas locais nas unidades dependem fortemente da integração dos dados
disponíveis nos sistemas corporativos, evitando retrabalho dos usuários desses
sistemas. Atualmente a via oficial de integração das aplicações locais com
os sistemas corporativos é via banco de dados replicado (mssql ou sybase), onde
é mantida uma base sql local que de tempos em tempos é sincronizada com a base
oficial.

Esse modelo, em primeira instância, sugere que aplicações locais 
conheçam o modelo de estruturação dos dados da base corporativa, 
que apesar de muito bem documentada, nos obriga
a inserir código de uma modelagem externa ao sistema. Normalmente há mais que
um sistema local que utiliza os dados do replicado, assim essa situação é 
multiplica pelo número de sistemas. 

Para a linguagem PHP foi criado há um ano o projeto [replicado](https://github.com/uspdev/replicado)
que nada mais é que uma biblioteca que oferece um conjunto de métodos estáticos
que abstraem algumas consultas básicas ao replicado. Com essa abordagem
trocamos consultas longas em SQL no sistema por chamada de métodos, tornando
a leitura do código mais fácil.

Ocorre que há diversas linguagens de programação e não é incomum que na mesma
unidade haja sistemas com diferentes linguagens. O modelo mais genérico
neste caso seria então usar uma API para troca de dados com json, onde qualquer 
sistema local poderia consumir esses dados de forma mais fluída independente
do PHP ou de consultas SQL.

O [@masakik](https://github.com/masakik) iniciou o embrião para implementação
dessa ideia no projeto [replicado-ws](https://github.com/uspdev/replicado-ws)
que está aberto a contribuições e melhorias via os tradicionais Pull Requests e issues.
Neste hangout vamos conversar sobre o projeto *replicado-ws*, seus rumos e perspectivas.
