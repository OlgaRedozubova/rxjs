const Rx = require('rx');
const requests_ = new Rx.Subject();

//примечание/Печать на консоль также является эффектом записи, поэтому мы не должны включать это в main()функцию
function main() {
    return {
        HTTP: requests_.tap(e => console.log('request to', e.req.url)),
        // LOG: requests_.map(e => e.req.url),
        // DB: requests_.map( /* something to go into DB */)
    }
    // requests_.tap(e => console.log('request to', e.req.url))
}


function run(main, effects) {
    const sinks = main()
    Object.keys(effects).forEach(key => {
        effects[key](sinks[key])
    })
}

function httpEffect(model_) {
    model_.subscribe(e => {
        console.log('sending hello')
        e.res.writeHead(200, { 'Content-Type': 'text/plain' })
        e.res.end('Hello World\n')
    })
}


const drivers = {
    HTTP: httpEffect
};
run(main, drivers);
// run(main, {
//     HTTP: httpEffect
// });



// const sink = main();
// httpEffect(sink.HTTP); //httpEffect(sink);

// logEffect(sink.LOG)
// dbEffect(sink.DB)


// function sendHello(e) {
//     e.res.writeHead(200, { 'Content-Type': 'text/plain' });
//     e.res.end('Hello World\n');
// }
// requests_
//     .tap(e => console.log('request to', e.req.url))
//     .subscribe(sendHello);

const http = require('http');
const hostname = '127.0.0.1';
const port = 1337;

http.createServer(
    (req, res) => {
        requests_.onNext({ req: req, res: res });
    }
)
    .listen(port, hostname, () => {
        console.log(`Server running at http://${hostname}:${port}/`);
    });