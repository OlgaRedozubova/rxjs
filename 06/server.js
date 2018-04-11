const express = require('express');
const server = express();
const port = process.env.PORT || 5000;

const Rx = require('rxjs');


function main(sources) {
    return {
//        HTTP: requests_.do(e => console.log('request to', e.req.url))
        HTTP: sources.HTTP.do(e => console.log('request to', e.req.url))
    }
}
function makeHttpEffect(model_) {
    const requests_ = new Rx.Subject();

    return {
        //effects
        writeEffect: function (model_) {
            model_.subscribe(e => {
                    console.log('sending hello');
                    e.res.send('Hello World!');
                }
            );
            return requests_
        },
        //effects
        serverCallback: (req, res) => {
            requests_.next({req: req, res: res})
        },
        //effects
        readEffect: requests_
    }
}

const httpEffect = makeHttpEffect();
const drivers ={
    HTTP: httpEffect
};

function run(main, drivers) {
    const sources = {
        HTTP: drivers.HTTP.readEffect
    };

    const sinks = main(sources);

    Object.keys(drivers).forEach(key => {
        drivers[key].writeEffect(sinks[key])
    })
}

run(main, drivers);

//server.get('/', httpEffect.serverCallback);
server.get('*', httpEffect.serverCallback);

server.listen(port, () => console.log(`Listening on port ${port}`));


// const drivers = {
//     HTTP: httpEffect
// };



//const requests_ = new Rx.Subject();

// function sendHello(e) {
//     console.log('sending hello');
//     e.res.send('Hello World!');
// }
// const subscription = requests_
//     .do(e => console.log('request to', e.req.url))
//     .subscribe(
//         sendHello,
//         console.error,
//         () => {
//             console.log('done');
//             subscription.dispose()
//         });
// process.on('exit', () => subscription.dispose());

//server.get('/', function (req, res, next) {
// server.get('*', function (req, res, next) {
//    // res.send('Hello World!');
//     requests_.next({req: req, res: res});
//     next();
// });
//
//
// server.listen(port, () => console.log(`Listening on port ${port}`));