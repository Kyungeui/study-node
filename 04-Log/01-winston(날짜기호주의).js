/* ---------------------------------------------------------
 * 01-winston.js
 * - window 패키지를 사용하여 로그 출력 살펴보기
 * $ npm install --save winston 
 * $ npm install --save winston-daily-rotate-file
 * --------------------------------------------------------- */

/** 1) 패키지 참조 */
const fileHelper = require('../helper/FileHelper.js'); // 로그 처리 모듈
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const path = require('path');

/** 2) 환경설정 정보 */
const config = {
    /** 로그 파일이 저장될 경로 및 출력 레벨 */
    log: {
        // 개발자가 필요에 의해 기록하는 정보들을 저장할 파일
        debug: {
            path: path.join(__dirname, '../_files/_logs'),
            level: 'degbug',
        },
        // 시스템에 심각한 문제가 발생했을 때의 정보르 저장할 타입
        error: {
            path: path.join(__dirname, '../_files/_logs'),
            level: 'error',
        },
    },
};

/** 3) 로그가 저장될 폴더 생성 */
fileHelper.mkdirs(config.log.debug.path);
fileHelper.mkdirs(config.log.error.path);

// 로그가 출력될 형식 지정
const { combine, timestamp, printf, splat, simple } = winston.format;

/** 4) winston 객체 만들기 */
const logger = winston.createLogger({
    // 로그의 전반적인 형식 
    format: combine(
        timestamp({
            // 날짜 출력형식은 https://day.js.org/docs/en/display/format 참고
            // format: 'YYYY-MM-DD HH:mm:ss',
            format: 'YYYY-MM-DD HH:mm:ss SSS',
        }),
        printf((info) => {
            return `${info,timestamp} [${info.level}]: ${info.message}`;
        }),
        splat()
    ),
    // 일반 로그 규칙 정의
    transports: [
        // 하루에 하나씩 파일 형태로 기록하기 위한 설정
        new winstonDaily({
            name: 'debug-file',
            level: config.log.debug.level,   // 출력할 로그의 수준.
            datePattern: 'YYMMDD',           // 파일 이름에 표시될 날짜형식
            dirname: config.log.debug.path,  // 파일이 저장될 위치
            filename: 'log_%DATE%.log',      // 파일이름 형식. %DATE%는 datePattern의 값
            maxSize: 50000000,                     //
            maxFiles: 50,
            zippedArchive: true              //
        }),

        // 하루에 하나씩 파일 형태로 기록하기 위한 설정
        new winstonDaily({
            name: 'error-file',
            level: config.log.debug.level,   // 출력할 로그의 수준.
            datePattern: 'YYMMDD',           // 파일 이름에 표시될 날짜형식
            dirname: config.log.debug.path,  // 파일이 저장될 위치
            filename: 'error_%DATE%.log',      // 파일이름 형식. %DATE%는 datePattern의 값
            maxSize: 50000000,                     //
            maxFiles: 50,
            zippedArchive: true              //
        })
    ]
});

/** 5) 콘솔 설정 */
// 프로모션 버전(=상용화 버전)이 아니라면?
if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            prettyPrint: true,
            showLevel: true,
            level: config.log.debug.level,
            format: combine(
                winston.format.colorize(),
                prinf((info) => {
                    return `${info,timestamp} [${info.level}]: ${info.message}`;
                })
            ),
        })
    );
}

logger.error('error 메세지 입니다. (1수준)');
logger.warn('warn 메세지 입니다. (2수준)');
logger.info('info 메세지 입니다. (3수준)');
logger.verbose('verbose 메세지 입니다. (4수준)');
logger.debug('debug 메세지 입니다. (5수준)');
