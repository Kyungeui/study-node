const logger = require('./LogHelper');

module.exports = () => {
    return (req, res, next) => {

        // /** 프론트엔드에게 JSON 결과를 출력하는 기능 */
        // res.sendResult(statusCode, message, data) => {
        //     const json = {
        //         'rt': statusCode,
        //         'rtmsg': message,
        //     };

        //     if (data !== undefined) {
        //         for (const key in data) {
        //             json[key] = data[key];
        //         }
        //     }

        //     json.pubdata = new Date().toISOString();
        //     this.status(statusCode).send(json);
        // };


        /** 400 에러가 발생한 경우에 대한 Error를 JSON으로 출력한다. */
        res.sendNotFound = ()=> {
            res.sendResult(400,'페이지를 찾을 수 없습니다.');
        };

        /** 400 에러가 발생한 경우에 대한 Error를 JSON으로 출력한다. */
        res.sendNotFound = ()=> {
            res.sendResult(400,'페이지를 찾을 수 없습니다.');
        };

        /** 400 에러가 발생한 경우에 대한 Error를 JSON으로 출력한다. */
        res.sendNotFound = ()=> {
            res.sendResult(400,'페이지를 찾을 수 없습니다.');
        };

        next();
    };
};