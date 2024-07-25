// interfaces
export const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
  );

export function isEqual(obj1 : object, obj2 : object){
    return (JSON.stringify(obj1) == JSON.stringify(obj2))
}