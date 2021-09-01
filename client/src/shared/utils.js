export const reverseBSearch = (arr, low, high, objPropName, value,el=null) => {
    if (high >= low) {
        let mid = Math.floor((high - low)/2) + low;
        
        if (arr[mid][objPropName] === value) {
            el = {...arr[mid]};
        } else if (arr[mid][objPropName] > value) {
            return reverseBSearch(arr, mid+1, high, objPropName, value);
        } else {
            return reverseBSearch(arr, low, mid-1, objPropName, value);
        }
        return el;
    } 
};
