let ws = require('nodejs-websocket')
var moment = require('moment')
console.log('开始建立链接');

function getDate() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

// 1进入  2发言   0退出

//存放所有用户
var users = []
const in_type = [
    '我的帅气你无法抵御',
    '我的貂蝉在哪里',
    '有朋友自远方来，不亦乐乎',
    '贫僧自东土大唐而来，要去往西方取经之地',
    '朕会用宽广的心胸包容美女们的大不敬',
    '大小姐驾到，通通闪开',
    '来一发吗，满足你',
    '哈煞给'
]
const out_type = [
    '哎，闪到腰了，先撤了',
    '有点急事先离开了'
]
const getIntype = () => in_type[Math.floor(Math.random() * in_type.length)]
const getOuttype = () => out_type[Math.floor(Math.random() * out_type.length)]

var server = ws.createServer((coon) => {
    coon.on('text', (str) => {
        let obj = JSON.parse(str)
        //刚进入
        if (obj.type == 1) {
            users.push({
                nickname: obj.nickname,
            })
            sendAll({
                type: 1,
                date: getDate(),
                msg: obj.nickname + ':' + getIntype(),//脚踏祥云
                users: users,
                nickname: obj.nickname
            })
        } else if (obj.type == 2) {
            sendAll({
                type: 2,
                date: getDate(),
                msg: obj.msg,
                nickname: obj.nickname
            })
        } else if (obj.type == 0) {
            sendAll({
                type: 0,
                date: getDate(),
                msg: obj.nickname + ':' + getOuttype(),//脚踏祥云
                nickname: obj.nickname
            })
        }
        clearUsers()
    })
    coon.on('close', (code, reason) => {
        clearUsers()
        console.log('关闭链接');
    })
    coon.on('error', (code, reason) => {
        clearUsers()
        console.log('异常关闭');
    })
}).listen(8001)

//向所有客户端发送
function sendAll(msg) {
    server.connections.forEach(coon => {
        coon.sendText(JSON.stringify(msg))
    })
}

//当没有用户连接时  清除数据
function clearUsers() {
    console.log('在线人数', server.connections.length);
    if (server.connections.length == 0) {
        users = []
    }
}