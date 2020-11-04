# 利用github同步vscode设置

## 准备

- github账号
- vscode软件
- vscode——settings sync插件

## 新增gist

右上角`+`新增 new gist，写名称，创建一个私密 gist 即可，查看 gist ID，可以右键获取链接，链接后半段就是 gist ID，如https://github.com/lewisLen/gistid

## 新增 token

setting - Developer settings - personal access tokens - Generate new token

勾选 gist ，点击 Generate token 生成令牌

## vscode中settings sync插件设置

左下角设置 - 打开命令行（shift+command+p) - sync - Advanced Options — 打开设置

分别填入 gist id 和 token 令牌

## 上传和下载 vscode 设置

重新打开命令调用 sync ，根据需求选择上传和下载