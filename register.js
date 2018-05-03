const express = require('express');
const bodyParser = require('body-parser');

// 引用一个 node 上消息推送的模块
const webpush = require('web-push');

const app = express();

// 设置 VAPID
webpush.setVapidDetails(
    'mailto:contact@deanhume.com',
    'BAyb_WgaR0L0pODaR7wWkxJi__tWbM1MPBymyRDFEGjtDCWeRYS9EF7yGoCHLdHJi6hikYdg4MuYaK0XoD0qnoY',
    'p6YVD7t8HkABoez1CvVJ5bl7BnEdKUu5bSyVjyxMBh0'
);

app.post('/register', (req, res) => {
    console.log('req')
    console.log(req)
    let endpoint = req.body.endpoint;
    // saveRegistrationDetails(endpoint, key, authSecret); 保存到服务器
    /*
      真实情况可以是从服务器批量获取 pushSubscription 订阅信息，然后推送，
      下边这个对象时模拟获取的订阅信息
   */

    const pushSubscription = {
        endpoint: req.body.endpoint,
        keys: {
            auth: req.body.authSecret,
            p256dh: req.body.key
        }
    };
    const body = 'tttt for registering';
    const iconUrl = 'http://localhost:8080/a.png';
    // 消息推送
    webpush
        .sendNotification(
            pushSubscription,
            JSON.stringify({
                msg: body,
                url: 'http://localhost:8080/',
                icon: iconUrl
            })
        )
        .then(result => res.sendStatus(201))
        .catch(err => console.log(err));
});