/** (1) mysql 모듈 불러오기 */
// npm install --save mysql2
const mysql2 = require('mysql2/promise');
const config = require('../helper/_config');

(async () => {
    let dbcon = null;

    /** (2) mysql 모듈 객체 생성 및 접속 정보 설정 및 접속 */
    try {
        dbcon = await mysql2.createConnection(config.database);
        await dbcon.connect();
    } catch (err) {
        console.log(err);
        return;
    }

    /** (3) SQL 실행하기 */
    try {
        const sql = 'SELECT deptno, dname, loc FROM department WHERE deptno <= ?';
        const input_data = [202];
        const [result1] = await dbcon.query(sql, input_data);
    
        // result1.map((v, i) => {
        //     console.log("%d, %s, %s", v.deptno, v.dname, v.loc);
        // });

        console.log(result1);
    }catch (err) {
        console.log(err);
        // 앞 처리 과정에서 db에 접속이 된 상태이므로 SQL실행도중 문제가 발생하면 DB접근 해제해야 한다.
        dbcon.end();
        return;
    }

    dbcon.end();
})();
