/**
 * department 테이블에 대한 CRUD 기능을 수행하는 Restful API
 */

/** 모듈 참조 부분 */
const config = require("../../helper/_config");
const logger = require("../../helper/LogHelper");
const regexHelper = require("../../helper/RegexHelper");
const util = require("../../helper/UtilHelper");
const router = require("express").Router();
const mysql2 = require("mysql2/promise");

/** 라우팅 정의 부분 */
module.exports = (app) => {
  let dbcon = null;

  /** 전체 목록 조회 --> Read(SELECT) */
  router.get("/professor", async (req, res, next) => {
    // 현재 페이지 번호 받기 (기본값은 1)
    const page = req.get("page", 1);
    // 한 페이지에 보여질 목록 수 받기 (기본값은 10, 최소 10, 최대 30)
    const rows = req.get("rows", 10);
    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;
    let pagenation = null;

    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();
      // 전체 데이터 수를 조회
      let sql1 = "SELECT COUNT(*) AS cnt FROM professor";
      let args1 = [];
      if (query != null) {
        sql1 += " WHERE name LIKE concat('%', ?, '%')";
        args1.push(query);
      }
      const [result1] = await dbcon.query(sql1, args1);
      const totalCount = result1[0].cnt;
      // 페이지번호 정보를 계산한다.
      pagenation = utilHelper.pagenation(totalCount, page, rows);
      logger.debug(JSON.stringify(pagenation));
      // 데이터 조회
      let sql2 =
        "SELECT profno, name, userid, position, sal, hiredate, comm, p.deptno, dname FROM professor p INNER JOIN department d ON p.deptno=d.deptno";
      // SQL문에 설정할 치환값
      let args2 = [];
      if (query != null) {
        sql2 += " WHERE name LIKE concat('%', ?, '%')";
        args2.push(query);
      }
      sql2 += " LIMIT ?, ?";
      args2.push(pagenation.offset);
      args2.push(pagenation.listCount);
      const [result2] = await dbcon.query(sql2, args2);
      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (err) {
      return next(err);
    } finally {
      dbcon.end();
    }

    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.sendJson({ pagenation: pagenation, item: json });
  });

  /** 특정 항목에 대한 상세 조회 --> Read(SELECT) */
  router.get("/professor/:profno", async (req, res, next) => {
    const profno = req.get("profno");
    if (profno == null) {
      return next(new Error(400));
    }
    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;
    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();
      // 데이터 조회
      const sql =
        "SELECT profno, name, userid, position, sal, hiredate, comm, p.deptno, dname FROM professor p INNER JOIN department d ON p.deptno=d.deptno WHERE profno=?";
      const [result] = await dbcon.query(sql, [profno]);
      // 조회 결과를 미리 준비한 변수에 저장함
      json = result;
    } catch (err) {
      return next(err);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.sendJson({ item: json });
  });

  /** 데이터 추가 --> Create(INSERT) */
  router.post("/professor", async (req, res, next) => {
    // 저장을 위한 파라미터 입력받기
    const name = req.post("name");
    const userid = req.post("userid");
    const position = req.post("position");
    const sal = req.post("sal");
    const hiredate = req.post("hiredate");
    const comm = req.post("comm");
    const deptno = req.post("deptno");
    try {
      regexHelper.value(name, "교수이름이 없습니다.");
      regexHelper.maxLength(name, 50, "교수이름이 너무 깁니다.");
      regexHelper.value(userid, "아이디가 없습니다.");
      regexHelper.maxLength(userid, 50, "아이디가 너무 깁니다.");
      regexHelper.engNum(
        userid,
        50,
        "아이디는 영어와 숫자의 조합으로만 입력되어야 합니다."
      );
      regexHelper.value(position, "직급이 없습니다.");
      regexHelper.maxLength(position, 20, "직급이 너무 깁니다.");
      regexHelper.kor(position, "직급은 한글로만 입력되어야 합니다.");
      regexHelper.value(sal, "급여가 없습니다.");
      regexHelper.num(sal, "급여는 숫자로만 입력되어야 합니다.");
      regexHelper.value(hiredate, "입사일이 없습니다.");
      regexHelper.value(deptno, "소속학과 번호가 없습니다.");
      regexHelper.num(deptno, "소속학과 번호는 숫자로만 입력되어야 합니다.");
    } catch (err) {
      return next(err);
    }

    /** 데이터 저장하기 */
    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;
    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();
      // 데이터 저장하기
      const sql1 =
        "INSERT INTO professor (name, userid, position, sal, hiredate, comm, deptno) VALUES (?, ?, ?, ?, ?, ?, ?)";
      const input_data = [name, userid, position, sal, hiredate, comm, deptno];
      const [result1] = await dbcon.query(sql1, input_data);
      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 =
        "SELECT profno, name, userid, position, sal, hiredate, comm, p.deptno, dname FROM professor p INNER JOIN department d ON p.deptno=d.deptno WHERE profno=?";
      const [result2] = await dbcon.query(sql2, [result1.insertId]);

      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (err) {
      return next(err);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.sendJson({ item: json });
  });

  /** 데이터 수정 --> Update(UPDATE) */
  router.put("/professor/:profno", async (req, res, next) => {
    // 수정을 위한 파라미더 받기
    const profno = req.get("profno");
    const name = req.post("name");
    const userid = req.post("userid");
    const position = req.post("position");
    const sal = req.post("sal");
    const hiredate = req.post("hiredate");
    const comm = req.post("comm");
    const deptno = req.post("deptno");

    try {
      regexHelper.value(profno, "교수번호가 없습니다.");
      regexHelper.num(profno, "교수번호는 숫자로만 입력되어야 합니다.");
      regexHelper.value(name, "교수이름이 없습니다.");
      regexHelper.maxLength(name, 50, "교수이름이 너무 깁니다.");
      regexHelper.value(userid, "아이디가 없습니다.");
      regexHelper.maxLength(userid, 50, "아이디가 너무 깁니다.");
      regexHelper.engNum(
        userid,
        50,
        "아이디는 영어와 숫자의 조합으로만 입력되어야 합니다."
      );
      regexHelper.value(position, "직급이 없습니다.");
      regexHelper.maxLength(position, 20, "직급이 너무 깁니다.");
      regexHelper.kor(position, "직급은 한글로만 입력되어야 합니다.");
      regexHelper.value(sal, "급여가 없습니다.");
      regexHelper.num(sal, "급여는 숫자로만 입력되어야 합니다.");
      regexHelper.value(hiredate, "입사일이 없습니다.");
      regexHelper.value(deptno, "소속학과 번호가 없습니다.");
      regexHelper.num(deptno, "소속학과 번호는 숫자로만 입력되어야 합니다.");
    } catch (err) {
      return next(err);
    }

    /** 데이터 수정하기 */
    // 데이터 조회 결과가 저장될 빈 변수
    let json = null;
    try {
      // 데이터베이스 접속
      dbcon = await mysql2.createConnection(config.database);
      await dbcon.connect();
      // 데이터 수정하기
      const sql =
        "UPDATE professor SET name=?, userid=?, position=?, sal=?, hiredate=?, comm=?, deptno=? WHERE profno=?";
      const input_data = [
        name,
        userid,
        position,
        sal,
        hiredate,
        comm,
        deptno,
        profno,
      ];
      const [result1] = await dbcon.query(sql, input_data);
      // 결과 행 수가 0이라면 예외처리
      if (result1.affectedRows < 1) {
        throw new Error("수정된 데이터가 없습니다.");
      }
      // 새로 저장된 데이터의 PK값을 활용하여 다시 조회
      const sql2 =
        "SELECT profno, name, userid, position, sal, hiredate, comm, p.deptno, dname FROM professor p INNER JOIN department d ON p.deptno=d.deptno WHERE profno=?";
      const [result2] = await dbcon.query(sql2, [profno]);
      // 조회 결과를 미리 준비한 변수에 저장함
      json = result2;
    } catch (err) {
      return next(err);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.sendJson({ item: json });
  });

  /** 데이터 삭제 --> Delete(DELETE) */
  router.delete("/professor/:profno", async (req, res, next) => {
    const profno = req.get("profno");
    if (profno === null) {
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
      await dbcon.query("UPDATE student SET profno=null WHERE profno=?", [
        profno,
      ]);
      // 데이터 삭제하기
      const sql = "DELETE FROM professor WHERE profno=?";
      const [result1] = await dbcon.query(sql, [profno]);

      // 결과 행 수가 0이라면 예외처리
      if (result1.affectedRows < 1) {
        throw new Error("삭제된 데이터가 없습니다.");
      }
    } catch (err) {
      return next(err);
    } finally {
      dbcon.end();
    }
    // 모든 처리에 성공했으므로 정상 조회 결과 구성
    res.sendJson();
  });

  return router;
};
