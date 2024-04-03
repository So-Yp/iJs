/*
 * 脚本名称：葫芦娃
 * 更新时间：2024-04-01
 * 定时任务：17 9 * * *
 * 脚本说明：自动申购茅台酒，兼容 Node.js 和手机 NE 环境执行。
 自行抓包把token(一般在请求头里)填到变量中, 多账号用换行隔开（可自定义）
 环境变量 XLTH_COOKIE 偲源惠购
 环境变量 GLYP_COOKIE 贵旅优品
 环境变量 KGLG_COOKIE 空港乐购
 环境变量 HLQG_COOKIE 航旅黔购
 环境变量 ZHCS_COOKIE 遵行出山
 环境变量 GYQP_COOKIE 贵盐黔品
 环境变量 LLSC_COOKIE 乐旅商城
 环境变量 YLQX_COOKIE 驿路黔寻

-------------- Quantumult X 配置 --------------
[mitm]
hostname = gw.huiqunchina.com

[rewrite_local]
https://gw.huiqunchina.com/front-manager/api/customer/queryById/token url script-response-header https://raw.githubusercontent.com/So-Yp/iJs/main/huluwa.js

*/
if (typeof process === 'object') {
    if (process.env.DENO) {
        console.log('Deno 环境')
      // Deno 环境
    } else {
        console.log('Node.js 环境')
      //Node.js 环境 
    } 
  } else {
    console.log('浏览器或Bun环境')
    // 浏览器或Bun环境
  }

const $ = new Env('');
//const notify = $.isNode() ? require('./sendNotify') : '';
// 配置项
var xlth_UserAgent =''
var glyp_UserAgent =''
var kglg_UserAgent ='' 
var hlqg_UserAgent =''
var zhcs_UserAgent ='' 
var gyqp_UserAgent =''
var llsc_UserAgent =''
var ylqx_UserAgent ='' 
var Message = '' // 消息内容
const SPLIT = "\n"; // 分割符（可自定义）
// const axios = require('axios');
// const crypto = require('crypto');
// const moment = require('moment');
// const notify = require('./sendNotify');
const XLTH_APPID = 'wxded2e7e6d60ac09d'; // 偲源惠购
const GLYP_APPID = 'wx61549642d715f361'; // 贵旅优品
const KGLG_APPID = 'wx613ba8ea6a002aa8'; // 空港乐购
const HLQG_APPID = 'wx936aa5357931e226'; // 航旅黔购
const ZHCS_APPID = 'wx624149b74233c99a'; // 遵航出山
const GYQP_APPID = 'wx5508e31ffe9366b8'; // 贵盐黔品
const LLSC_APPID = 'wx821fb4d8604ed4d6'; // 乐旅商城
const YLQX_APPID = 'wxee0ce83ab4b26f9c'; // 驿路黔寻
const HOST = 'https://gw.huiqunchina.com';
const AK = '00670fb03584fbf44dd6b136e534f495';
const SK = '0d65f24dbe2bc1ede3c3ceeb96ef71bb';

!(async () => {
    if (isGetCookie = typeof $request !== `undefined`) {
        GetCookie();
    }else{
       await main();
    }
})()
.catch((e) => {
        $.log('', `❌ ${$.name}, 出错了，原因: ${e}!`, '');
        Message += `❌ 失败! 原因: ${e}!`
    })
    .finally(() => {
        const notify = async (msg) => $.msg($.name, '', msg)
        notify(Message)
        $.done();
    });

function GetCookie() {
    var accessToken = $request.headers['X-access-token'];
    var currentDate=new Date();
    var currentTime=currentDate.getTime();
    console.log(`当前时间${currentTime}🎉\n`);
    var times = $.getdata('timeSpan')
    console.log(`获取全局时间${times}🎉\n`);
    if (times !== null || times !== '' ) {
        if(currentTime - times  < 60000 ){
            console.log(`小于1分钟，返回🎉\n`);
            return 
        } else{
            $.setdata( JSON.stringify(currentTime), 'timeSpan')
            console.log(`重新通知，重新赋值时间\n`);
        } 
    }
    var userAgent = $request.headers['User-Agent'];
    var referer = $request.headers['Referer'];
    if(userAgent){
        var match = userAgent.match(/miniProgram\/([^ ]+)/); 
        if (match) {
        var appid = match[1];
        console.log(appid);
        } else {
            console.log(`${referer}`)
            var regex = /\/wx(.*?)\//; 
            var match = referer.match(regex); 
            if (match) {
                var appid = match[1];  
            }
        }
    }
    switch(appid) {
            case XLTH_APPID:
                setdata($request.headers,accessToken,userAgent,`xlth_cookies`,'偲源惠购')
                break
            case GLYP_APPID:
                setdata($request.headers,accessToken,userAgent,`glyp_cookies`,'贵旅优品')
                break
            case KGLG_APPID:
                setdata($request.headers,accessToken,userAgent,`kglg_cookies`,'空港乐购')
                break
            case HLQG_APPID:
                setdata($request.headers,accessToken,userAgent,`hlqg_cookies`,'航旅黔购')
                break
            case ZHCS_APPID:
                setdata($request.headers,accessToken,userAgent,`zhcs_cookies`,'遵航出山')
                break
            case GYQP_APPID:
                setdata($request.headers,accessToken,userAgent,`gyqp_cookies`,'贵盐黔品')
                break
            case LLSC_APPID:
                setdata($request.headers,accessToken,userAgent,`llsc_cookies`,'乐旅商城')
                break
            default:
                setdata($request.headers,accessToken,userAgent,`ylqx_cookies`,'驿路黔寻')
                break;
        }
        return false
}
function setdata(headers,accessToken,userAgent,cookie,name) {
    console.log(`获取到请求头${JSON.stringify({ accessToken,userAgent,})}\n`);
    var COOKIE=''
    if ($.getdata(cookie)??''!==''){
        var LLSC = JSON.parse($.getdata(cookie))
        if (JSON.stringify(LLSC) !== '{}'){
            COOKIE = LLSC.accessToken
        }
    }
    if(COOKIE !== accessToken){
        if (accessToken.startsWith('eyJhbGciOiJIUzI1NiJ9')) {
            $.setdata(
                JSON.stringify({
                    //headers: headers,
                    accessToken,
                    userAgent,
                }),
                cookie
            )
            console.log(`获取${name}数据成功🎉\n Token:${accessToken}\n User-Agent:${userAgent}🎉`);
            Message = `获取${name}数据成功🎉\n Token:${accessToken}\n User-Agent:${userAgent}🎉`
          }
    }else
    {
        console.log(`已存在相同的 ${cookie}🎉\n`);
        Message = `已获取过${name}🎉\n Token:${accessToken}\n User-Agent:${userAgent}🎉`
    }
}
function delay(time) {
    console.log("进入延迟");
    return new Promise(resolve => setTimeout(resolve, time));
}

function calculateDigest(body, sk) {
    const hmac = crypto.createHmac('sha256', sk);
    hmac.update(body);
    const signature = hmac.digest('base64');
    return signature;
}

function calculateSignature(method, url, ak, sk, date) {
    const strToSign = `${method.toUpperCase()}\n${url}\n\n${ak}\n${date}\n`;
    const hmac = crypto.createHmac('sha256', sk);
    hmac.update(strToSign);
    const signature = hmac.digest('base64');
    return signature;
}

function buildHeader(method, url, body,userAgent) {
    const date = moment().utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
    const signature = calculateSignature(method, url, AK, SK, date);
    const digest = calculateDigest(body, SK);
    const headers = {
        'Content-Type': 'application/json',
        'X-HMAC-SIGNATURE': signature,
        'X-HMAC-ACCESS-KEY': AK,
        'X-HMAC-ALGORITHM': 'hmac-sha256',
        'X-HMAC-DIGEST': digest,
        'X-HMAC-Date': date,
        //'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF XWEB/6945'
        'User-Agent': userAgent,
    };
    return headers;
}

async function getUserInfo(appId, token,userAgent) {
    const url = '/front-manager/api/customer/queryById/token';
    const method = 'post';
    const data = {appId};
    const headers = buildHeader(method, url, JSON.stringify(data),userAgent);
    headers['X-access-token'] = token;

    let resData;
    await axios(HOST + url, {method: method, data: data, headers: headers})
        .then(res => {
            resData = res.data;
        })
        .catch(err => {
            resData = err.response.data;
        });
    return resData;
}

async function getChannelActivity(id, token,userAgent) {
    const url = '/front-manager/api/customer/promotion/channelActivity';
    const method = 'post';
    const data = {id};
    const headers = buildHeader(method, url, JSON.stringify(data),userAgent);
    headers['X-access-token'] = token;

    let resData;
    await axios(HOST + url, {method: method, data: data, headers: headers})
        .then(res => {
            resData = res.data;
        })
        .catch(err => {
            resData = err.response.data;
        });
    return resData;
}

async function getChannelInfoId(appId,userAgent) {
    const url = '/front-manager/api/get/getChannelInfoId';
    const method = 'post';
    const data = {appId};
    const headers = buildHeader(method, url, JSON.stringify(data),userAgent);
    headers['X-access-token'] = token;

    let resData;
    await axios(HOST + url, {method: method, data: data, headers: headers})
        .then(res => {
            resData = res.data;
        })
        .catch(err => {
            resData = err.response.data;
        });
    return resData;
}

async function appoint(activityId, channelId, token,userAgent) {
    const url = '/front-manager/api/customer/promotion/appoint';
    const method = 'post';
    const data = {activityId, channelId};
    const headers = buildHeader(method, url, JSON.stringify(data),userAgent);
    headers['X-access-token'] = token;

    let resData;
    await axios(HOST + url, {method: method, data: data, headers: headers})
        .then(res => {
            resData = res.data;
        })
        .catch(err => {
            resData = err.response.data;
        });
    return resData;
}

async function checkCustomerInQianggou(activityId, channelId, token,userAgent) {
    const url = '/front-manager/api/customer/promotion/checkCustomerInQianggou';
    const method = 'post';
    const data = {activityId, channelId};
    const headers = buildHeader(method, url, JSON.stringify(data),userAgent);
    headers['X-access-token'] = token;

    let resData;
    await axios(HOST + url, {method: method, data: data, headers: headers})
        .then(res => {
            resData = res.data;
        })
        .catch(err => {
            resData = err.response.data;
        });
    return resData;
}

async function autoSubmit(appId, token, userAgent) {
    let channelId = '';
    let channelName = '';
    if (appId === XLTH_APPID) {
        channelId = '8';
        channelName = '偲源惠购';
    }
    if (appId === GLYP_APPID) {
        channelId = '7';
        channelName = '贵旅优品';
    }
    if (appId === KGLG_APPID) {
        channelId = '2';
        channelName = '空港乐购';
    }
    if (appId === HLQG_APPID) {
        channelId = '6';
        channelName = '航旅黔购';
    }
    if (appId === ZHCS_APPID) {
        channelId = '5';
        channelName = '遵行出山';
    }
    if (appId === GYQP_APPID) {
        channelId = '3';
        channelName = '贵盐黔品';
    }
    if (appId === LLSC_APPID) {
        channelId = '1';
        channelName = '乐旅商城';
    }
    if (appId === YLQX_APPID) {
        channelId = '9';
        channelName = '驿路黔寻';
    }

    try {
        const res1 = await getUserInfo(appId, token,userAgent);
        if (res1.code != '10000') {
            console.log(res1.message);
            Message += res1.message.toString(); 
            return;
        }
        console.log(res1);
        const realName = res1.data.realName;
        const phone = res1.data.phone;
        console.log(`当前用户[${phone}]`);
        Message +=`当前用户[${phone}]`;

        const res2 = await getChannelActivity(channelId, token,userAgent);
        if (res2.code != '10000') {
            console.log(res2.message);
            Message +=res2.message;
            return;
        }
        console.log(res2);
        const activityId = res2.data.id;
        const activityName = res2.data.name;
        console.log(`活动名称[${activityName}]`);
        Message +=`活动名称[${activityName}]`;

        const res3 = await checkCustomerInQianggou(activityId, channelId, token,userAgent);
        if (res3.code != '10000') {
            console.log(res3.message);
            Message +=res3.message;
            return;
        }
        console.log(res3);
        const data = res3.data;
        let message = '用户已经预约成功';
        if (data == false) {
            const res4 = await appoint(activityId, channelId, token,userAgent);
            this.sendMessage = res4.message;
        }
        console.log(`预约结果[${message}]`);
        Message +=`预约结果[${message}]`;
    } catch (err) {
        console.log(`运行异常[${err.message}]`);
        Message +=`运行异常[${err.message}]`;
    }
}
async function main() {
    console.log(`开始运行主函数`);
    var jsonString = $.getdata('xlth_cookies') || '{}';
    var XLTH = JSON.parse(jsonString) // 抓包参数
    if (JSON.stringify(XLTH) !== '{}'){
        const XLTH_COOKIE_ARR = XLTH.accessToken // 偲源惠购
        xlth_UserAgent = XLTH.userAgent
        if (XLTH_COOKIE_ARR) {
            console.log('偲源惠购预约开始');
            Message +='偲源惠购预约开始';
            for (let [index, item] of XLTH_COOKIE_ARR.split(SPLIT).entries()) {
                console.log(`----第${index + 1}个号----`);
                Message +=`----第${index + 1}个号----`;
                await autoSubmit(XLTH_APPID, item, xlth_UserAgent);
                await delay(1000);
            }
            console.log('偲源惠购预约结束\n');
            Message +='偲源惠购预约结束\n';
        } 
    }
    var jsonString = $.getdata('glyp_cookies') || '{}';
    var GLYP = JSON.parse(jsonString) 
    if (JSON.stringify(GLYP) !== '{}'){
        const GLYP_COOKIE_ARR = GLYP.accessToken // 贵旅优品
        glyp_UserAgent = GLYP.userAgent 
        if (GLYP_COOKIE_ARR) {
            console.log('贵旅优品预约开始');
            Message +='贵旅优品预约开始';
            for (let [index, item] of GLYP_COOKIE_ARR.split(SPLIT).entries()) {
                console.log(`----第${index + 1}个号----`);
                Message +=`----第${index + 1}个号----`;
                await autoSubmit(GLYP_APPID, item, glyp_UserAgent);
                await delay(1000);
            }
            console.log('贵旅优品预约结束\n');
            Message +='贵旅优品预约结束\n';
        }
    }
    var jsonString = $.getdata('kglg_cookies') || '{}';
    var KGLG = JSON.parse(jsonString) 
    if (JSON.stringify(KGLG) !== '{}'){
        const KGLG_COOKIE_ARR  = KGLG.accessToken // 空港乐购
        kglg_UserAgent = KGLG.userAgent 
        if (KGLG_COOKIE_ARR) {
            console.log('空港乐购预约开始');
            Message +='空港乐购预约开始' ;
            for (let [index, item] of KGLG_COOKIE_ARR.split(SPLIT).entries()) {
                console.log(`----第${index + 1}个号----`);
                Message +=`----第${index + 1}个号----`;
                await autoSubmit(KGLG_APPID, item,kglg_UserAgent);
                await delay(1000);
            }
            console.log('空港乐购预约结束\n');
            Message +='空港乐购预约结束\n';
        }
    }
    var jsonString = $.getdata('hlqg_cookies') || '{}';
    var HLQG = JSON.parse(jsonString) 
    if (JSON.stringify(HLQG) !== '{}'){
        const HLQG_COOKIE_ARR = HLQG.accessToken // 航旅黔购
        hlqg_UserAgent = HLQG.userAgent 
        if (HLQG_COOKIE_ARR) {
            console.log('航旅黔购预约开始');
            Message +='航旅黔购预约开始';
            for (let [index, item] of HLQG_COOKIE_ARR.split(SPLIT).entries()) {
                console.log(`----第${index + 1}个号----`);
                Message +=`----第${index + 1}个号----`;
                await autoSubmit(HLQG_APPID, item,hlqg_UserAgent);
                await delay(1000);
            }
            console.log('航旅黔购预约结束\n');
            Message +='航旅黔购预约结束\n';
        }
    }
    var jsonString = $.getdata('zhcs_cookies') || '{}';
    var ZHCS = JSON.parse(jsonString) 
    if (JSON.stringify(ZHCS) !== '{}'){
        const ZHCS_COOKIE_ARR = ZHCS.accessToken // 遵行出山
        var zhcs_UserAgent = ZHCS.userAgent 
        if (GYQP_COOKIE_ARR) {
            console.log('贵盐黔品预约开始');
            Message +='贵盐黔品预约开始';
            for (let [index, item] of GYQP_COOKIE_ARR.split(SPLIT).entries()) {
                console.log(`----第${index + 1}个号----`);
                Message +=`----第${index + 1}个号----`;
                await autoSubmit(GYQP_APPID, item,gyqp_UserAgent);
                await delay(1000);
            }
            console.log('贵盐黔品预约结束\n');
            Message +='贵盐黔品预约结束\n';
        }
    }
    var jsonString = $.getdata('gyqp_cookies') || '{}';
    var GYQP = JSON.parse(jsonString) 
    if (JSON.stringify(GYQP) !== '{}'){
        const GYQP_COOKIE_ARR = GYQP.accessToken // 贵盐黔品
        var gyqp_UserAgent = GYQP.userAgent 
        if (ZHCS_COOKIE_ARR) {
            console.log('遵行出山预约开始');
            Message +='遵行出山预约开始';
            for (let [index, item] of ZHCS_COOKIE_ARR.split(SPLIT).entries()) {
                console.log(`----第${index + 1}个号----`);
                Message +=`----第${index + 1}个号----`;
                await autoSubmit(ZHCS_APPID, item,zhcs_UserAgent);
                await delay(1000);
            }
            console.log('遵行出山预约结束\n');
            Message +='遵行出山预约结束\n';
        }
    }
    var jsonString = $.getdata('llsc_cookies') || '{}';
    var LLSC = JSON.parse(jsonString) 
    if (JSON.stringify(LLSC) !== '{}'){
        const LLSC_COOKIE_ARR = LLSC.accessToken // 乐旅商城
        var llsc_UserAgent = LLSC.userAgent 
        if (LLSC_COOKIE_ARR) {
            console.log('乐旅商城预约开始');
            Message +='乐旅商城预约开始';
            for (let [index, item] of LLSC_COOKIE_ARR.split(SPLIT).entries()) {
                console.log(`----第${index + 1}个号----`);
                Message +=`----第${index + 1}个号----`;
                await autoSubmit(LLSC_APPID, item,llsc_UserAgent);
                await delay(1000);
            }
            console.log('乐旅商城预约结束\n');
            Message +='乐旅商城预约结束\n';
        }
    }
    var jsonString = $.getdata('ylqx_cookies') || '{}';
    var YLQX = JSON.parse(jsonString) 
    if (JSON.stringify(YLQX) !== '{}'){
        const YLQX_COOKIE_ARR = YLQX.accessToken // 驿路黔寻
        ylqx_UserAgent = YLQX.userAgent 
        if (YLQX_COOKIE_ARR) {
            console.log('驿路黔寻预约开始');
            Message +='驿路黔寻预约开始';
            for (let [index, item] of YLQX_COOKIE_ARR.split(SPLIT).entries()) {
                console.log(`----第${index + 1}个号----`);
                Message +=`----第${index + 1}个号----`;
                await autoSubmit(YLQX_APPID, item,ylqx_UserAgent);
                await delay(1000);
            }
            console.log('驿路黔寻预约结束\n');
            Message +='驿路黔寻预约结束\n';
        }
    }
    console.log('主函数结束\n');
}

// prettier-ignore
function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            } : t;
            let s = this.get;
            return "POST" === e && (s = this.post), new Promise((e, i) => {
                s.call(this, t, (t, s, r) => {
                    t ? i(t) : e(s)
                })
            })
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [],
                this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date)
                .getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i) try {
                s = JSON.parse(this.getdata(t))
            } catch {}
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"), n = {
                    url: `http://${h}/v1/scripting/evaluate`,
                    body: {
                        script_text: t,
                        mock_type: "cron",
                        timeout: r
                    },
                    headers: {
                        "X-Key": o,
                        accept: "*/*"
                    }
                };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }
        loaddata() {
            if (!this.isNode()) return {}; {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i) return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r) return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(
                0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >>
                0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : "";
                if (r) try {
                    const t = JSON.parse(r);
                    e = t ? this.lodash_get(t, i, "") : e
                } catch (t) {
                    e = ""
                }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o ||
                    "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i)
                }
            } else s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(
                    t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] ||
                null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(
                t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !
                0) : this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough :
                require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t &&
                (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar &&
                    (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => {})) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() ||
                this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(
                    t.headers, {
                        "X-Surge-Skip-Scripting": !1
                    })), $httpClient.get(t, (t, s, i) => {
                    !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
                })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                    hints: !1
                })), $task.fetch(t).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                    try {
                        if (t.headers["set-cookie"]) {
                            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                            s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar
                        }
                    } catch (t) {
                        this.logErr(t)
                    }
                }).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                }))
        }
        post(t, e = (() => {})) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] =
                    "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this
                .isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers ||
                {}, Object.assign(t.headers, {
                    "X-Surge-Skip-Scripting": !1
                })), $httpClient.post(t, (t, s, i) => {
                !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i)
            });
            else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(
                t.opts, {
                    hints: !1
                })), $task.fetch(t).then(t => {
                const {
                    statusCode: s,
                    statusCode: i,
                    headers: r,
                    body: o
                } = t;
                e(null, {
                    status: s,
                    statusCode: i,
                    headers: r,
                    body: o
                }, o)
            }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }
        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ?
                i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t) return t;
                if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? {
                    "open-url": t
                } : this.isSurge() ? {
                    url: t
                } : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() &&
                    $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(
                    t)
            }
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() ||
                this.isLoon()) && $done(t)
        }
    }(t, e)
}
