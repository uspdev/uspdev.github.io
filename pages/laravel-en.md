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



