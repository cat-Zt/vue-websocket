<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <div>{{datajson}}</div>
  </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import ws from "@/unit/socket.js";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  data() {
    return {
      datajson: {}
    };
  },
  mounted() {
    this.getSocket();
  },
  methods: {
    getSocket() {
      const that = this;
      var lockReconnect = false; //避免重复连接
      var wsUrl = "ws://127.0.0.1:8001";
      var ws;
      var tt;
      function createWebSocket() {
        try {
          ws = new WebSocket(wsUrl);
          init();
        } catch (e) {
          reconnect(wsUrl);
        }
      }
      function init() {
        ws.onclose = function() {
          console.log("链接关闭");
          reconnect(wsUrl);
        };
        ws.onerror = function() {
          console.log("发生异常了");
          reconnect(wsUrl);
        };
        ws.onopen = function() {
          //心跳检测重置
          heartCheck.start();
        };
        ws.onmessage = function(evet) {
          //拿到任何消息都说明当前连接是正常的
          console.log("接收到消息");
          that.datajson = JSON.parse(evet.data)
          heartCheck.start();
        };
      }
      function reconnect(url) {
        if (lockReconnect) {
          return;
        }
        lockReconnect = true;
        //没连接上会一直重连，设置延迟避免请求过多
        tt && clearTimeout(tt);
        tt = setTimeout(function() {
          createWebSocket(url);
          lockReconnect = false;
        }, 4000);
      }
      //心跳检测
      var heartCheck = {
        timeout: 60000,
        timeoutObj: null,
        serverTimeoutObj: null,
        start: function() {
          console.log("start");
          var self = this;
          this.timeoutObj && clearTimeout(this.timeoutObj);
          this.serverTimeoutObj && clearTimeout(this.serverTimeoutObj);
          this.timeoutObj = setTimeout(function() {
            //这里发送一个心跳，后端收到后，返回一个心跳消息
            ws.send("hello");
            self.serverTimeoutObj = setTimeout(function() {
              console.log(ws);
              ws.close();
            }, self.timeout);
          }, this.timeout);
        }
      };
      createWebSocket(wsUrl);
    }
  }
};
</script>
