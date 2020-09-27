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