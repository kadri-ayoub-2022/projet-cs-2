const http = require("http");
const express = require("express");
const connectDB = require('./db/db');
const cors = require("cors");
const globalError = require("./middlewares/errorMiddleware");
const roomRoute = require('./routes/room');
const periodRoute = require('./routes/DefensePeriod');
const thesisDefenseRoute = require('./routes/thesisDefense');
const { Eureka } = require('eureka-js-client');
const app = express();
app.use(express.json());


connectDB();



app.use(
    cors({
        origin: "http://localhost:5173", // Update with your client's origin
        credentials: true,
    })
);


app.use('/api/thesisDefense',thesisDefenseRoute)
app.use('/api/thesisDefense/Room',roomRoute);
app.use('/api/thesisDefense/Period',periodRoute);



  // Global error handling middleware for express
app.use(globalError);





const port = 8085;
const server = http.createServer(app);
server.listen(port, async () => {
    try {
        console.log(`Server is Listening on PORT ${port}`);
        const eurekaClient = new Eureka({
            instance: {
                app: 'ms-thesis-defense', // must match Eureka service ID
                instanceId: `ms-thesis-defense:${port}`,
                hostName: 'localhost',
                ipAddr: '127.0.0.1',
                statusPageUrl: `http://localhost:${port}/info`,
                port: {
                    '$': port,
                    '@enabled': true,
                },
                vipAddress: 'ms-thesis-defense',
                dataCenterInfo: {
                    '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
                    name: 'MyOwn',
                },
            },
            eureka: {
                host: 'localhost',
                port: 8761,
                servicePath: '/eureka/apps/',
            },
        });

        eurekaClient.start((error) => {
            if (error) {
                console.error('Eureka registration failed:', error);
            } else {
                console.log('Registered with Eureka!');
            }
        });
    } catch (error) {
        console.log(error);
    }
});

  // Event => list =>callback(err)
  // Handle rejection outside express
process.on("unhandledRejection", (err) => {
    console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
    // just in case of the current request
    server.close(() => {
        console.error(`Shutting down....`);
        process.exit(1);
    });
});


