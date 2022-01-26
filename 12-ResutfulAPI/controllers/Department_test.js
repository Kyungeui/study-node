/**
 * department 테이블에 대한 CRUD 기능을 수행하는 Restful API
 */

/** 모듈 참조 부분 */
const config = require('../../helper/_config');
const logger = require('../../helper/LogHelper');
const regexHelper = require('../../helper/RegexHelper');
const util = require("../../helper/UtilHelper");
const router = require('express').Router();
const mysql2 = require('mysql2/promise');

/** 라우팅 정의 부분 */
module.exports = (app) => {
    let dbcon = null;
    
    /** 전체 목록 조회 --> Read(SELECT) */
    router.get("/department", async (req, res, next) => {

        const query = req.get('query');

        const page = req.get('page', 1);

        const rows = req.get('rows', 10);

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 조회
            let sql1 = 'SELECT deptno, dname, loc FROM department';
            // SQL문에 설정할 치환값
            let args1 = [];

            if (query != null) {
                sql1 += "WHERE dname LIKE concat('%', ?, '%')";
                args1.push(query);
            }

            const [result1] = await dbcon.query(sql1, args1);
            const totalCount = result1[0].cnt;

            pagenation = utilHelper.pagenation(totalCount, page, rows);
            logger.debug(JSON.stringify(pagenation));

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result;
        } catch (err) {
            return next(err);
        } finally {
            dbcon.end();
        }   
        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 특정 항목에 대한 상세 조회 --> Read(SELECT) */
    router.get("/department/:deptno", async (req, res, next) => {
        const deptno = req.get.deptno;

        if (deptno === null) {
            return next(new Error(400));
        }

        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 조회
            const sql = 'SELECT deptno, dname, loc FROM department WHERE deptno=?';
            const [result] = await dbcon.query(sql, [deptno]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result;
        } catch (err) {
            return next(err)
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 데이터 추가 --> Create(INSERT) */
    router.post("/department", async (req, res, next) => {
        // 저장을 위한 파라미터 입력받기 
        const dname = req.post('dname');
        const loc = req.post('loc');

        try {
            regexHelper.value(dname, '학과이름이 없습니다.');
            regexHelper.maxLength(dname, 10, '학과이름이 너무 깁니다.');
        } catch (err) {
            return next(err);
        }

        if (dname === null) {
            //  400 Bad Request -> 잘못된 요청
            return next(new Error(400));
        }

        /** 데이터 저장하기 */
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 저장하기
            const sql = 'INSERT INTO department (dname, loc) VALUES (?, ?)';
            const input_data = [dname, loc];
            const [result1] = await dbcon.query(sql, input_data);

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = 'SELECT deptno, dname, loc FROM department WHERE deptno=?';
            const [result2] = await dbcon.query(sql2, [result1.insertId]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2;
        } catch (err) {
            return next(err)
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 데이터 수정 --> Update(UPDATE) */
    router.put("/department/:deptno", async (req, res, next) => {
        const deptno = req.get('deptno');
        const dname = req.post('dname');
        const loc = req.post('loc');

        if (deptno === null || dname == null) {

            return next(new Error(400));
        }

        /** 데이터 수정하기 */
        // 데이터 조회 결과가 저장될 빈 변수
        let json = null;

        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 데이터 수정하기
            const sql = 'UPDATE department SET dname=?, loc=? WHERE deptno=?';
            const input_data = [dname, loc, deptno];
            const [result1] = await dbcon.query(sql, input_data);

            // 결과 행 수가 0이라면 예외처리 
            if (result1.affectedRows < 1) {
                throw new Error('수정된 데이터가 없습니다.');
            }

            // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
            const sql2 = 'SELECT deptno, dname, loc FROM department WHERE deptno=?';
            const [result2] = await dbcon.query(sql2, [deptno]);

            // 조회 결과를 미리 준비한 변수에 저장함
            json = result2;
        } catch (err) {
            return next(err)
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson({'item': json});
    });

    /** 데이터 삭제 --> Delete(DELETE) */
    router.delete("/department/:deptno", async (req, res, next) => {
        const deptno = req.get('deptno');

        if (deptno === null) {
            //  400 Bad Request -> 잘못된 요청
            return next(new Error(400));
        }

        /** 데이터 삭제하기 */
        try {
            // 데이터베이스 접속
            dbcon = await mysql2.createConnection(config.database);
            await dbcon.connect();

            // 삭제하고자 하는 원 데이터를 참조하는 자식 데이터를 먼저 삭제해야 한다.
            // 만약 자식데이터를 유지해야 한다면 참조키 값을 null로 업데이트 해야 한다.
            // 단, 자식 데이터는 결과행 수가 0이더라도 무시한다.
            await dbcon.query("DELETE FROM student WHERE deptno=?", [deptno]);
            await dbcon.query("DELETE FROM professor WHERE deptno=?", [deptno]);

            // 데이터 삭제하기
            const sql = 'DELETE FROM department WHERE deptno=?';
            const [result1] = await dbcon.query(sql, [deptno]);

            // 결과 행 수가 0이라면 예외처리 
            if (result1.affectedRows < 1) {
                throw new Error('삭제된 데이터가 없습니다.');
            }
        } catch (err) {
            return next(err)
        } finally {
            dbcon.end();
        }

        // 모든 처리에 성공했으므로 정상 조회 결과 구성
        res.sendJson();
    });

    return router;
};
