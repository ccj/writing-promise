/**
 * 自定义Promsie函数
 */

(function(window) {
    /**
     * Promise构造函数
     * excutor执行器函数（同步执行）
     */
    function Promise(excutor) {

        const self = this;

        this.status = 'pending'; // promise对象状态
        this.data = undefined; // promise对象指定一个用于存储结果数据的属性
        this.callbacks = []; // 待执行的回调函数

        function resolve(value) {
            if (self.status === 'pending') {
                self.status = 'resolved';
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
            if (self.status === 'pending') {
                self.status = 'rejected';
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
    Promise.prototype.then = function (onResolved, onRejected) {
        this.callbacks.push({
            onResolved,
            onRejected
        });
    }

    /**
     * Promise原型对象的catche()
     * 失败的回调函数
     * 返回一个新的Promise
     */
    Promise.prototype.catch = function (onRejected) {
        
    }
    
    /**
     * Promise函数对象resolve()
     * 返回一个指定结果成功的Promise
     */
    Promise.resolve = function (value) {
        
    }

    /**
     * Promise函数对象reject()
     * 返回一个指定rason的失败的Promise
     */
    Promise.reject = function (reason) {
        
    }

    /**
     * Promise函数对象all()
     * 返回一个Promsise，只有当所有promise都成功时才成功，否则失败
     */
    Promise.all = function (promises) {
        
    }

    /**
     * Promise函数对象race()
     * 返回一个Promsise，其结果由第一个完成的promise决定
     */
    Promise.race = function (promises) {
        
    }

    // 向外暴露Promise函数
    window.Promise = Promise;
})(window);