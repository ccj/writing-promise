![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24a6290cbd5c45a7ba3be732091fd777~tplv-k3u1fbpfcp-zoom-1.image)
# writing-promise
你是否真正自己手写过一个promise？

## 想过这些问题没有？
>* 什么是promise?  
>* promise诞生的意义是什么，为什么会有promise?  
>* promise的Api有哪些?  
>* 如何使用这些Api呢？（mdn有详细的用法，详细的不能太详细）  
>* 终极解决方案async/await的使用！  
>* 手写一个promise吧！  

## 什么是promise？
抽象表达：Promise 是JS 中进行异步编程的新的解决方案  
具体表达：Promise 是一个构造函数，promise对象用来封装一个异步操作并可以获取其结果  

## promise诞生的意义是什么，为什么会有promise?  
1.指定回调函数的方式更加灵活  
promise之前：必须在启动异步任务前指定  
promise：启动异步任务=> 返回promie 对象=> 给promise 对象绑定回调函
数(甚至可以在异步任务结束后指定/多个)  
2.支持链式调用, 可以解决回调地狱问题  
什么是回调地狱? 回调函数嵌套调用, 外部回调函数异步执行的结果是嵌套的回调函数执行的条件  
回调地狱的缺点? 不便于阅读/ 不便于异常处理  
解决方案? promise 链式调用  
终极解决方案? async/await  

## promise的Api有哪些?  
1.Promise 构造函数: Promise (excutor) {}  
2.Promise.prototype.then 方法: (onResolved, onRejected) => {}  
3.Promise.prototype.catch 方法: (onRejected) => {}  
4.Promise.resolve 方法: (value) => {}  
5.Promise.reject 方法: (reason) => {}  
6.Promise.all 方法: (promises) => {}  
7.Promise.race 方法: (promises) => {}  

## 终极解决方案async/await的使用！
async: async定义的异步函数返回一个promise   
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function  
await：await右部等待一个值。如果是promise，则返回promise成功时的返回值，promise失败的值需要在try/catch中捕获。如果不是promise，则返回改值。  
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/await

async可以单独使用，await使用时其当前所在函数必须为async修饰。

## 手写一个promise吧！
```
/**
 * 自定义Promsie函数
 */

(function(window) {

    const PENDING = 'pending';
    const RESOLVED = 'resolved';
    const REJECTED = 'rejected';
    
    class Promise {
        constructor(excutor) {
            const self = this;

            self.status = PENDING; // promise对象状态
            self.data = undefined; // promise对象指定一个用于存储结果数据的属性
            self.callbacks = []; // 待执行的回调函数

            function resolve(value) {
                if (self.status === PENDING) {
                    self.status = RESOLVED;
                    self.data = value;
                    if(self.callbacks.length > 0) {
                        setTimeout(() => { // 模拟宏队列任务
                            self.callbacks.forEach((callbanckObj) => {
                                callbanckObj.onResolved(value);
                            });
                        });
                    }
                }
            }

            function reject(reason) {
                if (self.status === PENDING) {
                    self.status = REJECTED;
                    self.data = reason;
                    if(self.callbacks.length > 0) {
                        setTimeout(() => {// 模拟宏队列任务
                            self.callbacks.forEach((callbanckObj) => {
                                callbanckObj.onRejected(reason);
                            });
                        });
                    }
                }
            }

            try {
                excutor(resolve, reject);
            } catch (error) {
                reject(error);
            }
        }

        /**
         * Promise原型对象的then()
         * 指定成功和失败的回调函数
         * 返回一个新的Promise
         */
        then(onResolved, onRejected) {

            const self = this;

            onResolved = typeof onResolved === 'function' ? onResolved : value => value;

            onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

            return new Promise((resolve, reject) => {

                function handle(callback) {
                    try {
                        const result = callback(self.data);
                        if (result instanceof Promise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error);
                    }
                }

                if (self.status === PENDING) {
                    self.callbacks.push({
                        onResolved() {
                            handle(onResolved);
                        },
                        onRejected() {
                            handle(onRejected);
                        }
                    });
                } else if (self.status === RESOLVED) {
                    setTimeout(() => {
                        handle(onResolved);
                    });
                } else if (self.status === REJECTED) {
                    setTimeout(() => {
                        handle(onRejected);
                    });
                }
            });
        }

        /**
         * Promise原型对象的catche()
         * 失败的回调函数
         * 返回一个新的Promise
         */
        catch(onRejected) {
            return this.then(undefined, onRejected);
        }
        
        /**
         * Promise函数对象resolve()
         * 返回一个指定结果成功的Promise
         */
        static resolve = function (value) {
        return new Promise((resolve, reject) => {
                if (value instanceof Promise) {
                    value.then(resolve, reject);
                } else {
                    resolve(value);
                }
        });
        }

        /**
         * Promise函数对象reject()
         * 返回一个指定rason的失败的Promise
         */
        static reject = function (reason) {
            return new Promise((resolve, reject) => {
                reject(reason);
            });
        }

        /**
         * Promise函数对象all()
         * 返回一个Promsise，只有当所有promise都成功时才成功，否则失败
         */
        static all = function (promises) {

            const values = new Array(promises.length);
            let count = 0;

            return new Promise((resolve, reject) => {
                promises.forEach((promise, index) => {
                    Promise.resolve(promise).then(
                        value => {
                            count++;
                            values[index] = value;
                            if (count === promises.length) {
                                resolve(values);
                            }
                        },
                        reason => {
                            reject(reason);
                        }
                    )
                })
            });
        }

        /**
         * Promise函数对象race()
         * 返回一个Promsise，其结果由第一个完成的promise决定
         */
        static race = function (promises) {
            return new Promise((resolve, reject) => {
                promises.forEach(promise => {
                    Promise.resolve(promise).then(resolve, reject);
                });
            });
        }
    }
    
    // 向外暴露Promise函数
    window.Promise = Promise;
})(window);
```