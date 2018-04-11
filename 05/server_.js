const http = require('http');
const hostname = '127.0.0.1';
const port = 1337;

const Rx = require('rx');
const requests_ = new Rx.Subject();


// const in_ = Rx.Observable
//     .interval(200)
//     .take(5)
// const rateLimit = require('rate-limit.js')
// const limited_ = rateLimit(in_, 1000)
// limited_
//     .timeInterval()
//     .subscribe(
//         console.log,
//         console.error,
//         console.log.bind(console, 'limited completed')
//     )



// const timeEvents = Rx.Observable
//     .interval(1000)
// const numberEvents = Rx.Observable
//     .fromArray([3, 1, 7]);
//
// Rx.Observable.zip(timeEvents, numberEvents, function pickValue(t, n) { return n; })
//     .subscribe(console.log);


function sendHello(e) {
    console.log('sending hello');
    e.res.writeHead(200, { 'Content-Type': 'text/plain' });
    e.res.end('Hello World\n');
}

//обработка любых ошибок в потоке
const subscription = requests_
    .tap(e => console.log('request to', e.req.url))
    .subscribe(
        sendHello,// the success - успех (с новым событием)
        console.error, //the error - ошибка
        () => { //thenstream complete callbacks
            console.log('stream is done')
            // nicely frees the stream
            subscription.dispose()
        }
    )
process.on('exit', () => subscription.dispose())



http.createServer((req, res) => {
    requests_.onNext({ req: req, res: res });

}).listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

// http.createServer((req, res) => {
//     res.writeHead(200, { 'Content-Type': 'text/plain' });
//     res.end('Hello World\n');
// }).listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });


// const Rx = require('rx');
// const requests_ = new Rx.Subject();
//
// function sendHello(e) {
//     console.log('sending hello');
//     e.res.writeHead(200, { 'Content-Type': 'text/plain' });
//     e.res.end('Hello World\n');
// }
//
// requests_
//     .subscribe(sendHello)

// const http = require('http');
// const hostname = '127.0.0.1';
// const port = 1337;
// http.createServer((req, res) => {
//     requests_.onNext({ req: req, res: res });
// }).listen(port, hostname, () => {
//     console.log(`Server running at http://${hostname}:${port}/`);
// });