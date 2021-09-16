
export function NetworkConnection(hostname, port){
    this.instance = null;
    this.p_socket = io.connect('http://' + hostname + ":" + port);
}

NetworkConnection.prototype = {
    setInstance(instance){
        this.instance = instance;
    },
    sendMessage: function(tag, message){
        this.p_socket.emit(tag, message);
    },
    addEventListener: function(tag, event){
        this.p_socket.on(tag, event.bind(this.instance));
    },
    disconnect(){
        this.p_socket.disconnect();
    }
};

export function OfflineConnection(hostname, port){}

OfflineConnection.prototype = {
    setInstance(instance){},
    sendMessage: function(tag, message){},
    addEventListener: function(tag, event){},
    disconnect(){}
}

export function ServerConnection(io){
    this.io = io;
    this.instance = null;
}

ServerConnection.prototype = {
    setInstance(instance){
        this.instance = instance;
    },
    sendMessage: function(tag, message){
        if(this.instance.isServer){
            this.io.emit(tag, message);
        }
    },
    addEventListener: function(tag, event){},
    setEventListeners: function(events){
        this.io.sockets.on('connection', function(socket) {
            events(socket);
        })
    },
    disconnect(){}
}