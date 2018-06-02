import io from 'socket.io-client';
var url = 'https://mighty-castle-27764.herokuapp.com'
var server = io(url)

export default server