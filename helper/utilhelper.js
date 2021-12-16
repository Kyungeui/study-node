/**
 * @FileName : UtilHelper.js
 * @Description : 백엔드 개발시 자주 사용되는 독립 함수들 모음
 * @Author : (김경의, chanillekim@gmail.com)
 */

const os = require('os');

module.exports.myip = () => {
    const ipAddress = [] ;
    const nets = os.networkInterfaces();

    for (const attr in nets) {
        const item = nets[attr];

        item.map((v, i) => {
            if (v.family == 'IPv4' && v.address != '127.0.0.1') {
                ipAddress.push(v.address);
            }
        });
    }

    return ipAddress;
}