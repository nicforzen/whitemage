
export function NetworkConnection(hostname, port){
    this.instance = null;
    this.p_socket = io.connect('http://' + hostname + ":" + port);
}

NetworkConnection.prototype.setInstance = function(instance){
    this.instance = instance;
};
NetworkConnection.prototype.sendMessage = function(tag, message){
    this.p_socket.emit(tag, message);
};
NetworkConnection.prototype.addEventListener = function(tag, event){
    this.p_socket.on(tag, event.bind(this.instance));
};
NetworkConnection.prototype.disconnect = function(){
    this.p_socket.disconnect();
};

export function ServerConnection(io){
    this.io = io;
    this.instance = null;
}

ServerConnection.prototype.setInstance = function(instance){
    this.instance = instance;
};
ServerConnection.prototype.sendMessage = function(tag, message){
    if(this.instance.isServer){
        this.io.emit(tag, message);
    }
};
ServerConnection.prototype.addEventListener = function(tag, event){};
ServerConnection.prototype.setEventListeners = function(events){
    this.io.sockets.on('connection', function(socket) {
        events(socket);
    });
};
ServerConnection.prototype.disconnect = function(){};