<p align="center"><img src="https://raw.githubusercontent.com/alexhultman/uWebSockets/master/logo.png"/></p>
`µWS` is one of the most lightweight, efficient & scalable WebSocket server implementations available. It features an easy-to-use, fully async object-oriented interface and scales to millions of connections using only a fraction of memory compared to the competition. License is zlib/libpng (very permissive & suits commercial applications).

* Linux, OS X & Windows support.
* Node.js binding exposed as the well-known `ws` interface.
* Primus transformer ['uws'](https://github.com/primus/primus#uws).
* Chrome, Safari, Firefox, Edge support.
* Keep one thread per CPU core, each serving millions of connections.
* Expose a port range or use the load balancer to only expose one port, scaling over all CPU cores.
* Planned SSL/TLS support (work in progress)

[![](https://img.shields.io/github/tag/alexhultman/uWebSockets.svg)]()

## Benchmarks table
Implementation | Memory scaling | Connection performance | Short message throughput | Huge message throughput
--- | --- | --- | --- | ---
libwebsockets master(1.7-1.8) | µWS is **14x** as lightweight | µWS is **equal** in performance | µWS is **3x** as performant | µWS is **equal** in performance
ws v1.0.1 + binary addons | µWS is **52x** as lightweight | µWS is **21x** as performant | µWS is **23x** as performant | µWS is **2x** as performant
WebSocket++ v0.7.0 | µWS is **63x** as lightweight | µWS is **5x** as performant | µWS is **2x** as performant | µWS is **3x** as performant
*Benchmarks are run with default settings in all libraries, except for `ws` which is run with the native performance addons.*

## Overview

For Node.js developers, the `ws` interface is exposed (read [their](https://github.com/websockets/ws/blob/master/doc/ws.md) documentation):

```javascript
var WebSocketServer = require('uws').Server; /* you replace 'ws' with 'uws' */
var wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function (ws) {
    ws.on('message', function (message) {
        console.log('received: ' + message);
    });

    ws.send('something');
});
```
For C++ developers:
```c++
int main()
{
    /* this is an echo server that properly passes every supported Autobahn test */
    uWS::Server server(3000);
    server.onConnection([](uWS::Socket socket) {
        cout << "[Connection] clients: " << ++connections << endl;
    });

    server.onMessage([](uWS::Socket socket, const char *message, size_t length, uWS::OpCode opCode) {
        socket.send((char *) message, length, opCode);
    });

    server.onDisconnection([](uWS::Socket socket) {
        cout << "[Disconnection] clients: " << --connections << endl;
    });

    server.run();
}
```

## Quality control
* Valgrind clean
* Autobahn chapters 1 - 9 [all pass](http://htmlpreview.github.io/?https://github.com/alexhultman/uWebSockets/blob/master/autobahn/index.html).
* All Primus transformer integration tests pass.
* Small & efficient code base.

## Installation
### Node.js developers
[![](https://nodei.co/npm/uws.png)](https://www.npmjs.com/package/uws)

```
npm install --save uws
```

* Node 4.x, 5.x support (ABI 46-47)
* Linux & Mac OS X 10.7+

### Native developers
#### Dependencies
First of all you need install the required dependencies. On Unix systems this is typically done via package managers, like [homebrew](http://brew.sh) in the case of OS X or `dnf` in the case of Fedora Linux. On Windows you need to search the web for pre-compiled binaries or simply compile the dependencies yourself.

* libuv 1.x
* OpenSSL 1.0.x
* CMake 3.x

#### Compilation
Obviously you will need to clone this repo to get the sources. We use CMake as build system.

* `git clone https://github.com/alexhultman/uWebSockets.git && cd uWebSockets`
* `cmake .`

Now, on Unix systems it should work by simply running `make`. Run [sudo] `make install` as you wish.

##### Windows, in all its glory
If you are running Windows you should now have a bunch of Visual Studio project files and one solution file. Open the solution file, now you need to make sure the header include paths and library paths are all set according to where you installed the dependencies. You might also need to change the names of the libraries being linked against, all according to the names of the installed library files. You know the drill.
