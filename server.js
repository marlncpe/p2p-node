var net = require('net');

var serversActive = [];
var serversBuddys = [];
var Client = false;
var Server = false;
var port = 2324;
// standard server
serversActive.push("95.143.172.12"); // Fornax

// search array for an ip
var findIp = function(ip) {
	for(var k in serversActive) {
		if(ip == serversActive[k]) {
			return true;
		}
	}
};

// add ips to serversActive array
var addIPs = function(ipArr) {
	// check if array is an array
	if(typeof ipArr == 'object') {
		for(var k in ipArr) {
			// search for ip in known ip array
			if( !findIp(ipArr[k]) ) {
				// ip not available
				serversActive.push(ipArr[k]);
			}
		}
	}
};

// ping ips and get new ips from stable connections
var pingIps = function(ipArr) {
	for(var k in ipArr) {
		var client = net.connect(port, ipArr[k], function() {
			console.log('correct IP found ->'+ipArr[k]);
			console.log('i contact this ip and see if i get some new stuff :)');
			client.write('show\r\n');
		});

		client.on('data',function(response){
			console.log('wohooo, got new ips. look -> '+response.toString() );
			addIPs(JSON.parse(response.toString()));
			console.log('new ips added!');
		});

		client.on('error',function(){
			console.log('incorrect ip found :( ->'+ipArr[k]);
		});

	}
};

// start a server to listen for input
Server = net.createServer(function(c) {
	// set encoding to utf8
	// this converts var "data" to a string
	c.setEncoding('utf8');
	// Event: Fire on Input Data
	c.on('data', function(data) {
		var command = data.toString().trim();
		console.log('date received: '+data);
		// user sends "show" command
		if(command == 'show') {
			// list all known ips
			c.write(JSON.stringify(serversActive));
		}

		else if(command == 'pingall') {
			pingIps(serversActive);
		}

		else {
			// User has sende an array of ips
			addIPs(JSON.parse(data.toString().trim()));
		}
	});
}).listen(port);

// check all ips and get 
// new ips from stable connections
pingIps(serversActive);
