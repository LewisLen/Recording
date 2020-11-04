# nginx

## 安装Homebrew（mac）

Homebrew是macox（Linux系统）的包管理工具，可以使用它安装一些系统上没有的东西，并且可以安装到独立目录（/usr/local)，完全基于git和ruby，可以自由修改的同时也可以轻松撤销变更或与上游更新合并。目前没法直接安装，具体安装教程可以参考[brew安装方法](https://zhuanlan.zhihu.com/p/111014448)

在访达中输入快捷键`command+shift+G`则可以快速打开`usr/local`文件夹，可以看到Homebrew和bin文件夹	

- /usr/local/Cellar/nginx nginx安装文件目录
- /usr/local/etc/nginx 配置文件目录，如nginx.conf
- /private/etc/hosts host文件

## 安装nginx

```cmd
brew install nginx # 安装nginx
brew services start nginx # 开启服务
brew uninstall nginx # 卸载nginx
```
开启服务则可以直接在浏览器上输入localhost访问了

## 常用命令

```cmd
nginx # 启动nginx
nginx -s stop # 快速停止nginx
nginx -s quit # 优雅停止nginx
nginx -s reload # 热装载配置文件
nginx -s reopen # 重新打开配置文件
```

## 代理

### 正向代理

比如浏览器（客户端）想访问google，在国内正常情况下是不能访问的，那怎么办？只能通过在国外建服务器，我访问国外的服务器（代理服务器），国外的服务器访问google（服务器），从google返回信息到国外的服务器代理服务器，再返回给浏览器（客户端）。

- 客户端需要知道代理服务器的ip地址和端口，清楚服务器的地址
- 服务器不清楚请求具体来自于哪个用户，但是知道请求来自哪个代理服务器
- 可以将客户端和代理服务器看成一个整体，客户端需要配置代理服务器

### 反向代理

栗子1: 客户向项目经理提出需要完成一个APP，项目经理将工作安排给多个程序员去完成，如期交付给客户。这就可以理解成是反向代理，客户并不清楚哪些模块是哪个程序员完成的，只知道得到一个预期之内的APP。客户直接对接的是项目经理，但是项目经理不可能一个人去完成，于是按照工作能力给各个程序去完成各个模块。

栗子2: 客户端（浏览器）去网上购物，因为浏览量过于巨大，不可能是一台服务器承载，所以通过代理服务器，多个客户端访问代理服务器，代理服务器按照一定的规则将请求分发给各个服务器去处理，处理完了反馈回代理服务器，再返回到客户端。

- 客户端是无感的，不需要做什么设置，也不知道具体是哪一台服务器处理的请求
- 需要服务器做配置，代理服务器和服务器可以看成是一个整体
- 客户并不需要知道服务器的地址，只需要知道代理服务器的地址


## nginx配置反向代理

通过访问**www.lewislen.com** 来访问指定ip地址**192.168.172.129:3002**代理服务器，进而访问127.0.0.1:3000服务器的内容

1. 创建一个3000端口的本地服务
2. 配置host用户故事，做一个映射
3. 在nginx中进行请求转发的配置

### nodejs创建一个简单的服务

```javascript
const http = require("http");

const httpServer = http.createServer((req,res) => {
    if(req.url === '/'){
        console.log('被访问了...')
    	res.writeHead(200,{"Content-type":"text/html;charset=UTF-8"});
        res.end("端口号为3000的node服务");
    }
})

httpServer.listen(3000,'127.0.0.1');
```

### host文件

- win7: windows/system32/dirvers/HOSTS
- macOs: /private/etc/hosts


```cmd
# 这里可以看成是做了一个简单的映射
192.168.172.129 www.lewislen.com
```

### nginx.conf配置文件

通过

```cmd
server{
	listen       3002;
    server_name  192.168.172.129; # ip地址
	location / { # 正则表达式
		root html;
		proxy_pass http://127.0.0.1:3000; # 被反向代理的源地址
		index index.html index.htm
	}
}
```


- listen监听代理服务器的端口
- server_name代理服务器ip地址
- proxy_pass服务器ip地址和端口

> 这里需要注意的是，因为是在本地起的服务，mac中会自带一个服务器，默认端口是80，所以在配置完之后，如果是在浏览器直接输入www.lewislen.com 是走不到nginx服务器的，需要加上端口号即www.lewislen.com:3002 ，这里配置的是3002

## 负载均衡

简单的理解就是，将请求按照一定的规则分给各个服务器处理的过程，就叫负载均衡。

```cmd
# 负载均衡列表
upstream testServer{ # testServer为服务器名称 
	# 负载均衡服务器列表
	server 192.168.172.129:8081;
	server 192.168.172.129:8082;
	fair # 根据响应时间来分配
}
server {
	listen: 3002; # 端口号
	server_name 192.168.172.129; # 服务器地址
	location / {
		proxy_pass http://testServer; # 被代理的服务器地址
		root html;
		index index.html index.htm
	}
}
```

这样就可以通过 192.168.172.129:3002 发送请求，能平均分担到两个服务器当中

## 参考内容

- 官网[brew](http://brew.sh)
- 安装方法参考[brew安装方法](https://zhuanlan.zhihu.com/p/111014448)

