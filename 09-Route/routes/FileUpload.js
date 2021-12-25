module.exports = (app) => {
  const logger = require("../../helper/LogHelper");
  const fileHelper = require("../../helper/FileHelper");
  const config = require("../../helper/_config");
  const router = require("express").Router();
  const path = require("path");
  const multer = require("multer");
  const thumbnail = require("node-thumbnail").thumb;

  /** multer 객체 속성 */
  const multipart = multer({
    storage: multer.diskStorage({
      /** 업로드 된 파일이 저장될 디렉토리 설정 */
      destination: (req, file, callback) => {
        // 폴더 생성
        fileHelper.mkdirs(config.upload.dir);
        fileHelper.mkdirs(config.upload.dir);

        console.debug(file);

        // 업로드 정보에 백엔드의 업로드 파일 저장 폴더 위치를 추가한다.
        file.dir = config.upload.dir.replace(/\\/gi, "/");

        //  multer 객체에게 업로드 경로를 전달
        callback(null, config.upload.dir);
      },
      /** 업로드 된 파일이 저장될 파일명 설정 */
      // file.originalname 변수에 파일이름이 저장되어 있다. -> ex) helloworld.png
      filename: (req, file, callback) => {
        // 파일의 확장자만 추출 --> .png
        const extName = path.extname(file.originalname);
        // 파일이 저장될 이름 (현재 시각)
        const saveName =
          new Date().getTime().toString() + extName.toLowerCase();
        // 업로드 정보에 백엔드의 파일 이름을 추가한다.
        file.savename = saveName;
        file.path = path.join(file.dir, saveName);
        // 업로드 정보 파일에 접근할 수 있는 URL값 추가
        file.url = path.join(config.upload.path, saveName).replace(/\\/gi, "/");
        // 구성된 정보를 req 객체에게 추가
        if (req.file instanceof Array) {
          req.file.push(file);
        } else {
          req.file = file;
        }
        callback(null, saveName);
      },
    }),
    /** 요량, 최대 업로드 파일 수 제한 설정 */
    limits: {
      files: config.upload.max_count,
      fileSize: config.upload.max_size,
    },
    /** 업로드 될 파일의 확장자 제한 */
    fileFilter: (req, file, callback) => {
      // 파일의 종류 얻기
      var mimetype = file.mimetype;

      // 파일 종류 문자열에 "image/"가 포함되어 있지 않은 경우
      if (mimetype.indexOf("image/") == -1) {
        const err = new Error();
        err.result_code = 500;
        err.result_msg = "이미지 파일만 업로드 가능합니다.";
        return callback(err);
      }
      callback(null, true);
    },
  });

  // 1) router.route("url경로").get|post|put|delete((req,res)) => {});
  // 2) router.get|post|put|delete("url경로", (req,res) => {});
  router.route("/upload/simple").post((req, res, next) => {
    // name 속성값이 myphto인 경우, 업로드를 수행
    const upload = multipart.single("myphoto");

    upload(req, res, async (err) => {
      let result_code = 200;
      let result_msg = "ok";

      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case "LIMIT_FILE_COUNT":
              err.result_code = 500;
              err.result_msg = "업로드 가능한 파일 수를 초과했습니다.";
              break;
            case "LIMIT_FILE_SIZE":
              err.result_code = 500;
              err.result_msg = "업로드 가능한 파일 용량을 초과했습니다.";
              break;
            default:
              err.result_code = 500;
              err.result_msg = "알 수 없는 에러가 발생했습니다.";
              break;
          }
        }
        logger.error(err);
        result_code = err.result_code;
        result_msg = err.result_msg;
      }

      /** 업로드 결과에 이상이 없다면 썸네일 이미지 생성 */
      const thumb_size_list = [480, 750, 1080];

      // 원하는 썸네일 사이즈만큼 반복처리
      for (let i = 0; i < thumb_size_list.length; i++) {
        const v = thumb_size_list[i];

        // 생성될 썸네일 파일의 옵션과 파일이름을 생성
        const thumb_options = {
          source: req.file.path, // 썸네일을 생성할 원본 경로
          destination: thumb_path, // 썸네일이 생성될 경로
          width: v, // 썸네일의 크기(기본값 800)
          prefix: "thumb_",
          suffix: "_" + v + "w",
          override: true,
        };

        // 생성될 썸네일 파일의 이름을 예상
        const basename = req.file.savename;
        const filename = basename.substring(0, basename.lastIndexOf("."));
        const thumbname =
          thumb_options.prefix +
          filename +
          thumb_options.suffix +
          path.extname(basename);

        // 썸네일 정보를 width를 key로 갖는 json 형태로 후가하기 위해 key 이름 생성
        const key = v + "w";

        // 프론트엔드에게 전송될 정보에 'thumbnail'이라는 프로퍼티가 없다면 빈 json 형태로 생성
        if (!req.file.hasOwnProperty("thumbnail")) {
          req.file.thumbnail = {};
        }

        req.file.thumbnail[key] = "/thumb/" + thumbname;

        try {
          await thumbnail(thumb_options);
        } catch (error) {
          console.log(error);
        }
      }

      const result = {
        rt: result_code,
        rtmsg: result_msg,
        item: req.file,
      };

      res.status(result_code).send(result);
    });
  });

  router.route("/upload/multiple").post((req, res, next) => {
    // 요청정보 안에 업로드 된 정보를 저장할 빈 배열을 준비
    req.file = [];

    // name 속성값이 myphto이고 multiple 속성이 부여된 다중 업로드를 처리
    const upload = multipart.array("myphoto");

    upload(req, res, (err) => {
      let result_code = 200;
      let result_msg = "ok";

      if (err) {
        if (err instanceof multer.MulterError) {
          switch (err.code) {
            case "LIMIT_FIELD_COUNT":
              err.result_code = 500;
              err.result_msg = "업로드 가능한 파일 수를 초과했습니다.";
              break;
            case "LIMIT_FIELD_SIZE":
              err.result_code = 500;
              err.result_msg = "업로드 가능한 파일 용량을 초과했습니다.";
              break;
            default:
              err.result_code = 500;
              err.result_msg = "알 수 없는 에러가 발생했습니다.";
              break;
          }
        }
        logger.error(err);
        result_code = err.result_code;
        result_msg = err.result_msg;
      }

      /** 업로드 결과에 이상이 없다면 썸네일 이미지 생성 */
      const thumb_size_list = [640, 750, 1020];

      // 원하는 썸네일 사이즈만큼 반복처리
      req.file.map((v, i) => {
        // 원하는 썸네일 사이즈만큼 반복처리
        thumb_size_list.map(async (w, j) => {
          // 생성될 썸네일 파일의 옵션과 파일이름을 생성
          const thumb_options = {
            source: v.path, // 썸네일을 생성할 원본 경로
            destination: thumb_path, // 썸네일이 생성될 경로
            width: w, // 썸네일의 크기(기본값 800)
            prefix: "thumb_",
            suffix: "_" + w + "w",
            override: true,
          };

          // 생성될 썸네일 파일의 이름을 예상
          const basename = v.savename;
          const filename = basename.substring(0, basename.lastIndexOf("."));
          const thumbname =
            thumb_options.prefix +
            filename +
            thumb_options.suffix +
            path.extname(basename);

          // 썸네일 정보를 width를 key로 갖는 json 형태로 후가하기 위해 key 이름 생성
          const key = w + "w";

          // 프론트엔드에게 전송될 정보에 'thumbnail'이라는 프로퍼티가 없다면 빈 json 형태로 생성
          if (!v.hasOwnProperty("thumbnail")) {
            v.thumbnail = {};
          }

          v.thumbnail[key] = "/thumb/" + thumbname;

          try {
            await thumbnail(thumb_options);
          } catch (error) {
            console.log(error);
          }
        });
      });
      const result = {
        rt: result_code,
        rtmsg: result_msg,
        item: req.file,
      };

      res.status(result_code).send(result);
    });
  });

  return router;
};
