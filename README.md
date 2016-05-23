<div align="center"><img src="logo.png"/></div>
`µWS` is one of the most lightweight, efficient & scalable WebSocket server implementations available. It features an easy-to-use, fully async object-oriented interface and scales to millions of connections using only a fraction of memory compared to the competition. License is zlib/libpng (very permissive & suits commercial applications).

* Linux, OS X & Windows support.
* Built-in load balancing and multi-core scalability.
* SSL/TLS support & integrates with foreign HTTPS servers.
* Permessage-deflate built-in.
* Node.js binding exposed as the well-known `ws` interface.
* Optional engine in projects like Socket.IO, Primus & SocketCluster.

[![npm version](https://badge.fury.io/js/uws.svg)](https://badge.fury.io/js/uws) [![](https://api.travis-ci.org/alexhultman/uWebSockets.svg?branch=master)](https://travis-ci.org/alexhultman/uWebSockets) [![](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/alexhultman/uWebSockets)
[![OpenCollective](https://opencollective.com/uwebsockets/backers/badge.svg)](#backers) 
[![OpenCollective](https://opencollective.com/uwebsockets/sponsors/badge.svg)](#sponsors)


## Benchmarks table - [validate](https://github.com/alexhultman/uWebSockets/tree/master/benchmarks#websocket-echo-server-benchmarks)
Implementation | Memory scaling | Connection performance | Short message throughput | Huge message throughput
--- | --- | --- | --- | ---
libwebsockets master(1.7-1.8) | µWS is **14x** as lightweight | µWS is **equal** in performance | µWS is **3x** as performant | µWS is **equal** in performance
ws v1.1.0 + binary addons | µWS is **47x** as lightweight | µWS is **18x** as performant | µWS is **33x** as performant | µWS is **2x** as performant
WebSocket++ v0.7.0 | µWS is **63x** as lightweight | µWS is **4x** as performant | µWS is **3x** as performant | µWS is **2x** as performant

*Benchmarks are run with default settings in all libraries, except for `ws` which is run with the native performance addons. The libwebsockets benchmark is a little bit outdated, I'm going to fill in new data points with version 2.0.*

## Usage

### Node.js
We built `µWS` with the existing Node.js infrastructure in mind. That's why we target the widespread `ws` interface, allowing us to seamlessly integrate with projects like SocketCluster, Socket.IO & Primus.

* Read the [ws documentation](https://github.com/websockets/ws/blob/master/doc/ws.md)
* Read the [Primus transformer documentation](https://github.com/primus/primus#uws)

##### SocketCluster
Use the new `wsEngine: 'uws'` option like so:
```javascript
var socketCluster = new SocketCluster({ wsEngine: 'uws' });
```
We've worked closely together with the [SocketCluster](http://socketcluster.io) team and aim to bring you `µWS` as the default WebSocket engine in SocketCluster 5.

##### Socket.IO
Use the new `wsEngine: 'uws'` option like so:
```javascript
var io = require('socket.io')(80, { wsEngine: 'uws' });
```
This option has not yet been released, one alternative way of enabling `uws` in current versions of Socket.IO is:
```javascript
var io = require('socket.io')(80);
io.engine.ws = new require('uws').Server({
    noServer: true,
    clientTracking: false,
    perMessageDeflate: false
});
```
##### Primus
Set 'uws' as transformer:
```javascript
var primus = new Primus(server, { transformer: 'uws' });
```
##### ws
If your code directly relies on `ws` you can simply swap `require('ws')` with `require('uws')`:
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
### C++
For maximum performance and memory scaling the native interface is recommended. Look in the examples folder for threading and load balancing examples. There is no documentation written yet but a bright person like you will have no problem just reading the header file.
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
* Valgrind clean.
* Autobahn tests [all pass](http://htmlpreview.github.io/?https://github.com/alexhultman/uWebSockets/blob/master/autobahn/index.html).
* All Primus transformer integration tests pass.
* All Engine.IO server tests pass.
* Small & efficient code base.

## Installation
### Node.js
[![](https://nodei.co/npm/uws.png)](https://www.npmjs.com/package/uws)
```
npm install --save uws
```

* Node.js 4.x, 5.x & 6.x supported
* Linux & Mac OS X 10.7+

*Node.js is broken on Windows and needs to be fixed for us to support the platform*

#### Manual compilation
If you for some reason want and/or need to build the Node.js addon from source:

* Jump to nodejs folder:
  - `cd uWebSockets/nodejs`
* Compile the project:
  - `make`

This populates the nodejs/dist folder with binaries.

### Native developers
#### Dependencies
First of all you need to install the required dependencies. On Unix systems this is typically done via package managers, like [homebrew](http://brew.sh) in the case of OS X or `dnf` in the case of Fedora Linux. On Windows you need to search the web for pre-compiled binaries or simply compile the dependencies yourself.

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



#### Backers

Support us with a monthly donation and help us continue our activities. [[Become a backer](https://opencollective.com/uwebsockets#backer)]

<a href="https://opencollective.com/uwebsockets/backer/0/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/1/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/2/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/3/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/4/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/5/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/6/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/7/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/8/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/9/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/10/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/10/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/11/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/11/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/12/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/12/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/13/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/13/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/14/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/14/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/15/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/15/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/16/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/16/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/17/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/17/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/18/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/18/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/19/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/19/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/20/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/20/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/21/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/21/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/22/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/22/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/23/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/23/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/24/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/24/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/25/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/25/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/26/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/26/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/27/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/27/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/28/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/28/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/backer/29/website" target="_blank"><img src="https://opencollective.com/uwebsockets/backer/29/avatar.svg"></a>


#### Sponsors

Become a sponsor and get your logo on our README on Github with a link to your site. [[Become a sponsor](https://opencollective.com/uwebsockets#sponsor)]

<a href="https://opencollective.com/uwebsockets/sponsor/0/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/1/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/2/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/3/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/4/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/5/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/6/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/7/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/8/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/9/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/10/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/10/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/11/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/11/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/12/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/12/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/13/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/13/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/14/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/14/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/15/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/15/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/16/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/16/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/17/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/17/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/18/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/18/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/19/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/19/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/20/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/20/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/21/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/21/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/22/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/22/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/23/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/23/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/24/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/24/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/25/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/25/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/26/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/26/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/27/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/27/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/28/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/28/avatar.svg"></a>
<a href="https://opencollective.com/uwebsockets/sponsor/29/website" target="_blank"><img src="https://opencollective.com/uwebsockets/sponsor/29/avatar.svg"></a>
