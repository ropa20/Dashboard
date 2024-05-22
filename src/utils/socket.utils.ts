// import socketIOClient from 'socket.io-client';

const connectSocket = () => {
  // const endpoint =
  //   process.env.REACT_APP_NODE_ENV === 'development'
  //     ? 'http://localhost:8001'
  //     : process.env.REACT_APP_NODE_ENV === 'stage'
  //     ? 'https://stage.baeroad.com'
  //     : 'http://localhost:8001';
  // let token = localStorage.getItem('token');
  // const socket = socketIOClient.connect(endpoint, {
  //   query: { token },
  //   transports: ['websocket'],
  //   timeout: 2000,
  // });
  // socket.on('connected', (message: any) => {
  //   console.log(`socket connected & authenticated: ${message}`);
  // });
  // socket.on('exception', function (error) {
  //   console.log(`socket error: ${error}`);
  // });
  // socket.on('disconnect', function () {
  //   console.log('Socket disconnected');
  // });
  // return socket;
};

export default connectSocket;
