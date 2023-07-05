/**
 * @version 1.0.0
 * @license MIT
 * @example node index.js
 * @author: Abdul Muttaqin
 */
function removeNulls(obj) {
    let isArray = obj instanceof Array;
    for (let k in obj) {
        if (obj[k] === null) {
            isArray ? obj.splice(k, 1) : delete obj[k];
        } else if (typeof obj[k] == "object") {
            removeNulls(obj[k]);
        }
        if (isArray && obj.length != k) {
            removeNulls(obj);
        }
    }
}

module.exports = {
    removeNulls
};
