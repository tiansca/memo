/**
 * Created by administrator on 2019/10/31.
 */
// 封装邮件发送接口
const nodemailer = require('nodemailer');

// 开启一个SMTP连接
let transporter = nodemailer.createTransport({
    host: 'smtp.163.com',
    service: '163', // 需要到qq邮箱设置开通SMTP, 查看支持的邮件服务商列表 https://nodemailer.com/smtp/well-known/
    port: 465, // SMTP 端口
    secureConnection: false, // 使用了SSL
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'tian_shicong@163.com',
        pass: 'OPNFISKUBWDYOANP' // 这里密码不是qq密码，是你设置的smtp授权码
    }
})

// 填写邮件信息
let mailOptions = {
    from: '聪<tian_shicong@163.com>', // 发件人
    to: '1264197264@qq.com', // 收件人
    subject: '', // 标题
    // 发送text或者html格式
    text: '', // plain text body 文本格式的内容
    html: '' // html body HTML格式的内容
};

// 使用前面创建的传输器来发送邮件
let send =function (opt,  flag) {
    if (opt && opt.to && opt.subject && opt.content) {
        mailOptions.to = opt.to;
        mailOptions.subject = opt.subject;
        if (flag === 'html') {
            mailOptions.html = opt.content;
        }else
        {   // 默认不传flag发送text
            mailOptions.text = opt.content;
        }
        console.log(mailOptions)
        transporter.sendMail(mailOptions, (error, info) => {
            if(error){
                console.log(error);
                // isSend = false;
            }else {
                // isSend = true;
                console.log('发送成功')
            }
            mailOptions.text = '';
            mailOptions.html = '';
            //console.log(`Message: ${info.messageId}`);
            //console.log(`sent: ${info.response}`);
        });
    }
};

// 将send方法通过exports暴露出来, 便于其他模块调用
module.exports = send;
