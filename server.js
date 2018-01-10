//引入http模块
const http = require('http') // 引入 http
const express = require('express') // 引入express模块
const socket = require('socket.io') // 引入 socket.io

//服务器及页面响应部分
let app = express(),
server = http.createServer(app),
	io = socket.listen(server); //引入socket.io模块并绑定到服务器
	app.use('/', express.static(__dirname + '/www'));
	server.listen(8080);

//用户输入昵称

let users=[];//保存所有在线用户的昵称
//socket部分
io.on('connection', function(socket) {
    // 用户引入聊天室昵称设置
    socket.on('login', function(nickname) {
    	// 判断用户昵称是否在数组中
    	if (users.indexOf(nickname) > -1) {
    		// 用户昵称在数组中触发 nickExisted 事件 , 提示用户重新输入用户名
    		socket.emit('nickExisted');
    	} else {
    		// 设置用户 index
    		socket.userIndex = users.length;
    		// 接受 nickname
    		socket.nickname = nickname;
    		// nickname 放入数组中
    		users.push(nickname);
    		console.log(users);
    		socket.emit('loginSuccess');
    		io.sockets.emit('system', nickname, users.length, 'login'); //向所有连接到服务器的客户端发送当前登陆用户的昵称 
    	};

        // 断开连接的事件
        socket.on('disconnect', function() {
    	//将断开连接的用户从users中删除
    	users.splice(socket.userIndex, 1);
    	//通知除自己以外的所有人
    	socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
		});
    });

    //接收新消息
    socket.on('postMsg', function(msg) {
        //将消息发送到除自己外的所有用户
        socket.broadcast.emit('newMsg', socket.nickname, msg);
    });



    
});











