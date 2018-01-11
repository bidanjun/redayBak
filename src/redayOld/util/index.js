
// 是否是函数
// 这个判断是有问题的，因为class也是返回true
export const isFunction = fn => (typeof fn === 'function');

// 首字母大写
export const capitalize = str => (str.charAt(0).toUpperCase() + str.slice(1));

export function delayedPromise(durationInMs, resolutionPayload) {
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(resolutionPayload)
      }, durationInMs)
    })
  }
