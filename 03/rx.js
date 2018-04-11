'use strict';
const Rx = require('rxjs');

//Наблюдаемый объект или Observable

class Observable {
  constructor(source) {
//    this.source = source;
    this.source = source.split('');
    this.result = this.source;
  }

  subscribe(next) {
    for(let item of this.result) {
      next(item);
    }
  }

  filter(predicate) {
    this.result = this.result.filter(predicate);
    return this;
  }

  map(callback) {
    this.result = this.result.map(callback);
    return this;
  }
}


//Методы map и filter в Rxjs называются операторами
Rx.Observable.from('Observable')
  .map((letter) => letter.toUpperCase())
  .filter(letter => letter === 'O')
  .subscribe((letter) => console.log(letter));