---
layout: default-en
title: Crash Course
permalink: /laravel-en
---

# Laravel at USP: A Crash Course

Disclaimer: this material was developed within the context of Laravel workshops for web development at USP. Therefore, Laravel commonly accepted or normalized good practices may be intentionally ommited, as well as you may encounter adaptations of these.


<ul id="toc"></ul>

## 0. Development environment preparation

Installation of basic components for web development with Laravel on Debian or other Debian-derived operational systems (like Ubuntu, Linux Mint...). In this tutorial we will also cover how to set a virtual machine with Debian, but if you choose to use your current OS, please adapt the procedures accordingly.

### 0.1 Enable virtualization on your BIOS

In order to run a virtual machine on your computer, verify how to enable virtualization on your BIOS. In newer computer models, this module is likely to be already enabled.

### 0.2 Install VirtualBox

To create and manage virtual machines, we will use the software VirtualBox. Download it and proceed the installation according to your operational system.

- [https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads)

### 0.3 Download Debian image 

Debian is a [GNU/Linux](https://www.gnu.org/gnu/linux-and-gnu.en.html) distribution that we use as our main development environment. In this tutorial, we will use Debian image to install on our virtual machine, but you can choose any other OS that you like.

- [https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-10.9.0-amd64-netinst.iso](https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-10.9.0-amd64-netinst.iso)

### 0.4 Create virtual machine and install Debian

In this stage we will create a virtual machine on VirtualBox, as well as attach and install our Debian OS. Please watch the procedures in the [video tutorial](#final-obs).

### 0.5 Basic terminal commands

    pwd, cd .. , ls, mv, cp, mkdir, rm 

### 0.6 Give superuser privileges to your user

On GNU/Linux systems, there are at least two different users: the general user and the root user. The root user is a superuser, or a 

> special user account used for system administration. [(Wikipedia)](https://en.wikipedia.org/wiki/Superuser)
 
When we install the OS, commonly your will be guided to create a general user, as the root user is automatically created. This is for security purposes, and a useful feature if your share your computer. But, to install and manage directories and packages, it is more convenient to give superuser privileges to your user:

    su -
    /sbin/addgroup USER sudo

### 0.7 Install and configure git

According to [Wikipedia](https://en.wikipedia.org/wiki/Git), Git is

>  a software for tracking changes in any set of files, usually used for coordinating work among programmers collaboratively developing source code during software development.

This is the main tool that we use for web development, as it offers an efficient workflow for a collaborative project. Hence, it is recommended to learn the basic commands and the workflow. To install, run:

    sudo apt install git
    git config --global user.name "Fulano da Silva"
    git config --global user.email "fulano@usp.br"

Next, you should create a [GitHub](github.com/) account and add a public key to your profile. A public key is necessary to your local machine communicate with GitHub servers via [ssh](https://en.wikipedia.org/wiki/Secure_Shell_Protocol). To generate a public key, run and copy the output of the following:

    ssh-keygen
    cat ~/.ssh/id_rsa.pub

Paste the public key at Settings > SSH and GPG keys > New SSH key.

### 0.8 Creating an admin user for general use on MariaDB

[MariaDB](https://mariadb.org/) is our database of choice. To install and create the general admin user, run: 

    sudo apt install mariadb-server
    sudo mariadb
    GRANT ALL PRIVILEGES ON *.* TO 'admin'@'%'  IDENTIFIED BY 'admin' WITH GRANT OPTION;
    quit
    exit

### 0.9 Install minimal dependencies of Laravel framework

[Laravel](https://laravel.com/) is our framework of choice, a library for PHP that follows the [model-view-controller](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller) (MVC) architecture.

     sudo apt install php curl php-xml php-intl php-mbstring php-mysql php-curl php-sybase

### 0.10 Install Composer

[Composer](https://getcomposer.org/) is the dependency manager for PHP. It is responsible to install and update the dependencies of the project.

    curl -s https://getcomposer.org/installer | php
    sudo mv composer.phar /usr/local/bin/composer

<h3 id="final-obs">0.11 Final observations</h3>

It is also recommended to install a code editor like VSCode, VSCodium, Atom... There are a lot of options, and you can choose the one that you like.

Finally, to guide you through the entire process of preparing your development environment, you can watch the video tutorial that we prepared:

- Sorry, still WIP!

## 1. MVC - Model View Controller

The MVC architecture is a way where we can organize different intertwined functions of web systems.
As Laravel works with the MVC architecture, we need to create the three main components of it: the Model, View and Controller. 

### 1.1 Request and Response

In order to communicate with other servers on Internet, we send requests and receive responses. This is the most basic abstraction of how Internet works. Hence, we need to set routes, which are where we receive requests. 
Here it is an example of a route, at `/routes/web.app`:

{% highlight php %}
Route::get('/books', function () {
    echo "There isn't any record of books in this system.";
});
{% endhighlight %}

### 1.2 Controller

We can manage our routes on Controller, our component that
> Accepts input and converts it to commands for the model or view. [(Wikipedia)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)

To create a Controller, run:
{% highlight bash %}
php artisan make:controller BookController
{% endhighlight %}
The created file is at `app/Http/Controllers/BookController.php`.

Now, let's create an `index()` method in our new controller:
{% highlight php %}
public function index(){
    return "There isn't any record of books in this system.";
}
{% endhighlight %}

The next step is to point the new `index()` method of `BookController` on our route.

{% highlight php %}
use App\Http\Controllers\BookController;
Route::get('/books', [BookController::class,'index']);
{% endhighlight %}

Another situation is when we want to view the information of one object. To view one instance, we can pass parameters to the request address. For example, we have a book recorded as "Quincas Borba", that has an ISBN of "9780195106817". Therefore, we want to set a route that passes the ISBN as a parameter and shows a page with the requested object. For instance: `/books/9780195106817`.

To set this route, we will create a new method called `show($isbn)`, that receives the ISBN of a Book instance. It is on Controller that we can elaborate the identification logic for each instance:

{% highlight php %}
public function show($isbn){
    if($isbn == '9780195106817') {
        return "Quincas Borba";
    } else {
        return "I couldn't identify this book!";
    }
}
{% endhighlight %}

Finally, we have to add the route at `/routes/web.app` that receives the ISBN as a parameter:
{% highlight php %}

# set the address and specifies the Controller method
Route::get('/books/{isbn}', [BookController::class, 'show']);
{% endhighlight %}

### 1.3 View: Blade

You can see that routes return pages with a minimalistic (almost blank) template. We can improve this templates on the View layer. Templates are created and set on files with `.blade.php` extension. Among its caracteristics, the most relevant is inheritance. This means that one template can be extended in another, hence the latter will have the same proprieties of the first - somehow similar to CSS.

Let's start by creating a main template on `resources/view/main.blade.php`.

{% highlight html %}
{% raw %}
<!DOCTYPE html>
<html>
    <head>
        <title>@section('title') Example @show</title>
    </head>
    <body>
        @yield('content')
    </body>
</html>
{% endraw %}
{% endhighlight %}

Secondly, we will create a template for index route at `resources/views/books/index.blade.php`:

{% highlight html %}
{% raw %}
# inheritance
@extends('main')
@section('content')
  There isn't any record of books in this system.
@endsection
{% endraw %}
{% endhighlight %}

Then, we need to return this template when we access the index route:
{% highlight php %}
public function index(){
    return view(books.index);
}
{% endhighlight %}

Another relevant feature of Laravel template is that `blade` is a programming language. Thus, it is possible to develop the logical aspects of our system directly on the template. For example, we can pass the object as a `$book` variable to the template on Controller:

{% highlight php %}
public function show($isbn){
    if($isbn == '9780195106817') {
        $book = "Quincas Borba";
    } else {
        $book = "I couldn't identify this book!";
    }
    return view('books.show', [
        # pass Book object as $book to template
        'book' => $book
    ]);
}
{% endhighlight %}

The final code of `resources/views/Books/show.blade.php` will be:

{% highlight html %}
{% raw %}
@extends('main')
@section('content')
  {{ $book }}
@endsection
{% endraw %}
{% endhighlight %}

### 1.4 Model

The following step is to manage Book objects on the database.
First, we will create a `Books` table on the database. But, we won't access the database via command-line. The creation and management of a database will be done directly on Laravel, with the features Migration and Model.

{% highlight bash %}
# create a migration
php artisan make:migration create_books_table --create='books'
# create a Model "Book"
php artisan make:model Book
{% endhighlight %}

Once we have created the migration and Model files, we will define the table fields on the migration. Let's insert these following fields: title, author and ISBN.

{% highlight php %}
$table->string('title');
$table->string('author')->nullable(); # this field is optional
$table->string('isbn');
{% endhighlight %}

Then, with the table created, we can insert a book instance to the database. As this is the first time, let's insert an instance manually through the Laravel "shell", called Tinker.

{% highlight bash %}
php artisan tinker

# manually filling the fields
$book = new App\Models\Book;
$book->title = "Quincas Borba";
$book->author = "Machado de Assis";
$book->isbn = "9780195106817";
$book->save();
quit
{% endhighlight %}

Now take a look at the database. Through Laravel, we created a table, defined its fields and created an object of the table. By the MVC architecture, we are operating at the Model layer. 

Once we have done that, we can access the data on the database and manipulate it with Controller. For instance, let's create an `index()` function that looks into the table and return all its instances:

{% highlight php %}
public function index(){
    $books = App\Models\Book:all();
    return view('books.index',[
        'books' => $books
    ]);
}
{% endhighlight %}

On the template we can iterate through all the Books and show the fields of each one:

{% highlight php %}
{% raw %}
@forelse ($books as $book)
    <li>{{ $book->title }}</li>
    <li>{{ $book->author }}</li>
    <li>{{ $book->isbn }}</li>
@empty
    There is no record of books.
@endforelse
{% endraw %}
{% endhighlight %}

At `show` method, we will receive the ISBN of a Book and show just this instance.

{% highlight php %}
public function show($isbn){
    $book = App\Models\Book::where('isbn',$isbn)->first();
        return view('books.show',[
            'book' => $book
        ]);
}
{% endhighlight %}

On the template, we need to show the instance's fields:
{% highlight php %}
{% raw %}
<li>{{ $book->title }}</li>
<li>{{ $book->author }}</li>
<li>{{ $book->isbn }}</li>
{% endraw %}
{% endhighlight %}

Have you noticed that the same code is repeated on `index` and `show` blades? We can better organize our code by creating a directory `resources/views/books/partials`, which will store template parts that can be reutilized.

In this case, let's create a `resources/views/books/partials/fields.blade.php`:

{% highlight php %}
{% raw %}
<li>{{ $book->title }}</li>
<li>{{ $book->author }}</li>
<li>{{ $book->isbn }}</li>
{% endraw %}
{% endhighlight %}

On `index` and `show`, we can simply call `partials/fields.blade.php` by replacing the same code to:

{% highlight php %}
{% raw %}
@include('books.partials.fields')
{% endraw %}
{% endhighlight %}

### 1.5 Fakers and Seeders

When we develop a system, we need to run tests, hence, simulate a real environment. In order to do this, it's a good ideia to populate the database with random data (fakes) along with controlled data (seed). We can automate this process by configuring Faker and Seeders.

{% highlight bash %}
php artisan make:factory BookFactory --model='Book'
php artisan make:seed BookSeeder
{% endhighlight %}

At `database/factories/BookFactory.php`, we will set a random data generator pattern:

{% highlight php %}
return [
    'title' => $this->faker->sentence(3),
    'isbn'   => $this->faker->ean13(),
    'author'  => $this->faker->name
];
{% endhighlight %}

At `database/seeders/BookSeeder.php` we will create one controlled instance and call Factory to create 15 random instances:

{% highlight php %}
$book = [
    'title' => "Quincas Borba",
    'author'  => "Machado de Assis",
    'isbn'       => "9780195106817"
];
\App\Models\Book::create($book);
\App\Models\Book::factory(15)->create();
{% endhighlight %}

Run the seeder and then check the database:
{% highlight bash %}
php artisan db:seed --class=BookSeeder
{% endhighlight %}

If the seeder is working we can declare it on `database/seeders/DatabaseSeeder`, so that it can be called globally.

{% highlight php %}
public function run()
{
    $this->call([
        UserSeeder::class,
        BookSeeder::class
    ]);
}
{% endhighlight %}

For testing purposes, you can reset and reseed the table by running: 

{% highlight bash %}
php artisan migrate:fresh --seed
{% endhighlight %}

### 1.6 MVC exercise

Create: 
- `Book` Model;
- Migration with the respective fields: title, author and isbn;
- Seeder and set at least one control record;
- Factory with random data generation that creates at least 10 instances;
- Controller with `index` and `show` methods with its respectives routes and templates;

In this exercise you will create or edit the files:

    routes/web.php
    database/seeders/DatabaseSeeder.php
    app/Models/Book.php
    app/Http/Controllers/BookController.php
    database/seeders/BookSeeder.php
    database/factories/BookFactory.php
    database/migrations/202000000000_create_books_table.php
    resources/views/book/index.blade.php
    resources/views/book/show.blade.php
    resources/views/book/partials/fields.blade.php

## 2. CRUD: Create, Read, Update and Delete 

### 2.1 Cleaning the environment

There are at least four actions that we can take towards the data in a database: create an instance, read, update and delete. Therefore, now we will implement a basic CRUD structure in our system.

First, backup and delete the Model, Controller, Seed, Factory and Migration that we created in the last exercise. However, do NOT DELETE the blades, because we will use it later.

{% highlight bash %}
rm app/Models/Book.php
rm app/Http/Controllers/BookController.php
rm database/seeders/BookSeeder.php
rm database/factories/BookFactory.php
rm database/migrations/202000000000_create_Books_table.php
{% endhighlight %}

### 2.1 Creating a Model, Controller, Seed and Factory for CRUD

We will recreate the files by running:
{% highlight bash %}
php artisan make:model Book --all
{% endhighlight %}

Note that the migration, faker, seed and controller will be automatically related to Book Model. Furthermore, the controller now has all the necessary methods for CRUD operations. We also don't need to declare a route for each method. It can be done by simply replacing all the routes from before to:

{% highlight php %}
Route::resource('Books', BookController::class);
{% endhighlight %}

The following code is an example of a basic implementation of the aforementioned methods:
{% highlight php %}
public function index()
{
    $books =  Book::all();
    return view('books.index',[
        'books' => $books
    ]);
}

public function create()
{
    return view('books.create',[
        'book' => new book,
    ]);
}

public function store(Request $request)
{
    $book = new Book;
    $book->title = $request->title;
    $book->author = $request->author;
    $book->isbn = $request->isbn;
    $book->save();
    return redirect("/books/{$book->id}");
}

public function show(Book $book)
{
    return view('books.show',[
        'book' => $book
    ]);
}

public function edit(Book $book)
{
    return view('books.edit',[
        'book' => $book
    ]);
}

public function update(Request $request, Book $book)
{
    $book->title = $request->title;
    $book->author = $request->author;
    $book->isbn = $request->isbn;
    $book->save();
    return redirect("/books/{$book->id}");
}

public function destroy(Book $book)
{
    $book->delete();
    return redirect('/books');
}
{% endhighlight %}

To create the blade files, run:

{% highlight bash %}
mkdir -p resources/views/books/partials
cd resources/views/books
touch index.blade.php create.blade.php edit.blade.php show.blade.php 
touch partials/form.blade.php partials/fields.blade.php
{% endhighlight %}

A basic implementation of the templates:
{% highlight html %}
{% raw %}

<!-- ###### partials/fields.blade.php ###### -->
<ul>
  <li><a href="/books/{{$book->id}}">{{ $book->title }}</a></li>
  <li>{{ $book->author }}</li>
  <li>{{ $book->isbn }}</li>
  <li>
    <form action="/books/{{ $book->id }} " method="post">
      @csrf
      @method('delete')
      <button type="submit" onclick="return confirm('Are you sure?');">Delete</button> 
    </form>
  </li> 
</ul>

<!-- ###### index.blade.php ###### -->
@extends('main')
@section('content')
  @forelse ($books as $book)
    @include('books.partials.fields')
  @empty
    There isn't any record of books.
  @endforelse
@endsection

<!-- ###### show.blade.php ###### -->
@extends('main')
@section('content')
  @include('books.partials.fields')
@endsection  

<!-- ###### partials/form.blade.php ###### -->
Title: <input type="text" name="title" value="{{ $book->title }}">
Author: <input type="text" name="author" value="{{ $book->author }}">
ISBN: <input type="text" name="isbn" value="{{ $book->isbn }}">
<button type="submit">Submit</button>

<!-- ###### create.blade.php ###### -->
@extends('main')
@section('content')
  <form method="POST" action="/books">
    @csrf
    @include('books.partials.form')
  </form>
@endsection

<!-- ###### edit.blade.php ###### -->
@extends('main')
@section('content')
  <form method="POST" action="/books/{{ $book->id }}">
    @csrf
    @method('patch')
    @include('books.partials.form')
  </form>
@endsection

{% endraw %}
{% endhighlight %}

As we now understand that blade templates work with inheritance, we can extend third-party blades in our system. For instance, at USP we have [Laravel USP Theme](https://github.com/uspdev/laravel-usp-theme). Verify installation instructions in the documentation. In our exercise, let's extend Laravel USP Theme at `main.blade.php`:

{% highlight html %}
{% raw %}
@extends('laravel-usp-theme::master')
{% endraw %}
{% endhighlight %}

With the extension of Laravel USP Theme we are also loading useful frameworks like [Boostrap](https://getbootstrap.com/), [FontAwesome](https://fontawesome.com/) and [jQuery.Mask](https://igorescobar.github.io/jQuery-Mask-Plugin/).

If you would like to load a custom JS or CSS, add the file in `public` directory.

For example, at `public/js/book.js`:

{% highlight javascript %}
jQuery(function ($) {
    //978-85-333-0398-0
    $(".isbn").mask('000-00-000-0000-0');
});
{% endhighlight %}

Also, in Laravel USP Theme blade there is a `javascripts_head` section where we can load our JS.

For example, at `form.blade.php`:
{% highlight html %}
{% raw %}
@section('javascripts_head')
    <script type="text/javascript" src="{ { asset('js/book.js') } }"></script>
@endsection
{% endraw %}
{% endhighlight %}

### 2.3 CRUD exercise

- Implement a full CRUD for `Book` model.
- Make sure your system supports all the four CRUD actions.

In this exercise you will create or edit the files:

    routes/web.php
    database/seeders/DatabaseSeeder.php
    app/Models/Book.php
    app/Http/Controllers/BookController.php
    database/seeders/BookSeeder.php
    database/factories/BookFactory.php
    database/migrations/202000000000_create_book__table.php
    resources/views/book/index.blade.php
    resources/views/book/show.blade.php
    resources/views/book/create.blade.php
    resources/views/book/edit.blade.php
    resources/views/book/partials/fields.blade.php
    resources/views/book/partials/form.blade.php