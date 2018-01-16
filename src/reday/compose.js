export default (...functions)=> {
  if (functions.length === 0) {
    return arg => arg
  }

  if (functions.length === 1) {
    return functions[0]
  }

  return functions.reduce((prev,next ) => (...args) => prev(next(...args)))
}