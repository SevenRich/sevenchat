/*
    目标： 简易即时聊天室 SevenChat

    需求：
        1 在一个窗口内实现聊天
        2 能自定义自己的聊天昵称
        3 自己提交的聊天信息其它人能立即看到

    思路：
        服务端     多人聊天，信息交互
            发送信息给客户端
            接收客户端的信息
        客户端     聊天室
            接收服务端信息
            发送信息到服务端

        http 创建服务
        socket.io 长链接，轮询等操作
*/

// 引入文件系统fs
var fs = require('fs');
// 创建服务器
// 第一步 引入http
var http = require('http');
// 第二步 创建服务器
var app = http.createServer(handler);

// 引入socket.io 并创建实例io对象
var io = require('socket.io')(app);

function handler (request, response) {
    // 返回聊天室 html文件  ==>  fs 文件系统
    fs.readFile(
        './html/chat.html',
        (err, data) => {
            // 读取失败
            if (err) {
                // 返回状态码
                response.writeHead(500);

                // 返回结果
                response.end('Error Loading ./html/chat.html');
            }

            // 读取成功
            // 返回状态码
            response.writeHead(200);

            // 返回结果
            response.end(data);
        }
    );
}

// 第三步 监听端口
app.listen(8080);

// 当客户端链接服务端时触发
io.on('connection', (socket) => {
    // socket对象
    // emit('事件名称', 对象) 用来发送一个信息到客户端 事件名称完全自定义
    socket.emit('message', {username: 'Seven', message: 'Welcome SevenChat!', type: 'log'});

    // 服务端接收聊天信息事件
    socket.on('submitMessage', (data) => {
        console.log(data);
        // 处理接收到的信息
        // 发送接收到的信息到客户端
        socket.emit('message', data);

        // broadcast 广播
        // 把消息发送到除自己之外的客户端
        socket.broadcast.emit('message', data);
    });

});
