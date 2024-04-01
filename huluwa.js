/**
 葫芦娃预约 v2.0
 cron: 30 8 * * *
 自行抓包把token(一般在请求头里)填到变量中, 多账号用换行隔开（可自定义）

 环境变量 XLTH_COOKIE 偲源惠购
 环境变量 GLYP_COOKIE 贵旅优品
 环境变量 KGLG_COOKIE 空港乐购
 环境变量 HLQG_COOKIE 航旅黔购
 环境变量 ZHCS_COOKIE 遵行出山
 环境变量 GYQP_COOKIE 贵盐黔品
 环境变量 LLSC_COOKIE 乐旅商城
 环境变量 YLQX_COOKIE 驿路黔寻
###详细见同目录README
```Quantumult X
[mitm]
hostname = gw.huiqunchina.com

[rewrite_local]
https://gw.huiqunchina.com/front-manager/api/customer/queryById/token url script-response-header https://raw.githubusercontent.com/huluwa.js

 */

const $ = new Env('');
const notify = $.isNode() ? require('./sendNotify') : '';
const SPLIT = "\n"; // 分割符（可自定义）
console.log('require未注入');
//const axios = require('axios');
//const crypto = require('crypto');
//const moment = require('moment');
console.log('require已注入');

var xlth_UserAgent =''
var glyp_UserAgent =''
var kglg_UserAgent ='' 
var hlqg_UserAgent =''
var zhcs_UserAgent ='' 
var gyqp_UserAgent =''
var llsc_UserAgent =''
var ylqx_UserAgent ='' 
var Message = '' // 消息内容


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
let sendMessage = [];

//主程序执行入口
!(async () => {
    try {
        if (typeof $request != "undefined") {
            await getCookie();
        } else {
            await main();
        }
    } catch (e) {
        throw e;
    }
})()
    .catch((e) => { $.logErr(e), $.msg($.name, `⛔️ script run error!`, e.message || e) })
    .finally(async () => {
        $.done({ ok: 1 });
    });

 function getCookie(){
    var accessToken = $request.headers['X-access-token'];
    var currentDate=new Date();
    var currentTime=currentDate.getTime();
    var times = $.getdata('timeSpan')
    if (times !== null || times !== '' ) {
        if(currentTime - times  < 60000 ){
            console.log(`小于1分钟，返回🎉\n`);
            return 
        } else{
            $.setdata( JSON.stringify(currentTime), 'timeSpan')
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
                    accessToken,
                    userAgent,
                }),
                cookie
            )
            Message = `获取${name}数据成功🎉\n Token:${accessToken}\n User-Agent:${userAgent}🎉`
          }
    }else
    {
        Message = `已获取过${name}🎉\n Token:${accessToken}🎉`
    }
}

function delay(time) {
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
        return
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
            sendMessage.push(res1.message);
            return;
        }
        const realName = res1.data.realName;
        const phone = res1.data.phone;
        console.log(`当前用户[${phone}]`);
        sendMessage.push(`当前用户[${phone}]`);

        const res2 = await getChannelActivity(channelId, token,userAgent);
        if (res2.code != '10000') {
            console.log(res2.message);
            //sendMessage.push(res2.message);
            Message = res2.message
            const notify = async (msg) => $.msg($.name, '', msg)
            notify(Message)
            return;
        }
        const activityId = res2.data.id;
        const activityName = res2.data.name;
        console.log(`活动名称[${activityName}]`);
        sendMessage.push(`活动名称[${activityName}]`);

        const res3 = await checkCustomerInQianggou(activityId, channelId, token,userAgent);
        if (res3.code != '10000') {
            console.log(res3.message);
            //sendMessage.push(res3.message);
            Message = res3.message
            const notify = async (msg) => $.msg($.name, '', msg)
            notify(Message)
            return;
        }
        const data = res3.data;

        let message = '用户已经预约成功';
        if (data == false) {
            const res4 = await appoint(activityId, channelId, token,userAgent);
            this.sendMessage = res4.message;
        }
        console.log(`预约结果[${message}]`);
        //sendMessage.push(`预约结果[${message}]`);
        Message = res4.message
        const notify = async (msg) => $.msg($.name, '', msg)
        notify(Message)
    } catch (err) {
        console.log(`运行异常[${err.message}]`);
        //sendMessage.push(`运行异常[${err.message}]`);
        Message = err
        const notify = async (msg) => $.msg($.name, '', msg)
        notify(Message)
    }
}

async function main() {
    try {
        console.log('偲源惠购预约开始');
        //配置项
        var XLTH = JSON.parse($.getdata('xlth_cookies') || '{}') // 抓包参数
        if (JSON.stringify(XLTH) !== '{}'){
            const XLTH_COOKIE_ARR = XLTH.accessToken // 偲源惠购
            xlth_UserAgent = XLTH.userAgent 
            if (XLTH_COOKIE_ARR && xlth_UserAgent) {
                console.log('偲源惠购预约开始');
                sendMessage.push('偲源惠购预约开始');
                for (let [index, item] of XLTH_COOKIE_ARR.split(SPLIT).entries()) {
                    console.log(`----第${index + 1}个号----`);
                    sendMessage.push(`----第${index + 1}个号----`);
                    await autoSubmit(XLTH_APPID, item, xlth_UserAgent);
                    await delay(1000);
                }
                console.log('偲源惠购预约结束\n');
                sendMessage.push('偲源惠购预约结束\n');
            }
        }
        var GLYP = JSON.parse($.getdata('glyp_cookies') || '{}') 
        if (JSON.stringify(GLYP) !== '{}'){
            const GLYP_COOKIE_ARR = GLYP.accessToken // 贵旅优品
            glyp_UserAgent = GLYP.userAgent 
            if (GLYP_COOKIE_ARR && glyp_UserAgent) {
                console.log('贵旅优品预约开始');
                sendMessage.push('贵旅优品预约开始');
                for (let [index, item] of GLYP_COOKIE_ARR.split(SPLIT).entries()) {
                    console.log(`----第${index + 1}个号----`);
                    sendMessage.push(`----第${index + 1}个号----`);
                    await autoSubmit(GLYP_APPID, item, glyp_UserAgent);
                    await delay(1000);
                }
                console.log('贵旅优品预约结束\n');
                sendMessage.push('贵旅优品预约结束\n');
            }
        }
        var KGLG = JSON.parse($.getdata('kglg_cookies') || '{}')
        if (typeof KGLG !== 'undefined' && KGLG !== null){
            const KGLG_COOKIE_ARR  = KGLG.accessToken // 空港乐购
            kglg_UserAgent = KGLG.userAgent 
            if (KGLG_COOKIE_ARR && kglg_UserAgent) {
                console.log('空港乐购预约开始');
                sendMessage.push('偲源惠购预约开始');
                for (let [index, item] of KGLG_COOKIE_ARR.split(SPLIT).entries()) {
                    console.log(`----第${index + 1}个号----`);
                    sendMessage.push(`----第${index + 1}个号----`);
                    await autoSubmit(KGLG_APPID, item,kglg_UserAgent);
                    await delay(1000);
                }
                console.log('空港乐购预约结束\n');
                sendMessage.push('空港乐购预约结束\n');
            }
        }
        var HLQG = JSON.parse($.getdata('hlqg_cookies') || '{}') 
        if (JSON.stringify(HLQG) !== '{}'){
            const HLQG_COOKIE_ARR = HLQG.accessToken // 航旅黔购
            hlqg_UserAgent = HLQG.userAgent 
            if (HLQG_COOKIE_ARR && hlqg_UserAgent) {
                console.log('航旅黔购预约开始');
                sendMessage.push('偲源惠购预约开始');
                for (let [index, item] of HLQG_COOKIE_ARR.split(SPLIT).entries()) {
                    console.log(`----第${index + 1}个号----`);
                    sendMessage.push(`----第${index + 1}个号----`);
                    await autoSubmit(HLQG_APPID, item,hlqg_UserAgent);
                    await delay(1000);
                }
                console.log('航旅黔购预约结束\n');
                sendMessage.push('航旅黔购预约结束\n');
            }
        }
        var ZHCS = JSON.parse($.getdata('zhcs_cookies') || '{}') 
        if (JSON.stringify(ZHCS) !== '{}'){
            const ZHCS_COOKIE_ARR = ZHCS.accessToken // 遵行出山
            zhcs_UserAgent = ZHCS.userAgent 
            if (ZHCS_COOKIE_ARR && zhcs_UserAgent) {
                console.log('遵行出山预约开始');
                Message = `遵行出山预约开始`
                const notify = async (msg) => $.msg($.name, '', msg)
                notify(Message)
                //sendMessage.push('偲源惠购预约开始');
                for (let [index, item] of ZHCS_COOKIE_ARR.split(SPLIT).entries()) {
                    console.log(`----第${index + 1}个号----`);
                    sendMessage.push(`----第${index + 1}个号----`);
                    await autoSubmit(ZHCS_APPID, item,zhcs_UserAgent);
                    await delay(1000);
                }
                console.log('遵行出山预约结束\n');
                sendMessage.push('遵行出山预约结束\n');
            }
        }
        var GYQP = JSON.parse($.getdata('gyqp_cookies') || '{}') 
        if (JSON.stringify(GYQP) !== '{}'){
            const GYQP_COOKIE_ARR = GYQP.accessToken // 贵盐黔品
            gyqp_UserAgent = GYQP.userAgent
            if (GYQP_COOKIE_ARR && gyqp_UserAgent) {
                console.log('贵盐黔品预约开始');
                sendMessage.push('贵盐黔品预约开始');
                for (let [index, item] of GYQP_COOKIE_ARR.split(SPLIT).entries()) {
                    console.log(`----第${index + 1}个号----`);
                    sendMessage.push(`----第${index + 1}个号----`);
                    await autoSubmit(GYQP_APPID, item,gyqp_UserAgent);
                    await delay(1000);
                }
                console.log('贵盐黔品预约结束\n');
                sendMessage.push('贵盐黔品预约结束\n');
            } 
        }
        var LLSC = JSON.parse($.getdata('llsc_cookies') || '{}') 
        if (JSON.stringify(LLSC) !== '{}'){
            const LLSC_COOKIE_ARR = LLSC.accessToken // 乐旅商城
            llsc_UserAgent = LLSC.userAgent 
            if (LLSC_COOKIE_ARR && llsc_UserAgent) {
                console.log('乐旅商城预约开始');
                sendMessage.push('乐旅商城预约开始');
                for (let [index, item] of LLSC_COOKIE_ARR.split(SPLIT).entries()) {
                    console.log(`----第${index + 1}个号----`);
                    sendMessage.push(`----第${index + 1}个号----`);
                    await autoSubmit(LLSC_APPID, item,llsc_UserAgent);
                    await delay(1000);
                }
                console.log('乐旅商城预约结束\n');
                sendMessage.push('乐旅商城预约结束\n');
            }
        }
        var YLQX = JSON.parse($.getdata('ylqx_cookies') || '{}') 
        if (JSON.stringify(YLQX) !== '{}'){
            const YLQX_COOKIE_ARR = YLQX.accessToken // 驿路黔寻
            ylqx_UserAgent = YLQX.userAgent 
            if (YLQX_COOKIE_ARR && ylqx_UserAgent) {
                console.log('驿路黔寻预约开始');
                sendMessage.push('驿路黔寻预约开始');
                for (let [index, item] of YLQX_COOKIE_ARR.split(SPLIT).entries()) {
                    console.log(`----第${index + 1}个号----`);
                    sendMessage.push(`----第${index + 1}个号----`);
                    await autoSubmit(YLQX_APPID, item,ylqx_UserAgent);
                    await delay(1000);
                }
                console.log('驿路黔寻预约结束\n');
                sendMessage.push('驿路黔寻预约结束\n');
            }
        }
        // await notify.sendNotify(`葫芦娃预约`, sendMessage.join('\n'), {}, '\n\n本通知');
    } catch (error) {
        $.log('', `❌ ${$.name}, 出错了，原因: ${error}!`, '');
    }
}
/** ---------------------------------固定不动区域----------------------------------------- */
//prettier-ignore
async function sendMsg(a) { a && ($.isNode() ? await notify.sendNotify($.name, a) : $.msg($.name, $.title || "", a, { "media-url": $.avatar })) }
function DoubleLog(o) { o && ($.log(`${o}`), $.notifyMsg.push(`${o}`)) };
function debug(g, e = "debug") { "true" === $.is_debug && ($.log(`\n-----------${e}------------\n`), $.log("string" == typeof g ? g : $.toStr(g) || `debug error => t=${g}`), $.log(`\n-----------${e}------------\n`)) }
//From xream's ObjectKeys2LowerCase
function ObjectKeys2LowerCase(obj) { return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])) };
//From sliverkiss's Request
async function Request(t) { "string" == typeof t && (t = { url: t }); try { if (!t?.url) throw new Error("[发送请求] 缺少 url 参数"); let { url: o, type: e, headers: r = {}, body: s, params: a, dataType: n = "form", resultType: u = "data" } = t; const p = e ? e?.toLowerCase() : "body" in t ? "post" : "get", c = o.concat("post" === p ? "?" + $.queryStr(a) : ""), i = t.timeout ? $.isSurge() ? t.timeout / 1e3 : t.timeout : 1e4; "json" === n && (r["Content-Type"] = "application/json;charset=UTF-8"); const y = s && "form" == n ? $.queryStr(s) : $.toStr(s), l = { ...t, ...t?.opts ? t.opts : {}, url: c, headers: r, ..."post" === p && { body: y }, ..."get" === p && a && { params: a }, timeout: i }, m = $.http[p.toLowerCase()](l).then((t => "data" == u ? $.toObj(t.body) || t.body : $.toObj(t) || t)).catch((t => $.log(`❌请求发起失败！原因为：${t}`))); return Promise.race([new Promise(((t, o) => setTimeout((() => o("当前请求已超时")), i))), m]) } catch (t) { console.log(`❌请求发起失败！原因为：${t}`) } }
//From chavyleung's Env.js
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise(((e, r) => { s.call(this, t, ((t, s, a) => { t ? r(t) : e(s) })) })) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; if (this.getdata(t)) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise((e => { this.get({ url: t }, ((t, s, r) => e(r))) })) } runScript(t, e) { return new Promise((s => { let r = this.getdata("@chavy_boxjs_userCfgs.httpapi"); r = r ? r.replace(/\n/g, "").trim() : r; let a = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); a = a ? 1 * a : 20, a = e && e.timeout ? e.timeout : a; const [i, o] = r.split("@"), n = { url: `http://${o}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: a }, headers: { "X-Key": i, Accept: "*/*" }, timeout: a }; this.post(n, ((t, e, r) => s(r))) })).catch((t => this.logErr(t))) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), r = !s && this.fs.existsSync(e); if (!s && !r) return {}; { const r = s ? t : e; try { return JSON.parse(this.fs.readFileSync(r)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), r = !s && this.fs.existsSync(e), a = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, a) : r ? this.fs.writeFileSync(e, a) : this.fs.writeFileSync(t, a) } } lodash_get(t, e, s = void 0) { const r = e.replace(/\[(\d+)\]/g, ".$1").split("."); let a = t; for (const t of r) if (a = Object(a)[t], void 0 === a) return s; return a } lodash_set(t, e, s) { return Object(t) !== t || (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce(((t, s, r) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[r + 1]) >> 0 == +e[r + 1] ? [] : {}), t)[e[e.length - 1]] = s), t } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, r] = /^@(.*?)\.(.*?)$/.exec(t), a = s ? this.getval(s) : ""; if (a) try { const t = JSON.parse(a); e = t ? this.lodash_get(t, r, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, r, a] = /^@(.*?)\.(.*?)$/.exec(e), i = this.getval(r), o = r ? "null" === i ? null : i || "{}" : "{}"; try { const e = JSON.parse(o); this.lodash_set(e, a, t), s = this.setval(JSON.stringify(e), r) } catch (e) { const i = {}; this.lodash_set(i, a, t), s = this.setval(JSON.stringify(i), r) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return this.data = this.loaddata(), this.data[t]; default: return this.data && this.data[t] || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0; default: return this.data && this.data[e] || null } } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), void 0 === t.followRedirect || t.followRedirect || ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = !1), this.isQuanX() && (t.opts ? t.opts.redirection = !1 : t.opts = { redirection: !1 })), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, ((t, s, r) => { !t && s && (s.body = r, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, r) })); break; case "Quantumult X": this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then((t => { const { statusCode: s, statusCode: r, headers: a, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: r, headers: a, body: i, bodyBytes: o }, i, o) }), (t => e(t && t.error || "UndefinedError"))); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", ((t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } })).then((t => { const { statusCode: r, statusCode: a, headers: i, rawBody: o } = t, n = s.decode(o, this.encoding); e(null, { status: r, statusCode: a, headers: i, rawBody: o, body: n }, n) }), (t => { const { message: r, response: a } = t; e(r, a, a && s.decode(a.rawBody, this.encoding)) })) } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), void 0 === t.followRedirect || t.followRedirect || ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = !1), this.isQuanX() && (t.opts ? t.opts.redirection = !1 : t.opts = { redirection: !1 })), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, ((t, s, r) => { !t && s && (s.body = r, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, r) })); break; case "Quantumult X": t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then((t => { const { statusCode: s, statusCode: r, headers: a, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: r, headers: a, body: i, bodyBytes: o }, i, o) }), (t => e(t && t.error || "UndefinedError"))); break; case "Node.js": let r = require("iconv-lite"); this.initGotEnv(t); const { url: a, ...i } = t; this.got[s](a, i).then((t => { const { statusCode: s, statusCode: a, headers: i, rawBody: o } = t, n = r.decode(o, this.encoding); e(null, { status: s, statusCode: a, headers: i, rawBody: o, body: n }, n) }), (t => { const { message: s, response: a } = t; e(s, a, a && r.decode(a.rawBody, this.encoding)) })) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let r = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in r) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? r[e] : ("00" + r[e]).substr(("" + r[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let r = t[s]; null != r && "" !== r && ("object" == typeof r && (r = JSON.stringify(r)), e += `${s}=${r}&`) } return e = e.substring(0, e.length - 1), e } msg(e = t, s = "", r = "", a) { const i = t => { switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: return { url: t.url || t.openUrl || t["open-url"] }; case "Loon": return { openUrl: t.openUrl || t.url || t["open-url"], mediaUrl: t.mediaUrl || t["media-url"] }; case "Quantumult X": return { "open-url": t["open-url"] || t.url || t.openUrl, "media-url": t["media-url"] || t.mediaUrl, "update-pasteboard": t["update-pasteboard"] || t.updatePasteboard }; case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, r, i(a)); break; case "Quantumult X": $notify(e, s, r, i(a)); case "Node.js": }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), r && t.push(r), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name}, 错误!`, t); break; case "Node.js": this.log("", `❗️${this.name}, 错误!`, t.stack) } } wait(t) { return new Promise((e => setTimeout(e, t))) } done(t = {}) { const e = ((new Date).getTime() - this.startTime) / 1e3; switch (this.log("", `🔔${this.name}, 结束! 🕛 ${e} 秒`), this.log(), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } }(t, e) }
