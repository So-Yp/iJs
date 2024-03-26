/**
 葫芦娃预约 v1.06

 cron: 30 8 * * *
 const $ = new Env("葫芦娃预约");

 自行抓包把token(一般在请求头里)填到变量中, 多账号用换行隔开（可自定义）

 环境变量 XLTH_COOKIE 新联惠购
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
https://gw.huiqunchina.com/front-manager/api/customer/queryById/token url script-response-body https://raw.githubusercontent.com/So-Yp/iJs/main/huluwa.js

 */
// const $ = new Env('葫芦娃');
// const notify = $.isNode() ? require('./sendNotify') : '';
// 配置项
var isClearShopDir = $.getdata('imaotai__config__clearshopdir') || false // 是否清理店铺字典
var province = $.getdata('imaotai__config__province') || '' // 省份
var city = $.getdata('imaotai__config__city') || '' // 城市
var itemCode = $.getdata('imaotai__config__itemcode') || '10213' // 预约项
var location = $.getdata('imaotai__config__location') || '' // 地址经纬度
var address = $.getdata('imaotai__config__address') || '' // 详细地址
var shopid = $.getdata('imaotai__config__shopid') || '' // 商铺id
var imaotaiParams = JSON.parse($.getdata('imaotai_params') || '{}') // 抓包参数
var Message = '' // 消息内容
// -----------------------------------------------------------------------------------------

const SPLIT = "\n"; // 分割符（可自定义）

const axios = require('axios');
const crypto = require('crypto');
const moment = require('moment');
// const notify = require('./sendNotify');

const XLTH_APPID = 'wxded2e7e6d60ac09d'; // 新联惠购
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

function buildHeader(method, url, body) {
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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36 MicroMessenger/7.0.20.1781(0x6700143B) NetType/WIFI MiniProgramEnv/Windows WindowsWechat/WMPF XWEB/6945'
    };
    return headers;
}

async function getUserInfo(appId, token) {
    const url = '/front-manager/api/customer/queryById/token';
    const method = 'post';
    const data = {appId};
    const headers = buildHeader(method, url, JSON.stringify(data));
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

async function getChannelActivity(id, token) {
    const url = '/front-manager/api/customer/promotion/channelActivity';
    const method = 'post';
    const data = {id};
    const headers = buildHeader(method, url, JSON.stringify(data));
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

async function getChannelInfoId(appId) {
    const url = '/front-manager/api/get/getChannelInfoId';
    const method = 'post';
    const data = {appId};
    const headers = buildHeader(method, url, JSON.stringify(data));
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

async function appoint(activityId, channelId, token) {
    const url = '/front-manager/api/customer/promotion/appoint';
    const method = 'post';
    const data = {activityId, channelId};
    const headers = buildHeader(method, url, JSON.stringify(data));
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

async function checkCustomerInQianggou(activityId, channelId, token) {
    const url = '/front-manager/api/customer/promotion/checkCustomerInQianggou';
    const method = 'post';
    const data = {activityId, channelId};
    const headers = buildHeader(method, url, JSON.stringify(data));
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

async function autoSubmit(appId, token) {
    let channelId = '';
    let channelName = '';
    if (appId === XLTH_APPID) {
        channelId = '8';
        channelName = '新联惠购';
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
        const res1 = await getUserInfo(appId, token);
        if (res1.code != '10000') {
            console.log(res1.message);
            sendMessage.push(res1.message);
            return;
        }
        const realName = res1.data.realName;
        const phone = res1.data.phone;
        console.log(`当前用户[${phone}]`);
        sendMessage.push(`当前用户[${phone}]`);

        const res2 = await getChannelActivity(channelId, token);
        if (res2.code != '10000') {
            console.log(res2.message);
            sendMessage.push(res2.message);
            return;
        }
        const activityId = res2.data.id;
        const activityName = res2.data.name;
        console.log(`活动名称[${activityName}]`);
        sendMessage.push(`活动名称[${activityName}]`);

        const res3 = await checkCustomerInQianggou(activityId, channelId, token);
        if (res3.code != '10000') {
            console.log(res3.message);
            sendMessage.push(res3.message);
            return;
        }
        const data = res3.data;

        let message = '用户已经预约成功';
        if (data == false) {
            const res4 = await appoint(activityId, channelId, token);
            this.sendMessage = res4.message;
        }
        console.log(`预约结果[${message}]`);
        sendMessage.push(`预约结果[${message}]`);
    } catch (err) {
        console.log(`运行异常[${err.message}]`);
        sendMessage.push(`运行异常[${err.message}]`);
    }
}

async function main() {
    if (JSON.stringify(imaotaiParams) === '{}') throw `请先开启代理工具对必要参数进行抓包`
    if (!imaotaiParams.userId || !imaotaiParams.headers['MT-Token']) throw '请先开启代理工具进行抓包相关操作!'
    if (!province) throw '请在BoxJs中配置省份'
    if (!city) throw '请在BoxJs中配置城市'
    if (!itemCode) throw '请在BoxJs中配置预约项'
    if (!address) throw '请在BoxJs中配置详细地址'
    const XLTH_COOKIE_ARR = process.env.XLTH_COOKIE; // 新联惠购
    const GLYP_COOKIE_ARR = process.env.GLYP_COOKIE; // 贵旅优品
    const KGLG_COOKIE_ARR = process.env.KGLG_COOKIE; // 空港乐购
    const HLQG_COOKIE_ARR = process.env.HLQG_COOKIE; // 航旅黔购
    const ZHCS_COOKIE_ARR = process.env.ZHCS_COOKIE; // 遵行出山
    const GYQP_COOKIE_ARR = process.env.GYQP_COOKIE; // 贵盐黔品
    const LLSC_COOKIE_ARR = process.env.LLSC_COOKIE; // 乐旅商城
    const YLQX_COOKIE_ARR = process.env.YLQX_COOKIE; // 驿路黔寻

    if (XLTH_COOKIE_ARR) {
        console.log('新联惠购预约开始');
        sendMessage.push('新联惠购预约开始');
        for (let [index, item] of XLTH_COOKIE_ARR.split(SPLIT).entries()) {
            console.log(`----第${index + 1}个号----`);
            sendMessage.push(`----第${index + 1}个号----`);
            await autoSubmit(XLTH_APPID, item);
            await delay(1000);
        }
        console.log('新联惠购预约结束\n');
        sendMessage.push('新联惠购预约结束\n');
    }

    if (GLYP_COOKIE_ARR) {
        console.log('贵旅优品预约开始');
        sendMessage.push('贵旅优品预约开始');
        for (let [index, item] of GLYP_COOKIE_ARR.split(SPLIT).entries()) {
            console.log(`----第${index + 1}个号----`);
            sendMessage.push(`----第${index + 1}个号----`);
            await autoSubmit(GLYP_APPID, item);
            await delay(1000);
        }
        console.log('贵旅优品预约结束\n');
        sendMessage.push('贵旅优品预约结束\n');
    }

    if (KGLG_COOKIE_ARR) {
        console.log('空港乐购预约开始');
        sendMessage.push('新联惠购预约开始');
        for (let [index, item] of KGLG_COOKIE_ARR.split(SPLIT).entries()) {
            console.log(`----第${index + 1}个号----`);
            sendMessage.push(`----第${index + 1}个号----`);
            await autoSubmit(KGLG_APPID, item);
            await delay(1000);
        }
        console.log('空港乐购预约结束\n');
        sendMessage.push('空港乐购预约结束\n');
    }

    if (HLQG_COOKIE_ARR) {
        console.log('航旅黔购预约开始');
        sendMessage.push('新联惠购预约开始');
        for (let [index, item] of HLQG_COOKIE_ARR.split(SPLIT).entries()) {
            console.log(`----第${index + 1}个号----`);
            sendMessage.push(`----第${index + 1}个号----`);
            await autoSubmit(HLQG_APPID, item);
            await delay(1000);
        }
        console.log('航旅黔购预约结束\n');
        sendMessage.push('航旅黔购预约结束\n');
    }

    if (ZHCS_COOKIE_ARR) {
        console.log('遵行出山预约开始');
        sendMessage.push('新联惠购预约开始');
        for (let [index, item] of ZHCS_COOKIE_ARR.split(SPLIT).entries()) {
            console.log(`----第${index + 1}个号----`);
            sendMessage.push(`----第${index + 1}个号----`);
            await autoSubmit(ZHCS_APPID, item);
            await delay(1000);
        }
        console.log('遵行出山预约结束\n');
        sendMessage.push('遵行出山预约结束\n');
    }

    if (GYQP_COOKIE_ARR) {
        console.log('贵盐黔品预约开始');
        sendMessage.push('贵盐黔品预约开始');
        for (let [index, item] of GYQP_COOKIE_ARR.split(SPLIT).entries()) {
            console.log(`----第${index + 1}个号----`);
            sendMessage.push(`----第${index + 1}个号----`);
            await autoSubmit(GYQP_APPID, item);
            await delay(1000);
        }
        console.log('贵盐黔品预约结束\n');
        sendMessage.push('贵盐黔品预约结束\n');
    }

    if (LLSC_COOKIE_ARR) {
        console.log('乐旅商城预约开始');
        sendMessage.push('乐旅商城预约开始');
        for (let [index, item] of LLSC_COOKIE_ARR.split(SPLIT).entries()) {
            console.log(`----第${index + 1}个号----`);
            sendMessage.push(`----第${index + 1}个号----`);
            await autoSubmit(LLSC_APPID, item);
            await delay(1000);
        }
        console.log('乐旅商城预约结束\n');
        sendMessage.push('乐旅商城预约结束\n');
    }

    if (YLQX_COOKIE_ARR) {
        console.log('驿路黔寻预约开始');
        sendMessage.push('驿路黔寻预约开始');
        for (let [index, item] of YLQX_COOKIE_ARR.split(SPLIT).entries()) {
            console.log(`----第${index + 1}个号----`);
            sendMessage.push(`----第${index + 1}个号----`);
            await autoSubmit(YLQX_APPID, item);
            await delay(1000);
        }
        console.log('驿路黔寻预约结束\n');
        sendMessage.push('驿路黔寻预约结束\n');
    }

    //await notify.sendNotify(`葫芦娃预约`, sendMessage.join('\n'), {}, '\n\n本通知 By：一泽');
}
!(async () => {
    if (isGetCookie = typeof $request !== `undefined`) {
        // 抓包
    if ($request && typeof $request === 'object') {
        if ($request.method === 'OPTIONS') return false
        console.log(JSON.stringify($request.headers))
        var accessToken = $request.headers['X-access-token'];
        var userId = JSON.parse($response.body).data.userId
        $.setdata(
            JSON.stringify({
                headers: $request.headers,
                accessToken
            }),
            'huluwa_params'
        )
        console.log(`抓取数据成功🎉\n Token:${accessToken}`);
        Message = `抓取数据成功🎉\n Token:${accessToken}`
        return false
        }
        $.done();
    }
    main();
})()
.catch((e) => {
        $.log('', `❌ ${$.name}, 出错了，原因: ${e}!`, '');
    })
    .finally(() => {
        $.done();
    });




