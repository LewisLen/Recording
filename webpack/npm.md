# npm相关知识

一名前端开发者对于npm自然是不陌生的，这个node自带的包管理工具已经成了一个必备的开发工具，但是大多数开发只会一言不合npm install，本文记录开发者可能不了解的npm相关知识。

## npm init

npm init 会生成一个package.json描述文件，记录包的信息。如果想直接一次性生成一个json文件，可以直接`npm init --yes`或者`npm init -y`

## npm install

`npm install`命令(缩写：`npm i`)是将package.json中的dependencies和devDependencies中的依赖包安装到当前目录的`./node_modules`文件夹中