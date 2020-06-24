/* eslint-disable */
// npm i nodejs-websocket
let ws = require("nodejs-websocket")
let port = 8001
let heart_beat = 60 //每60秒内需要客户端心跳一次，否则关闭连接

let server = ws.createServer(function (conn) {
    //计算心跳时间
    conn.heart_time = 0

    let timer = setInterval(()=>{
        //检查心跳时间
        if (conn.heart_time > heart_beat) {
            clearInterval(timer);
            conn.close()
        }
        conn.heart_time++
    },1000)
    // function sendOne () {
    //     conn.sendText
    // }
    // function sendAll () {
    //     for ()
    //     conn.sendText
    // }
    //根据时间戳生成用户id uid
    let uid = String((new Date()).getTime()).slice(-6)
    conn.uid = uid
    console.log('服务器信息:用户' + uid + ' 已经连接')
    // console.log(uid+' is connected')

    conn.sendText('{"ownerCode": "E0106003","soNo": "22020061702134","businessId": "6410","businessName": "石柳","pageSize": 30,"orderBy": "1","createUserName": "大物流系统邮箱","custMaterialNo": "62711CA6883401"}')
    
    //接受到发过来的信息
    conn.on("text", function (text) {
        //重置心跳
        conn.heart_time = 0
        if (text == 'hello') {
            //设置的心跳信息，不做任何处理直接返回
            return
        }
        console.log('服务器信息: get user:' + conn.uid + ' message:' + text)

        conn.sendText('server get your send:' + text)
    })

    //断开连接的回调
    conn.on("close", function (code, reason) {
        console.log('用户' + uid + ' 已经断开连接')
    })  

    //处理错误事件信息
    conn.on('error', function (err) {
        console.log('用户' + uid + ' 已经断开连接，错误原因： ' + err)
    })
}).listen(port);//8001端口
console.log('ws://127.0.0.1:'+port+' is runing.')
