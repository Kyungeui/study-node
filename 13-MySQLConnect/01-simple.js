/** (1) mysql 모듈 불러오기 */
// npm install mysql2 --save
const mysql = require('mysql2');

/** (2) mysql 모듈 객체 생성 및  접속 정보 설정 */
const dbcon = mysql.createConnection({
    host: 'localhost',       // MYSQL 서버 주소 (다른 PC인 경우 IP주소)
    port: 3306,              // MYSQL tjfcltl rlqhsrkqt 3306
    user: 'root',            //  접근 권한 아이디 (root=관리자)
    password: 'Ruddml.0560', // 설치시 입력한 비밀번호
    database: 'myschool',    // 사용할 데이터베이스 이름
});

/** (3) 데이터베이스 접속 */
// 콜백함수는 db접속에 성공한 경우 수행될 내용 -> SQL 실행
dbcon.connect((error) => {
    if (error) {
        console.log('데이터베이스 접속에 실패했습니다.');
        console.logd(error);
        return;
    }

    /** (4) INSERT,UPDATE,DELETE 쿼리 생성하기 */
    // 실행할 SQL 구문
    // Node의 변수로 치환될 부분(주로 저장, 수정될 값)은 ?로 지정
    // 문자열이더라도 홀따옴표 사용 안함
    var sql = 'INSERT INTO department (dname, loc) VALUES (?, ?)';
    // SQL문의 '?'를 치환할 배열 --> ? 순서대로 값을 지정한다.
    var input_date = ['Node학과', '공학관'];

    /** (5) SQL 실행하기 */
    dbcon.beginTransaction( (error) => {
        dbcon.query(sql, input_data, (error, result) => {
            if (error) {
                // Ctrl+z
                dbcon.rollback();
                console.log('SQL문 실행에 실패했습니다.');
                console.log(error);
                dbcon.end();   // 데이터베이스 접속 해제
                return;
            }

            // Ctrl+s
            dbcon.commit();
            // 저장결과 확인
            console.log('반영된 데이터의 수: ' + result.affectedRows);
            // UPDATE,DELETE 쿼리의 경우 사용할 수 없는 값임
            console.log('생성된 PK값: ' + result.insertID);
            // 데이터베이스 접속 해제
            dbcon.end();
        });
    });
});