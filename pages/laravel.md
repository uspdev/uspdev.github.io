---
layout: default
title: Treinamentos
permalink: /laravel
---

# Laravel no contexto da USP 

Este material está estruturado para utilização em 
oficinas de introdução ao framework numa perspectiva mais genérica e com foco
em sistemas da Universidade de São Paulo.
Assim, é possível encontrar certas omissões propositais ou práticas não comuns
da comunidade, que são tratadas no contexto de oficinas.

<ul id="toc"></ul>

## 0. Preparação da infraestrutura de desenvolvimento

Instalação de componentes básicos para desenvolvermos para o Laravel
usando Debian e derivados. Verifique o procedimento correspondente
para seu sistema operacional.

### 0.1 Configuração do git

    sudo apt install git
    git config --global user.name "Fulano da Silva"
    git config --global user.email "fulano@usp.br"

Criar conta no github e adicionar a chave pública gerada dessa forma:

    ssh-keygen
    cat ~/.ssh/id_rsa.pub

### 0.2 Criando usuário admin para uso geral no mariadb

    sudo apt install mariadb-server
    sudo mariadb
    GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%'  IDENTIFIED BY 'admin' WITH GRANT OPTION;
    quit
    exit

### 0.3 Instalar dependências mínimas para laravel:

     sudo apt install php curl php-xml php-intl php-mbstring php-mysql php-curl php-sybase

### 0.4 Instalar o composer:

    curl -s https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer

Esse vídeo é usado na FFLCH quando novos estagiários(as) 
entram na equipe e demonstra como preparar o ambiente com Debian 10
virtualizado no virtualbox:
[https://youtu.be/qImwzkP0nQE](https://youtu.be/qImwzkP0nQE)

## 1. MVC - Model View Controller
https://youtu.be/W9mogh4nczA 

### 1.1 Request e Response ou Pergunta e Resposta

Criando uma rota para recebimento das requisições.
{% highlight php %}
Route::get('/livros', function () {
    echo "Não há livros cadastrados nesses sistema ainda!";
});
{% endhighlight %}

### 1.2 Controller

Vamos começar a espalhar mais o tratamento das requisições em uma arquitetura
convencional?

Criando um controller:
{% highlight bash %}
php artisan make:controller LivroController
{% endhighlight %}
O arquivo criado está em `app/Http/Controllers/LivroController.php`.

Vamos criar um método chamado `index()` dentro do controller gerado:
{% highlight php %}
public function index(){
    return "Não há livros cadastrados nesses sistema ainda!";
}
{% endhighlight %}

Vamos alterar nossa rota para apontar para o método `index()`
do `LivroController`:

{% highlight php %}
use App\Http\Controllers\LivroController;
Route::get('/livros', [LivroController::class,'index']);
{% endhighlight %}

E se quisermos passar uma parâmetro no endereço da requisição?
Exemplo, suponha que o ISBN do livro "Quincas Borba" seja 9780195106817.
Se fizermos `/livros/9780195106817` queremos que nosso sistema identifique
o livro.

Assim, vamos adicionar um novo método chamado `show($isbn)` que recebe o isbn
e deverá fazer a lógica de identificação do livro.

{% highlight php %}
public function show($isbn){
    if($isbn == '9780195106817') {
        return "Quincas Borba - Machado de Assis";
    } else {
        return "Livro não identificado";
    }
}
{% endhighlight %}

Por fim, adicionemos a rota prevendo o recebimento do isbn:
{% highlight php %}
Route::get('/livros/{isbn}', [LivroController::class, 'show']);
{% endhighlight %}

### 1.3 View: Blade

Vamos melhorar os retornos do controller?
A principal característica do sistema de template é a herança. Então, vamos
começar criando um template principal `resources/view/main.blade.php` 
com seções genéricas:

{% highlight html %}
{% raw %}
<!DOCTYPE html>
<html>
    <head>
        <title>@section('title') Exemplo @show</title>
    </head>
    <body>
        @yield('content')
    </body>
</html>
{% endraw %}
{% endhighlight %}

Primeiramente, vamos criar o template para o index `resources/views/livros/index.blade.php`:
obedecendo a estrutura:

{% highlight html %}
{% raw %}
@extends('main')
@section('content')
  Não há livros cadastrados nesse sistema ainda!
@endsection
{% endraw %}
{% endhighlight %}

E mudamos o controller para chamar essa view:
{% highlight php %}
public function index(){
    return view(livros.index);
}
{% endhighlight %}

Podemos enviar variáveis diretamente para o template e com alguma
cautela, podemos até implementar parte da lógica do nosso sistema no template,
pois o blade é uma linguagem de programação:

{% highlight php %}
public function show($isbn){
    if($isbn == '9780195106817') {
        $livro = "Quincas Borba - Machado de Assis";
    } else {
        $livro = "Livro não identificado";
    }
    return view('livros.show', [
        'livro' => $livro
    ]);
}
{% endhighlight %}

O template `resources/views/livros/show.blade.php` ficará assim:

{% highlight html %}
{% raw %}
@extends('main')
@section('content')
  {{ $livro }}
@endsection
{% endraw %}
{% endhighlight %}

### 1.4 Model

Vamos inserir nossos livros no banco de dados?
Para tal, vamos criar uma tabela chamada `livros` no banco dados 
por intermédio de uma migration e um model `Livro` para operarmos nessa tabela.

{% highlight bash %}
php artisan make:migration create_livros_table --create='livros'
php artisan make:model Livro
{% endhighlight %}

Na migration criada vamos inserir os campos: titulo, autor e isbn,
deixando o autor como opcional.

{% highlight php %}
$table->string('titulo');
$table->string('autor')->nullable();
$table->string('isbn');
{% endhighlight %}

Usando uma espécie de `shell` do laravel, o tinker, vamos inserir
o registro do livro do Quincas Borba:

{% highlight bash %}
php artisan tinker
$livro = new App\Models\Livro;
$livro->titulo = "Quincas Borba";
$livro->autor = "Machado de Assis";
$livro->isbn = "9780195106817";
$livro->save();
quit
{% endhighlight %}

Insira mais livros!
Veja que o model `Livro` salvou os dados na tabela `livros`. Estranho não?
Essa é uma da inúmeras convenções que vamos nos deparar ao usar um framework.

Vamos modificar o controller para operar com os livros do banco de dados?
No método index vamos buscar todos livros no banco de dados e enviar para
o template:
{% highlight php %}
public function index(){
    $livros = App\Models\Livro:all();
    return view('livros.index',[
        'livros' => $livros
    ]);
}
{% endhighlight %}

No template podemos iterar sobre todos livros recebidos do controller:
{% highlight php %}
{% raw %}
@forelse ($livros as $livro)
    <li>{{ $livro->titulo }}</li>
    <li>{{ $livro->autor }}</li>
    <li>{{ $livro->isbn }}</li>
@empty
    Não há livros cadastrados
@endforelse
{% endraw %}
{% endhighlight %}

No método `show` vamos buscar o livro com o isbn recebido e entregá-lo
para o template:

{% highlight php %}
public function show($isbn){
    $livro = App\Moldes\Livro::where('isbn',$isbn)->first();
        return view('livros.show',[
            'livro' => $livro
        ]);
}
{% endhighlight %}

No template vamos somente mostrar o livro:
{% highlight php %}
{% raw %}
<li>{{ $livro->titulo }}</li>
<li>{{ $livro->autor }}</li>
<li>{{ $livro->isbn }}</li>
{% endraw %}
{% endhighlight %}

Perceba que parte do código está repetida no index e no show do blade.
Para melhor organização é comum criar um diretório `resources/views/livros/partials`
para colocar pedaços de templates. Neste caso poderia ser 
`resources/views/livros/partials/fields.blade.php` e nos templates index e show
o chamaríamos como:

{% highlight php %}
{% raw %}
@include('livros.partials.fields')
{% endraw %}
{% endhighlight %}

### 1.5 Fakers

Durante o processo de desenvolvimento precisamos manipular dados
constantemente, então é uma boa ideia gerar alguns dados aleatórios (faker)
e outros controlados (seed) para não termos que sempre criá-los manualmente:

{% highlight bash %}
php artisan make:factory LivroFactory --model='Livro'
php artisan make:seed LivroSeeder
{% endhighlight %}

Inicialmente, vamos definir um padrão para geração de
dados aleatório `database/factories/LivroFactory.php`:

{% highlight php %}
return [
    'titulo' => $this->faker->sentence(3),
    'isbn'   => $this->faker->ean13(),
    'autor'  => $this->faker->name
];
{% endhighlight %}

Em `database/seeders/LivroSeeder.php` vamos criar ao menos um registro
de controle e chamar o factory para criação de 15 registros aleatórios.

{% highlight php %}
$livro = [
    'titulo' => "Quincas Borba",
    'autor'  => "Machado de Assis",
    'isbn'       => "9780195106817"
];
\App\Models\Livro::create($livro);
\App\Models\Livro::factory(15)->create();
{% endhighlight %}

Rode o seed e veja que os dados foram criados:
{% highlight bash %}
php artisan db:seed --class=LivroSeeder
{% endhighlight %}

Depois de testado e funcionando insira seu seed em 
`database/seeders/DatabaseSeeder` para ser chamado globalmente:

{% highlight php %}
public function run()
{
    $this->call([
        UserSeeder::class,
        LivroSeeder::class
    ]);
}
{% endhighlight %}

Se precisar zerar o banco e subir todos os seeds na sequência:
{% highlight bash %}
php artisan migrate:fresh --seed
{% endhighlight %}

### 1.6 Exercício MVC

- Implementação de um model chamado `LivroFulano`, onde `Fulano` é um identificador seu. 
- Implementar a migration correspondente com os campos: titulo, autor e isbn.
- Implementar seed com ao menos um livro de controle
- Implementar o faker com ao menos 10 livros
- Implementar controller com os métodos index e show com respectivos templates e rotas 
- Implementar os templates (blades) correspondentes
- Observações:
  - O diretório dos templates deve ser: `resources/views/livro_fulanos`
  - As rotas devem ser prefixadas desse maneira: `livro_fulanos/{livro}`

Neste exercício você criará ou editará os seguintes arquivos:

    routes/web.php
    database/seeders/DatabaseSeeder.php
    app/Models/LivroFulano.php
    app/Http/Controllers/LivroFulanoController.php
    database/seeders/LivroFulanoSeeder.php
    database/factories/LivroFulanoFactory.php
    database/migrations/202000000000_create_livro_fulanos_table.php
    resources/views/livro_fulanos/index.blade.php
    resources/views/livro_fulanos/show.blade.php
    resources/views/livro_fulanos/partials/fields.blade.php

## 2. CRUD: Create (Criação), Read (Consulta), Update (Atualização) e Delete (Destruição)
https://youtu.be/W9mogh4nczA 

### 2.1 Limpando ambiente

Neste ponto conhecemos um pouco do jargão e da estrutura usada pelo laravel para 
implementar a arquitetura MVC.
Frameworks como o laravel são flexíveis o suficiente para serem customizados ao seu gosto.
Porém, sou partidário da ideia de seguir convenções quando possível. Por isso começaremos
criando a estrutura básica para implementar um CRUD clássico na forma mais simples.
Esse CRUD será modificado ao longo do texto.

Apague (faça backup se quiser) o model, controller, seed, factory e migration,
mas não delete os arquivos blades, pois eles serão reutilizados:

{% highlight bash %}
rm app/Models/Livro.php
rm app/Http/Controllers/LivroController.php
rm database/seeders/LivroSeeder.php
rm database/factories/LivroFactory.php
rm database/migrations/202000000000_create_livros_table.php
{% endhighlight %}

### 2.1 Criando model, migration, controller, faker e seed para implementação do CRUD

Vamos recriar tudo novamente usando o comando:
{% highlight bash %}
php artisan make:model Livro --all
{% endhighlight %}

Perceba que a migration, o faker, o seed e o controller estão automaticamente
conectados ao model Livro. E mais, o controller contém todos métodos
necessários para as operações do CRUD, chamado do laravel de `resource`.
Ao invés de especificarmos uma a uma a rota para cada operação, podemos
simplesmente seguir a convenção e substituir a definição anterior por:

{% highlight php %}
Route::resource('livros', LivroController::class);
{% endhighlight %}

Segue uma implementação simples de cada operação:
{% highlight php %}
public function index()
{
    $livros =  Livro::all();
    return view('livros.index',[
        'livros' => $livros
    ]);
}

public function create()
{
    return view('livros.create',[
        'livro' => new Livro,
    ]);
}

public function store(Request $request)
{
    $livro = new Livro;
    $livro->titulo = $request->titulo;
    $livro->autor = $request->autor;
    $livro->isbn = $request->isbn;
    $livro->save();
    return redirect("/livros/{$livro->id}");
}

public function show(Livro $livro)
{
    return view('livros.show',[
        'livro' => $livro
    ]);
}

public function edit(Livro $livro)
{
    return view('livros.edit',[
        'livro' => $livro
    ]);
}

public function update(Request $request, Livro $livro)
{
    $livro->titulo = $request->titulo;
    $livro->autor = $request->autor;
    $livro->isbn = $request->isbn;
    $livro->save();
    return redirect("/livros/{$livro->id}");
}

public function destroy(Livro $livro)
{
    $livro->delete();
    return redirect('/livros');
}
{% endhighlight %}

Criando os arquivos blades:

{% highlight bash %}
mkdir -p resources/views/livros/partials
cd resources/views/livros
touch index.blade.php create.blade.php edit.blade.php show.blade.php 
touch partials/form.blade.php partials/fields.blade.php
{% endhighlight %}

Uma implementação básica de cada template:
{% highlight html %}
{% raw %}

<!-- ###### partials/fields.blade.php ###### -->
<ul>
  <li><a href="/livros/{{$livro->id}}">{{ $livro->titulo }}</a></li>
  <li>{{ $livro->autor }}</li>
  <li>{{ $livro->isbn }}</li>
  <li>
    <form action="/livros/{{ $livro->id }} " method="post">
      @csrf
      @method('delete')
      <button type="submit" onclick="return confirm('Tem certeza?');">Apagar</button> 
    </form>
  </li> 
</ul>

<!-- ###### index.blade.php ###### -->
@extends('main')
@section('content')
  @forelse ($livros as $livro)
    @include('livros.partials.fields')
  @empty
    Não há livros cadastrados
  @endforelse
@endsection

<!-- ###### show.blade.php ###### -->
@extends('main')
@section('content')
  @include('livros.partials.fields')
@endsection  

<!-- ###### partials/form.blade.php ###### -->
Título: <input type="text" name="titulo" value="{{ $livro->titulo }}">
Autor: <input type="text" name="autor" value="{{ $livro->autor }}">
ISBN: <input type="text" name="isbn" value="{{ $livro->isbn }}">
<button type="submit">Enviar</button>

<!-- ###### create.blade.php ###### -->
@extends('main')
@section('content')
  <form method="POST" action="/livros">
    @csrf
    @include('livros.partials.form')
  </form>
@endsection

<!-- ###### edit.blade.php ###### -->
@extends('main')
@section('content')
  <form method="POST" action="/livros/{{ $livro->id }}">
    @csrf
    @method('patch')
    @include('livros.partials.form')
  </form>
@endsection

{% endraw %}
{% endhighlight %}

Conhecendo o sistema de herança do blade, podemos extender qualquer template,
inclusive de biblioteca externas. Existem diversas implementações do AdminLTE na
internet e você pode implementar uma para sua unidade, por exemplo. Aqui vamos
usar [https://github.com/uspdev/laravel-usp-theme](https://github.com/uspdev/laravel-usp-theme). 
Consulte a documentação para informações de como instalá-la. No nosso 
template principal `main.blade.php` vamos apagar o que tínhamos antes e
apenas extender essa biblioteca:

{% highlight html %}
{% raw %}
@extends('laravel-usp-theme::master')
{% endraw %}
{% endhighlight %}

Dentre outras vantagens, ganhamos automaticamente o carregamento de frameworks
como o bootstrap, fontawesome e jquery.mask, dentre outros.

Se quisermos carregar um arquivo js ou css, os colocamos na pasta public.
Por exemplo, `public/js/livro.js`:

{% highlight javascript %}
jQuery(function ($) {
    //978-85-333-0398-0
    $(".isbn").mask('000-00-000-0000-0');
});
{% endhighlight %}

E no blade do laravel-usp-theme há uma seção chamada `javascripts_head` que podemos
carregar no `form.blade.php`:
{% highlight html %}
{% raw %}
@section('javascripts_head')
<script type="text/javascript" src="{ { asset('js/livro.js') } }"></script>
@endsection
{% endraw %}
{% endhighlight %}

### 2.3 Exercício CRUD

- Implementação de um CRUD completo para o model `LivroFulano`, onde `Fulano` é um identificador seu. 
- Todas operações devem funcionar: criar, editar, ver, listar e apagar
- Você só precisa implementar o crud, o repositório base já contém o laravel-usp-theme, assim, 
depois de sincronizar seu repositório com upstream, rode `composer install`.

Neste exercício você criará ou editará os seguintes arquivos:

    routes/web.php
    database/seeders/DatabaseSeeder.php
    app/Models/LivroFulano.php
    app/Http/Controllers/LivroFulanoController.php
    database/seeders/LivroFulanoSeeder.php
    database/factories/LivroFulanoFactory.php
    database/migrations/202000000000_create_livro_fulanos_table.php
    resources/views/livro_fulanos/index.blade.php
    resources/views/livro_fulanos/show.blade.php
    resources/views/livro_fulanos/create.blade.php
    resources/views/livro_fulanos/edit.blade.php
    resources/views/livro_fulanos/partials/fields.blade.php
    resources/views/livro_fulanos/partials/form.blade.php

## 3. Validação
https://youtu.be/W9mogh4nczA 

### 3.1 Mensagens flash

Da maneira como implementamos o CRUD até então, qualquer valor que o usuário
digitar no cadastro ou edição será diretamente enviado ao banco da dados.
Vamos colocar algumas regras de validação no meio do caminho.
Por padrão, em todo arquivo blade existe o array `$errors` que é sempre
inicializado pelo laravel. Quando uma requisição não passar na validação, o laravel
colocará as mensagens de erro nesse array automaticamente. Assim, basta que no
nosso arquivo principal do blade, façamos uma iteração nesse array:

{% highlight html %}
{% raw %}
@section('flash')
    @if ($errors->any())
    <div class="alert alert-danger">
        <ul>
            @foreach ($errors->all() as $error)
            <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
    @endif
@endsection
{% endraw %}
{% endhighlight %}

Além disso, podemos manualmente no nosso controller enviar uma mensagem `flash`
para o sessão assim: `request()->session()->flash('alert-info','Livro cadastrado com sucesso')`.
Como nosso template principal usa o bootstrap, podemos estilizar nossas
mensagens flash com os valores danger, warning, success e info:

{% highlight html %}
{% raw %}
<div class="flash-message">
  @foreach (['danger', 'warning', 'success', 'info'] as $msg)
    @if(Session::has('alert-' . $msg))
      <p class="alert alert-{{ $msg }}">{{ Session::get('alert-' . $msg) }}
        <a href="#" class="close" data-dismiss="alert" aria-label="fechar">&times;</a>
      </p>
    @endif
  @endforeach
</div>
{% endraw %}
{% endhighlight %}

### 3.2 Validação no Controller

Quando estamos dentro de um método do controller, a forma mais rápida de validação é
usando `$request->validate`, que validará os campos com as condições que 
passarmos e caso falhe a validação, automaticamente o usuário é retornado 
para página de origem com todos inputs que foram enviados na requisição, além da
mensagens de erro:

{% highlight php %}
$request->validate([
  'titulo' => 'required',
  'autor' => 'required',
  'isbn' => 'required|integer',
]);
{% endhighlight %}

Podemos usar a função `old('titulo',$livro->titulo)` nos formulários, que 
verifica se há inputs na sessão e em caso negativo usa o segundo parâmetro.
Assim, podemos deixar o partials/form.blade.php mais elegante:

{% highlight html %}
{% raw %}
Título: <input type="text" name="titulo" value="{{old('titulo', $livro->titulo)}}">
Autor: <input type="text" name="autor" value="{{old('autor', $livro->autor)}}">
ISBN: <input type="text" name="isbn" value="{{old('isbn', $livro->isbn)}}">
{% endraw %}
{% endhighlight %}

### 3.3 Validação com a classe Validator

O `$request->validate` faz tudo para nós. Mas se por algum motivo você precisar
interceder na validação, no que é retornado e para a onde, pode-se usar
diretamente `Illuminate\Support\Facades\Validator`:

{% highlight php %}
use Illuminate\Support\Facades\Validator;
...
$validator = Validator::make($request->all(),[
  'titulo' => 'required'
]);
if($validator->fails()){
  return redirect('/node/create')
          ->withErrors($validator)
          ->withInput();
}
{% endhighlight %}

### 3.4 FormRequest

Se olharmos bem para os métodos store e update veremos que eles
são muito próximos. Se tivéssemos uns 20 campos, esses dois métodos
cresceriam juntos, proporcionalmente. Ao invés de atribuirmos campo
a campo a criação ou edição de um livro, vamos fazer uma atribuição 
em massa, para isso, no model vamos proteger o id, isto é, numa atribuição
em massa, o id não poderá ser alterado, em `app/Models/Livro.php`
adicione a linha `protected $guarded = ['id'];`.

A validação, que muitas vezes será idêntica no store e no update, vamos
delegar para um FormRequest. Crie um FormRequest com o artisan:
{% highlight bash %}
php artisan make:request LivroRequest
{% endhighlight %}

Esse comando gerou o arquivo `app/Http/Requests/LivroRequest.php`. Como
ainda não falamos de autenticação e autorização, retorne `true` no método
`authorize()`. As validações podem ser implementada em `rules()`.
Perceba que o isbn pode ser digitado com traços ou ponto, mas eu
só quero validar a parte numérica do campo e ignorar o resto, 
para isso usei o método `prepareForValidation`:

{% highlight php %}
public function rules(){
    $rules = [
        'titulo' => 'required',
        'autor'  => 'required',
        'isbn' => 'required|integer',
    ];
    return $rules;
}
protected function prepareForValidation()
{
    $this->merge([
        'isbn' => preg_replace('/[^0-9]/', '', $this->isbn),
    ]);
}
{% endhighlight %}

Não queremos livros cadastrados com o mesmo isbn. Há uma validação
chamada `unique` que pode ser invocada na criação de um livro como 
`unique:TABELA:CAMPO`, mas na edição, temos que ignorar o próprio livro
assim `unique:TABELA:CAMPO:ID_IGNORADO`. Dependendo do
seu projeto, talvez seja melhor fazer um formRequest para criação e 
outro para edição. Eu normalmente uso apenas um para ambos. Como abaixo,
veja que as mensagens de erros podem ser customizadas com o método
`messages()`:

{% highlight php %}
public function rules(){
    $rules = [
        'titulo' => 'required',
        'autor'  => 'required',
        'isbn' => ['required','integer'],
    ];
    if ($this->method() == 'PATCH' || $this->method() == 'PUT'){
        array_push($rules['isbn'], 'unique:livros,isbn,' .$this->livro->id);
    }
    else{
        array_push($rules['isbn'], 'unique:livros');
    }
    return $rules;
}
protected function prepareForValidation()
{
    $this->merge([
        'isbn' => preg_replace('/[^0-9]/', '', $this->isbn),
    ]);
}
public function messages()
{
    return [
        'cnpj.unique' => 'Este isbn está cadastrado para outro livro',
    ];
}
{% endhighlight %}

No formRequest existe um método chamado `validated()` que devolve um 
array com os dados validados.
Vamos invocar o LivroRequest no nosso controller e deixar os
métodos store e update mais simplificados:

{% highlight php %}
use App\Http\Requests\LivroRequest;
...
public function store(LivroRequest $request)
{
    $validated = $request->validated();
    $livro = Livro::create($validated);
    request()->session()->flash('alert-info','Livro cadastrado com sucesso');
    return redirect("/livros/{$livro->id}");
}

public function update(LivroRequest $request, Livro $livro)
{
    $validated = $request->validated();
    $livro->update($validated);
    request()->session()->flash('alert-info','Livro atualizado com sucesso');
    return redirect("/livros/{$livro->id}");
}
{% endhighlight %}

### 3.5 Exercício FormRequest

- Implementação do FormRequest `LivroFulanoRequest`, onde `Fulano` é um identificador
seu.
- Alterar `LivroFulanoController` para usar `LivroFulanoRequest` nos métodos store e update.

## 4. Autenticação e Relationships
https://youtu.be/W9mogh4nczA 

### 4.1 Login tradicional

A forma mais fácil de fazer login no laravel é usando 
`auth()->login($user)` ou `Auth::login($user)` em qualquer controller.
Esse método recebe um objeto `$user` da classe `Illuminate\Foundation\Auth\User`.
Por padrão, o model `User` criado automaticamente na instalação
usa essa classe. A migration correspondente criada automaticamente na instalação
possui alguns campos requeridos para lógica interna do login. Vamos acrescentar um
campo na migration chamado `codpes`, que será o número USP de uma pessoa.
Um pouco adiante vamos adicionar outro método de login, que não por senha, mas com 
OAuth,  então vamos deixar a opção `password` como nula:
Assim, em `2014_10_12_000000_create_users_table`:

{% highlight php %}
$table->string('password')->nullable();
$table->string('codpes');
{% endhighlight %}

Automaticamente o laravel também cria um faker básico para `User` em
database/factories/UserFactory.php e usando a biblioteca 
[https://packagist.org/packages/uspdev/laravel-usp-faker](https://packagist.org/packages/uspdev/laravel-usp-faker)
modificaremos o faker para trazer pessoas aleatórios, mas no contexto USP.

Nosso faker de usuário então ficará:
{% highlight php %}
$codpes = $this->faker->unique()->servidor;
return [
    'codpes' => $codpes,
    'name'   => \Uspdev\Replicado\Pessoa::nomeCompleto($codpes),
    'email'  => \Uspdev\Replicado\Pessoa::email($codpes),
    'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
];
{% endhighlight %}   

O seed para User não vem por default, mas podemos criá-lo assim:
{% highlight php %}
php artisan make:seed UserSeeder
{% endhighlight %}  

Vou colocar um usuário de controle:
{% highlight php %}
public function run()
{
    $user = [
        'codpes'   => "123456",
        'email'    => "qualquer@usp.br",
        'name'     => "Fulano da Silva",
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
    ];
    \App\Models\User::create($user);
    \App\Models\User::factory(10)->create();
}
{% endhighlight %}  

Insira a chamada desse seed em `DatabaseSeeder` e limpe o banco
recarregando os novos dados fakers:
{% highlight bash %}
php artisan migrate:fresh --seed
{% endhighlight %}

Com nossa base de usuário populada vamos implementar um login e logout básicos.
Para login local, apesar de são ser obrigatório, pode ser útil usar 
a trait `Illuminate\Foundation\Auth\AuthenticatesUsers` que está no pacote:

{% highlight bash %}
composer require laravel/ui
{% endhighlight %}

Usando a trait `AuthenticatesUsers` no seu controller você ganha os métodos:

- showLoginForm(): requisição GET apontando para `auth/login.blade.php` 
- login(): requisição POST que recebe `email` e `password` e chama automaticamente 
`auth()->login($user)`. 

Assim, basta criarmos as rotas correspondentes. Estou criando uma rota raiz para apontar
para nosso livros.
{% highlight php %}
use App\Http\Controllers\LoginController;
Route::get('login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('login', [LoginController::class, 'login']);
Route::get('/', [LivroController::class, 'index']);
{% endhighlight %}

Mas não queremos usar email para login e sim codpes, para isso, sobrescrevemos
o método `username()`. Nosso controller final ficará assim:

Seu LoginController ficará:
{% highlight php %}
use Illuminate\Foundation\Auth\AuthenticatesUsers;
class LoginController extends Controller
{
    use AuthenticatesUsers;
    protected $redirectTo = '/';
    public function username()
    {
        return 'codpes';
    }
}
{% endhighlight %}

Agora falta implementar o formulário para login `auth/login.blade.php`:

{% highlight html %}
{% raw %}
@extends('main')
@section('content')
<form method="POST" action="/login">
    @csrf
    
    <div class="form-group row">
        <label for="codpes" class="col-sm-4 col-form-label text-md-right">número usp</label>
        <div class="col-md-6">
            <input type="text" name="codpes" value="{{ old('codpes') }}" required>
        </div>
    </div>

    <div class="form-group row">
        <label for="password" class="col-md-4 col-form-label text-md-right">Senha</label>
        <div class="col-md-6">
            <input type="password" name="password" required>
        </div>
    </div>

    <div class="form-group row mb-0">
        <div class="col-md-8 offset-md-4">
            <button type="submit" class="btn btn-primary">Entrar</button>
        </div>
    </div>
</form>
@endsection
{% endraw %}
{% endhighlight %}

### 4.2 logout

No nosso controller de login vamos adicionar um método para logout:
{% highlight php %}
public function logout()
{
    auth()->logout();
    return redirect('/');
}
{% endhighlight %}

Uma boa prática é implementar o logout usando uma requisição POST:

{% highlight php %}
Route::post('logout', [LoginController::class, 'logout']);
{% endhighlight %}

Segue um formulário com o botão para logout:
{% highlight html %}
{% raw %}
<form action="/logout" method="POST" class="form-inline" 
    style="display:inline-block" id="logout_form">
    @csrf
    <a onclick="document.getElementById('logout_form').submit(); return false;"
        class="font-weight-bold text-white nounderline pr-2 pl-2" href>Sair</a>
</form>
{% endraw %}
{% endhighlight %}

O template que estamos usando como base possui esse formulário de logout, 
basta configurarmos algumas opções em `config/laravel-usp-theme.php` e no 
`.env`.

### 4.3 Login externo

O mundo não é perfeito e são raras as vezes que usamos o login local,
pois o mais comum é o sistema fazer parte de um ecossistema onde as pessoas
que vão operá-lo possuem suas senhas em algum outro servidor centralizado, 
como ldap ou oauth.
Na USP, uma das formas de autenticar nosso usuário é por OAuth.
E no laravel, a biblioteca `socialite` nos permite trabalhar com 
o protocolo `OAuth`. Desenvolvermos uma biblioteca
[https://github.com/uspdev/senhaunica-socialite](https://github.com/uspdev/senhaunica-socialite)
que possui a parametrização necessária para o OAuth da USP. Faça a
configuração conforme a documentação. Caso não tenha acesso ao `OAuth`
pode subir um sistema que simula o Oauth da USP [https://github.com/uspdev/senhaunica-faker](https://github.com/uspdev/senhaunica-faker).

Na nossa implementação só permitiremos login dos usuários que existem na
tabela user:
{% highlight php %}
public function handleProviderCallback()
{
    $userSenhaUnica = Socialite::driver('senhaunica')->user();
    $user = User::where('codpes',$userSenhaUnica->codpes)->first();

    if (is_null($user)) {
        request()->session()->flash('alert-danger','Usuário sem acesso ao sistema');
        return redirect('/');
    }

    // bind do dados retornados
    $user->codpes = $userSenhaUnica->codpes;
    $user->email = $userSenhaUnica->email;
    $user->name = $userSenhaUnica->nompes;
    $user->save();
    auth()->login($user, true);
    return redirect('/');
}
{% endhighlight %}

### 4.4 One (User) To Many (Livros)

Primeiramente vamos implementar esse relação no nível do banco de dados.
Na migration dos livros insira:

{% highlight php %}
$table->unsignedBigInteger('user_id')->nullable();
$table->foreign('user_id')->references('id')->on('users')->onDelete('set null');;
{% endhighlight %}

No faker do Livro podemos invocar o faker do user:

{% highlight php %}
'user_id' => \App\Models\User::factory()->create()->id,
{% endhighlight %}

No model Livro podemos criar um método que carregará o objeto
`user` automaticamente:

{% highlight php %}
public function user(){
    return $this->belongsTo(\App\Models\User::class);
}
{% endhighlight %}

Assim no `fields.blade.php` faremos referência direta  a esse usuário:

{% highlight html %}
{% raw %}
<li>Cadastrado por {{ $livro->user->name ?? '' }}</li>
{% endraw %}
{% endhighlight %}

Por fim, no controller, podemos pegar o usuário logado para inserir em user_id assim:

{% highlight php %}
$validated['user_id'] = auth()->user()->id;
{% endhighlight %}

### 4.5 Exercício Relationships

- Atualize seu repositório com o upstream para baixar o faker e seed de usuário
- No model `LivroFulano` e migration correspondente adicione o usuário que cadastrou o livro
seu. 
- mostre esse usuário em `fields.blade.php` das suas views `livros_fulano`
- O método store e update do `LivroFulanoController` deve pegar o id da pessoa logada

## 5. Migration de alteração, campos do tipo select e mutators

### 5.1 Migration de alteração

Quando o sistema está produção, você nunca deve alterar uma migration que já foi
para o ar, mas sim criar uma migration que altera uma anterior. Por exemplo, eu
tenho certeza que o campo `codpes` será sempre inteiro, então farei essa mudança.

Para usar migration de alteração devemos incluir o pacote `doctrine/dbal` e
na sequência criar a migration que alterará a tabela existente:
{% highlight bash %}
composer require doctrine/dbal
php artisan make:migration change_codpes_column_in_users  --table=users
{% endhighlight %}

Alterando a coluna `codpes` de string para integer na migration acima:
{% highlight php %}
$table->integer('codpes')->change();
{% endhighlight %}

Aplique a mudança no banco de dados:
{% highlight bash %}
php artisan migrate
{% endhighlight %}

### 5.2 campos do tipo select 

Vamos supor que queremos um campo adicional na tabela de livros
chamado `tipo`. Já sabemos como criar uma migration de alteração
para alterar a tabela livros:

{% highlight bash %}
php artisan make:migration add_tipo_column_in_livros --table=livros
{% endhighlight %}

E adicionamos na nova coluna:
{% highlight php %}
$table->string('tipo');
{% endhighlight %}

Vamos trabalhar com apenas dois tipos: nacional e internacional.
A lista de tipos poderia vir de qualquer fonte: outro model, api,
csv etc. No nosso caso vamos fixar esse dois tipos em um array e
usar em todo o sistema. No model do livro vamos adicionar um método
estático que retorna os tipos, pois assim, fica fácil mudar caso 
a fonte seja alterada no futuro:

{% highlight php %}
public static function tipos(){
    return [
        'Nacional',
        'Internacional'
    ];
}
{% endhighlight %}
Dependendo do caso, talvez você prefira um array com chave-valor.

No faker, podemos escolher um tipo aleatório assim:
{% highlight php %}
$tipos = \App\Models\Livro::tipos();
...
'tipo' => $tipos[array_rand($tipos)],
{% endhighlight %}
No `LivroSeeder.php` basta fixarmos um tipo.

No `form.blade.php` podemos inserir o tipo com um campo select desta forma:
{% highlight html %}
{% raw %}
<select name="tipo">
    <option value="" selected=""> - Selecione  -</option>
    @foreach ($livro::tipos() as $tipo)
        <option value="{{$tipo}}" {{ ( $livro->tipo == $tipo) ? 'selected' : ''}}>
            {{$tipo}}
        </option>
    @endforeach
</select>
{% endraw %}
{% endhighlight %}

Se quisermos contemplar o `old` para casos de erros de validação:
{% highlight html %}
{% raw %}
<select name="tipo">
    <option value="" selected=""> - Selecione  -</option>
    @foreach ($livro::tipos() as $tipo)
        {{-- 1. Situação em que não houve tentativa de submissão --}}
        @if (old('tipo') == '')
        <option value="{{$tipo}}" {{ ( $livro->tipo == $tipo) ? 'selected' : ''}}>
            {{$tipo}}
        </option>
        {{-- 2. Situação em que houve tentativa de submissão, o valor de old prevalece --}}
        @else
            <option value="{{$tipo}}" {{ ( old('tipo') == $tipo) ? 'selected' : ''}}>
                {{$tipo}}
            </option>
        @endif
    @endforeach
</select>
{% endraw %}
{% endhighlight %}

Por fim, temos que validar o campo tipo para que só entrem os valores do nosso array.
No LivroRequest.php:

{% highlight php %}
use Illuminate\Validation\Rule;
...
'tipo'   => ['required', Rule::in(\App\Models\Livro::tipos())],
{% endhighlight %}

### 5.3 mutators
Há situações em que queremos fazer um leve processamento antes de salvar
um valor no banco de dados e logo após recuperarmos um valor. Vamos 
adicionar um campo para preço. Já sabemos como criar uma migration 
de alteração para alterar a tabela livros:

{% highlight bash %}
php artisan make:migration add_preco_column_in_livros --table=livros
{% endhighlight %}

E adicionamos na nova coluna:
{% highlight php %}
$table->float('preco')->nullable();
{% endhighlight %}

No LivroRequest também deixaremos esse campo como 
opcional: `'preco'  => 'nullable'`. Devemos adicionar
entradas para esse campo  em `fields.blade.php` e `form.blade.php`.

Queremos que o usuário digite, por exemplo, `12,50`, mas guardaremos
`12.5`. Quando quisermos mostrar o valor, vamos fazer a operação
inversa. Poderíamos fazer esse tratamento diretamente no controller,
mas também podemos usar `mutators` diretamente no model do livro:

{% highlight php %}
public function setPrecoAttribute($value){
    $this->attributes['preco'] = str_replace(',','.',$value);
}

public function getPrecoAttribute($value){
    return number_format($value, 2, ',', '');
}
{% endhighlight %}

### 5.4 Exercício de migration de alteração, campos do tipo select e mutators

- No model `LivroFulano` adicione as colunas: tipo e preço
- o campo título só deve aceitar: Nacional ou Internacional
- o campo preço deve prever valores com vírgula na entrada, mas deve ser float no banco. Deve aparecer no blade com vírgula.

## 6. Buscas, paginação e autorização

### 6.1 Busca

Para criarmos um sistema de busca simples, vamos começar colocando o botão
de busca no `index.blade.php`:

{% highlight html %}
{% raw %}
<form method="get" action="/livros">
<div class="row">
    <div class=" col-sm input-group">
    <input type="text" class="form-control" name="search" value="{{ request()->search }}">

    <span class="input-group-btn">
        <button type="submit" class="btn btn-success"> Buscar </button>
    </span>

    </div>
</div>
</form>
{% endraw %}
{% endhighlight %}

No LivroController, basta verificarmos se foi enviado algum valor para o campo
`search`, se sim, fazemos uma busca, e em caso negativo, retornamos todos livros.

{% highlight php %}
public function index(Request $request){
if(isset($request->search)) {
    $livros = Livro::where('autor','LIKE',"%{$request->search}%")
                    ->orWhere('titulo','LIKE',"%{$request->search}%")->get();
} else {
    $livros = Livro::all();
}
{% endhighlight %}

### 6.2 Paginação

Quando o sistema tem muitos registros, pode ser oneroso mostrar tudo numa única
página. O melhor seria fazer a query em blocos, substituindo `all()` ou `get()` por 
`paginate(15)`. Neste caso, no blade usamos a seguinte estrutura para 
navegação em blocos:

{% highlight html %}
{% raw %}
{{ $livros->appends(request()->query())->links() }}
{% endraw %}
{% endhighlight %}

A partir do laravel 8 o bootstrap não é mais padrão, mas podemos configurá-lo
como padrão em `AppServiceProvider.php`:

{% highlight php %}
use Illuminate\Pagination\Paginator;
public function boot()
{
    Paginator::useBootstrap();
}
{% endhighlight %}

### 6.3 Autorização

Definimos níveis de permissões no laravel com um recurso chamado `Gate`.
No geral, a lógica para identificar os níveis de permissões de cada usuário
é intrínseca ao sistema e o laravel nos permite de forma muito flexível
implementar essa lógica, seja ela qual for. No nosso exemplo, vamos criar
um campo boleano chamado `is_admin` no model `User` que será `TRUE` para quem 
for admin do sistema e `FALSE` para quem for um usuário comum:

{% highlight bash %}
php artisan make:migration add_is_admin_to_users_table --table=users
{% endhighlight %}

O campo `is_admin` na migration criada ficará assim:
{% highlight php %}
$table->boolean('is_admin')->default(FALSE);
{% endhighlight %}

E por fim alteramos nosso usuário de controle para ser admin:
{% highlight php %}
public function run()
{
    $user = [
        'codpes'   => "123456",
        'email'    => "qulaquer@usp.br",
        'name'     => "Fulano da Silva",
        'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'is_admin' => TRUE
    ];
}
{% endhighlight %}  

Poderíamos implementar um CRUD completo para usuários do sistema, mas já
sabemos fazer isso. Vamos apenas criar uma entrada chamada *inserir administrador*
que recebe o número USP e coloca `TRUE` na tabela `users`. Um formulário básico 
para essa operação `resources/views/users/novoadmin.blade.php`:

{% highlight html %}
{% raw %}
@extends('main')
@section('content')
<form method="POST" action="/novoadmin">
    @csrf
    <div class="form-group row">
        <label for="codpes" class="col-sm-4 col-form-label text-md-right">número usp</label>
        <div class="col-md-6">
            <input type="text" name="codpes" value="{{ old('codpes') }}" required>
        </div>
    </div>
    <div class="form-group row mb-0">
        <div class="col-md-8 offset-md-4">
            <button type="submit" class="btn btn-primary">Enviar</button>
        </div>
    </div>
</form>
@endsection
{% endraw %}
{% endhighlight %}

Um controler mínimo para nosso exemplo:
{% highlight bash %}
php artisan make:controller UserController
{% endhighlight %}

Rotas para mostrar formulário e enviar a requisição para o
controller:

{% highlight php %}
use App\Http\Controllers\UserController;
Route::get('/novoadmin', [UserController::class, 'form']);
Route::post('/novoadmin', [UserController::class, 'register']);
{% endhighlight %}

No controler criamos os métodos correspondentes:

{% highlight php %}
public function form()
{
    return view('users.novoadmin');
}

public function register(Request $request)
{   
    $user = User::where('codpes',$request->codpes)->first();
    if(!$user) $user = new User;

    $user->codpes = $request->codpes;
    $user->email  = \Uspdev\Replicado\Pessoa::email($request->codpes);
    $user->name   = \Uspdev\Replicado\Pessoa::nomeCompleto($request->codpes);
    $user->is_admin = TRUE;
    $user->save();
    return redirect("/novoadmin/");
}
{% endhighlight %}

Mas temos um problema. E se o número USP informado não existir?
Todas as chamadas subsequentes vão quebrar. Vamos validar esse número?

Com auxílio da biblioteca  
[https://github.com/uspdev/laravel-usp-validators](https://github.com/uspdev/laravel-usp-validators)
podemos fazer isso tranquilamente.

{% highlight php %}
$request->validate([
    'codpes' => 'required|integer|codpes',
]);
{% endhighlight %}

Agora que temos um campo que nos indica que o usuário é um admin
podemos criar um `Gate` que faz essa verificação, em 
`app/Providers/AuthServiceProvider.php`:

{% highlight php %}
Gate::define('admin', function ($user) {
    return $user->is_admin;
});
{% endhighlight %}

Para cada método do nosso controller podemos restringir o acesso
para o gate admin usando `$this->authorize('admin');`. Já no blade
podemos fazer `@can('admin') ... @endcan`

### 6.4 Exercício de buscas, paginação e autorização

- Criar um sistema de busca no método `index` do `LivroFulanoController`
- Implementar paginação
- Escolha alguns métodos de `LivroFulanoController` para só serem acessíveis pelos admins. 

## 7. Material Extra

### 7.1 Upload de arquivos
https://youtu.be/5Xx52e4LOG8 

Vamos criar uma opção de upload de imagens. A princípio é possível
deixar um campo de upload no mesmo formulário de cadastro/edição
do livro. Mas neste exemplo vamos guardar a relação de imagens
em um model a parte, assim teremos mais controle em termos de acesso
e permissão sobre os arquivos, pois não vamos deixar esses
arquivos em um diretório público na web.

{% highlight php %}
php artisan make:model File --all
{% endhighlight %}

{% highlight php %}
$table->string('original_name');
$table->string('path');
$table->unsignedBigInteger('livro_id')->nullable();
$table->foreign('livro_id')->references('id')->on('livros')->onDelete('set null');
{% endhighlight %}

{% highlight bash %}
php artisan migrate
{% endhighlight %}

Rotas: 
{% highlight php %}
Route::resource('files', FileController::class);
{% endhighlight %}

Em `resources/views/files/partials/form.blade.php` vamos criar um formulário
de upload de arquivos para imagens do livro e não vamos estender ninguém:

{% highlight html %}
{% raw %}
Enviar Imagens:
<form method="post" enctype="multipart/form-data" action="/files">
  @csrf
  <input type="hidden" name="livro_id" value="{{ $livro->id }}">
  <input type="file" name="file">
  <button type="submit" class="btn btn-success"> Enviar </button>
</form>
{% endraw %}
{% endhighlight %}

Em `resources/views/livros/show.blade.php` vamos incluí-lo:
{% highlight html %}
{% raw %}
@include('files.partials.form')
{% endraw %}
{% endhighlight %}

No método store implementamos:
{% highlight php %}
$request->validate([
    'file'     => 'required|file|image|mimes:jpeg,png|max:2048',
    'livro_id' => 'required|integer|exists:livros,id'
]);
$file = new File;
$file->livro_id = $request->livro_id;
$file->original_name = $request->file('file')->getClientOriginalName();
$file->path = $request->file('file')->store('.');
$file->save();
return back();
{% endhighlight %}

Método show:
{% highlight php %}
use Illuminate\Support\Facades\Storage;
public function show(File $file)
{
    return Storage::download($file->path, $file->original_name);
}
{% endhighlight %}

No model do Livro:
{% highlight php %}
public function files()
{
    return $this->hasMany('App\Models\File');
}
{% endhighlight %}

Por fim mostramos as imagens assim:
{% highlight html %}
{% raw %}
@foreach($livro->files as $file)
  <img src="/files/{{$file->id}}">
@endforeach
{% endraw %}
{% endhighlight %}

Muito útil para verificar o mimeType:
{% highlight php %}
$request->file('file')->getClientMimeType()
{% endhighlight %}

<!---

### PDF

{% highlight bash %}
composer require barryvdh/laravel-dompdf
php artisan vendor:publish --provider="Barryvdh\DomPDF\ServiceProvider"
mkdir resources/views/pdfs/
touch resources/views/pdfs/exemplo.blade.php
{% endhighlight %}

No controller:

{% highlight bash %}
use PDF;
public function convenio(Convenio $convenio){
    $exemplo = 'Um pdf banaca';
    $pdf = PDF::loadView('pdfs.exemplo', compact('exemplo'));
    return $pdf->download('exemplo.pdf');
}
{% endhighlight %}

Por fim, agora pode escrever sua estrutura do pdf, mas usando blade
exemplo.blade.php:

{% highlight php %}
{% raw %}
{{ $exemplo }}
{% endraw %}
{% endhighlight %}


Como mandar um pdf gerado por  por email?

### Excel
https://youtu.be/Ik9siHfVUkk

Instalação
{% highlight bash %}
composer require maatwebsite/excel
mkdir app/Exports
touch app/Exports/ExcelExport.php
{% endhighlight %}

Implementar uma classe que recebe um array multidimensional com os dados, linha a linha.
E outro array com os títulos;
{% highlight php %}
{% raw %}

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ExcelExport implements FromArray, WithHeadings
{
    protected $data;
    protected $headings;
    public function __construct($data, $headings){
        $this->data = $data;
        $this->headings = $headings;
    }

    public function array(): array
    {
        return $this->data;
    }

    public function headings() : array
    {
        return $this->headings;
    }
}
{% endraw %}
{% endhighlight %}

Usando no controller:
{% highlight php %}
{% raw %}
use Maatwebsite\Excel\Excel;
use App\Exports\ExcelExport;

public function exemplo(Excel $excel){
  
  $headings = ['ano','aprovados','reprovados'];
  $data = [
      [2000,12,15],
      [2001,10,11],
      [2002,11,21]
    ];
    $export = new ExcelExport($data,$headings);
    return $excel->download($export, 'exemplo.xlsx');
}

public function export($format){
}
{% endraw %}
{% endhighlight %}


## Próximo tutoriais na seção úteis

- Filas: https://laravel.com/docs/8.x/queues
- Global e Local Scopes: https://laravel.com/docs/8.x/eloquent#local-scopes
- laravel-form-builder ou LaravelCollective/html

-->

