import io from 'socket.io-client';
var url = 'http://192.168.1.180:4000'
var server = io(url)

export default server