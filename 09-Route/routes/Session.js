module.exports = (app) => {
  const router = require("express").Router();

  // 1) router.route("url경로").get|post|put|delete((req,res)) => {});
  // 2) router.get|post|put|delete("url경로", (req,res) => {});
  router
    .route("/session")
    .post((req, res, next) => {
      const username = req.body.username;
      const nickname = req.body.nickname;

      req.session.username = username;
      req.session.nickname = nickname;

      const json = { rt: "ok" };
      res.status(200).send(json);
    })
    .get((req, res, next) => {
      // 세션 데이터들은 req.session 객체의 하위 데이터로 저장된다.
      for (key in req.session) {
        const str = "[세션에 저장되어 있는 값]" + key + "=" + req.session[key];
        logger.debug(str, "node");
      }

      const my_data = {
        username: req.body.username,
        nickname: req.body.nickname,
      };

      res.status(200).send(my_data);
    })
    .delete((req, res, next) => {
      req.session.destroy((err) => {
        // 세션 삭제에 실패한 경우
        if (err) {
          logger.error("세션 삭제에 실패했습니다.");
          logger.error(error);
          return false;
        }
      });

      const json = { rt: "ok" };
      res.status(200).send(json);
    });
  /** LOGIN */
  router
    .route("/session.login")
    .post((req, res, next) => {
      const id = req.body.id;
      const pw = req.body.pw;

      logger.debug("id=" + id);
      logger.debug("pw=" + pw);

      let login_ok = false;
      if (id == "node" && pw == "1234") {
        logger.debug("로그인 성공");
        login_ok = true;
      }

      let result_code = null;
      let result_msg = null;

      if (login_ok) {
        req.session.id = id;
        req.session.pw = pw;
        result_code = 200;
        result_msg = "ok";
      } else {
        result_code = 403;
        result_msg = "fail";
      }

      const json = { rt: result_msg };
      res.status(result_code).send(json);
    })
    .delete((req, res, next) => {
      logger.debug("로그아웃");
      req.session.destroy((err) => {
        // 세션 삭제에 실패한 경우
        if (err) {
          logger.error("세션 삭제에 실패했습니다.");
          logger.error(error);
          return false;
        }
      });

      const json = { rt: "ok" };
      res.status(200).send(json);
    })
    .get((req, res, next) => {
      const id = req.body.id;
      const pw = req.body.pw;

      let result_code = null;
      let result_msg = null;

      if (id !== undefined && pw !== undefined) {
        logger.debug("현재 로그인중이 맞습니다.");
        result_code = 200;
        result_msg = "ok";
      } else {
        logger.debug("현재 로그인중이 아닙니다.");
        result_code = 400;
        result_msg = "fail";
      }

      const json = { rt: result_msg };
      res.status(result_code).send(json);
    });
  return router;
};
