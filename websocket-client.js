const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:3001');

socket.on('open', () => {
  console.log('WebSocket connection established');
});

socket.on('message', (data) => {
  console.log('Message from server:', data.toString());
});

socket.on('error', (error) => {
  console.error('WebSocket error:', error);
});

socket.on('close', () => {
  console.log('WebSocket connection closed');
});