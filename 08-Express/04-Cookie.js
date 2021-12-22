/*--------------------------------------------------------
| 1) 모듈참조
----------------------------------------------------------*/
// 직접 구현한 모듈
const logger = require('../helper/LogHelper');
const util = require('../helper/UtilHelper');
// 내장모듈
const url = require('url');
const path = require('path');
// 설치가 필요한 모듈
const express = require('express');                // Express 본체
const useragent = require('express-useragent');    // 클라이언트의 정보를 조회할 수 있는 기능
const static = require('serve-static');            // 특정 폴더의 파일을 URL로 노출시킴
const favicon = require('serve-favicon');          // favicon 처리
const bodyParser = require('body-parser');         // POST 파라미터 처리
const methodOverride = require('method-override'); // PUT 파라미터 처리
const cookieParder = require('cookie-parser');     // Cookie 처리