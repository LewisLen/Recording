# 如何kx上网

准备工作：

- vps
- v2rayU(mac)
- v2RayN(Windows)
- SSH工具（Windows推荐[PUTTY](https://putty.en.softonic.com/windows)、[mobaxterm免费版](https://mobaxterm.mobatek.net/download.html)、MacOs用自带的终端即可
- v2ray一键安装[脚本](https://github.com/pitech007/v2ray/wiki/V2Ray一键安装脚本)
- [检测ip是否被墙](https://kiwivm.64clouds.com/main-exec.php?mode=blacklistcheck)

## 购买vps

vps推荐[搬瓦工](https://bandwagonhost.com/clientarea.php)，我选择的是$49.9/年的套餐（20G KVM VPS），可以去搜索搬瓦工的优惠码，继续下单就好了，买的是洛杉矶的服务，在下单的时候需要选择地址，填国内的地址即可。然后就是支付宝付款下单，回到首页，进入my Server就可以看到已经下单的vps了。进入控制面板（KiwiVM Control Panel），可以看到vps的一些主要信息。
 
购买vps之后，进入控制面板，先暂停（stop）服务，然后安装（Insall new Os）其它系统，推荐`debian-9-x86-64`，等几分钟之后就安装成功了，安装成功之后会发一份邮件到注册的邮件上，或者到控制面板中看vps的运行状态
 
## 安装v2ray

这里必须通过SSH工具链接到vps上，安装好PUTTY之后，填好IP和端口号打开终端后，默认的用户名是root，输入密码即可连接成功。

```shell
# 安装和卸载都是这条命令
bash <(curl -s -L https://git.io/v2ray.sh)
```
![安装v2ray](https://camo.githubusercontent.com/db094f4fd3f49c9e690075abbfd697784e8741a7f22cfaff8e078c39533443a5/68747470733a2f2f692e6c6f6c692e6e65742f323031392f30312f30352f356333303532323463666530352e6a7067)

> 如果提示 curl: command not found ，那是因为你的 VPS 没装 Curl
> ubuntu/debian 系统安装 Curl 方法: apt-get update -y && apt-get install curl -y
> centos 系统安装 Curl 方法: yum update -y && yum install curl -y
> 安装好 curl 之后就能安装脚本了

安装v2ray：可以直接回车，全都默认

- TCP协议
- 默认端口
- 广告拦截：关闭
- Shadowsocks可选可不选
- 根据命令`v2ray url`生成url

安装完之后需要将v2ray信息记下，如果不记得，可以直接输入`v2ray`命令查看相关信息或者重装。

## 配置v2rayN（windows）

下载windows客户端，这里需要清楚的是，每个v2rayN版本的配置可以会不同，但是也大同小异。这里用的是[v2rayN-Core.4.16版本](https://github.com/2dust/v2rayN/releases)，解压打开之后。

订阅 -> 订阅设置设置备注（随便填）和v2ray配置得到的url，勾选启用，更新订阅。查看服务器列表，勾选一个节点右键设置为活动服务器。如果没有服务器节点，则手动添加VMess服务器，填上ip、port即可。

右下角选择v2rayN右键系统设置 -> 自动配置系统代理，会变成红色。

首页-设置-路由设置，勾选启用路由高级功能，然后规则中选择“绕过大陆”，确定即可。

到这里就配置完了，可以看下能否上google

> 如果提示v2rayN已停止工作，是因为v2rayN依赖于[NET Framework4.5.2](https://dotnet.microsoft.com/download/thank-you/net472)，安装即可。

## macos链接SSH

macos系统不用安装额外的ssh工具，直接用自带的终端即可连接ssh。

- 打开终端，`sudo su -` 回车进入根目录
- `ssh -p 端口号 root@ip`，搬瓦工的用户名一般是root，回车即可连接
- 然后就是和安装v2ray一样的操作了

安装v2rayU，订阅设置，将v2ray生成的地址填入其中，选择Pac模式。