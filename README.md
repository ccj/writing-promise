# writing-promise
手写promise

## 回忆一些问题
>* 什么是promise?  
>* promise诞生的意义是什么，为什么会有promise?  
>* promise的Api有哪些?  
>* 手写一个promise?  

## 什么是promise
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

