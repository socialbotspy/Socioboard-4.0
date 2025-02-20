
const moment = require('moment');
const schedule = require('node-schedule');
const MailServiceMongoModel = require('../mongoose/models/mailservices');

// constructor function
function SendEmailServices() {

    let moduleId = '';
    Object.defineProperty(this, 'moduleId', {
        set: function (module) {
            if (typeof module === 'number') {
                moduleId = module;
            }
        },
        get: function () {
            return moduleId;
        }
    });

    let teamId = '';
    Object.defineProperty(this, 'teamId', {
        set: function (team) {
            if (typeof team === 'number') {
                teamId = team;
            }
        },
        get: function () {
            return teamId;
        }
    });


    let batchId = '';
    Object.defineProperty(this, 'batchId', {
        set: function (batch) {
            if (typeof batch === 'string') {
                batchId = batch;
            }
        },
        get: function () {
            return batchId;
        }
    });


    let users = '';
    Object.defineProperty(this, 'users', {
        set: function (userInfo) {
            if (typeof userInfo === 'object') {
                users = userInfo;
            }
        },
        get: function () {
            return users;
        }
    });


    let scheduleId = '';
    Object.defineProperty(this, 'scheduleId', {
        set: function (schedule) {
            if (typeof schedule === 'object') {
                scheduleId = schedule;
            }
        },
        get: function () {
            return scheduleId;
        }
    });


    let newsLetterContent = '';
    Object.defineProperty(this, 'newsLetterContent', {
        set: function (newsLetterMessage) {
            if (typeof newsLetterMessage === 'string') {
                newsLetterContent = newsLetterMessage;
            }
        },
        get: function () {
            return newsLetterContent;
        }
    });


    let mailServiceConfiguration = '';
    Object.defineProperty(this, 'mailServiceConfiguration', {
        set: function (mailServiceConfig) {
            mailServiceConfiguration = mailServiceConfig;
        },
        get: function () {
            return mailServiceConfiguration;
        }
    });


    this.template = {

        // Replace - [FirstName] [AccountType] [ActivationLink]
        registration: '<body style="background-color: #FB6947;"> <div style="margin-top: 50px; margin: 0 auto; width: 630px;"> <div style="width: 630px; height: auto; float: left; margin-top: 125px;"> <div style="width: 630px; padding-top: 17px; text-align: center; height: 80px; background: none repeat scroll 0px 0px rgb(255, 188, 173); border-top-left-radius: 5px; border-top-right-radius: 5px;"> <img style="max-height:110px" src="https://i.imgur.com/qAdpCjL.png" alt="" /> </div> <!--Email content--> <div style="font-family: Tahoma; font-size: 14px; background-color: #fff; color: rgb(24, 24, 24); padding: 10px; float: left; width: 606px; border: 2px solid rgb(255, 255, 255); border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;"> <div style="width: 610px; float: left; height: 35px;"> </div> <div style="width: 610px; height: auto; float: left;"> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Hi [FirstName], </div> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Congratulations! We have received your request for [AccountType] plan. </div> </br> </br> <!--</br>--> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> <!-- Your login details are:--> Please click the link below to activate your account. </div> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> <!-- Click <a href="%replink%"> here</a> to login. </div></br></br>--> Click <a href="[ActivationLink]"> here</a> </div> </br></br> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Hope you have a great time at Socioboard. Keep socioboarding... :)</div> </br> <!--<div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> </div>--> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Warm regards,</div> </br> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Socioboard Team</div> </div> <div style="width: 610px; float: left; height: 35px;"> </div> </div> <!--End Email content--> </div> </div> </body>',

        // Replace - [Payername] [payer_email] [item_name] [subscr_date] [paymentId] [amount] [payment_status] [media]
        invoice: '<!DOCTYPE HTML> <html style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;font-family: sans-serif;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;font-size: 10px;-webkit-tap-highlight-color: rgba(0,0,0,0);"> <head style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"> <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"> <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"></script> <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"></script> </head> <style style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"> .form-horizontal .textalign { text-align: left !important; } .textalign .form-group { border-bottom: 1px solid #efeded; margin-left: 0px; margin-right: 0px; } </style> <body style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0;font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;font-size: 14px;line-height: 1.42857143;color: #333;background-color: #fff;"> <div class="container" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding-right: 15px;padding-left: 15px;margin-right: auto;margin-left: auto;"> <div style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"> <div class="modal-dialog" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;width: auto;margin: 10px;"> <div class="modal-content" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;background-color: #fff;-webkit-background-clip: padding-box;background-clip: padding-box;border: 1px solid rgba(0,0,0,.2);border-radius: 6px;outline: 0;-webkit-box-shadow: 0 5px 15px rgba(0,0,0,.5);box-shadow: 0 5px 15px rgba(0,0,0,.5);"> <div class="modal-header" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding: 15px;border-bottom: 1px solid #e5e5e5;"> <h4 class="modal-title" style="text-align: center;font-size: 20px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;font-family: inherit;font-weight: 500;line-height: 1.42857143;color: inherit;margin-top: 10px;margin-bottom: 10px;margin: 0;">Socioboard Paymnet Invoice</h4> </div> <div class="modal-body col-md-offset-3" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-left: 25%;position: relative;padding: 15px;"> <div class="container" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding-right: 15px;padding-left: 15px;margin-right: auto;margin-left: auto;"> <div class="row" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-right: -15px;margin-left: -15px;"> <div class="col-xs-12 col-sm-12 col-md-4 col-md-offset-1" style="padding-bottom: 20px;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;float: left;width: 33.33333333%;margin-left: 8.33333333%;"> <img src="https://i.imgur.com/qAdpCjL.png" alt="" class="img-rounded img-responsive col-offset-md-1 col-offset-sm-1" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;border: 0;vertical-align: middle;page-break-inside: avoid;display: block;max-width: 100%!important;height: auto;border-radius: 6px;"> </div> </div> <div class="row" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-right: -15px;margin-left: -15px;"> <div class="col-xs-12 col-sm-6 col-md-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;float: left;width: 50%;"> ' +
            '<div class="well well-sm" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;min-height: 20px;padding: 9px;margin-bottom: 20px;background-color: #f5f5f5;border: 1px solid #e3e3e3;border-radius: 3px;-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);box-shadow: inset 0 1px 1px rgba(0,0,0,.05);"> <div class="row" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-right: -15px;margin-left: -15px;"> <div class="col-sm-6 col-md-8 col-md-offset-2" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 66.66666667%;margin-left: 16.66666667%;"> <form class="form-horizontal textalign" role="form" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"> <fieldset style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding: 0;margin: 0;border: 0;min-width: 0;"> <div class="form-group " style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;margin-right: 0px;margin-left: 0px;border-bottom: 1px solid #efeded;"> <label class="col-sm-6 control-label textalign" for="textinput" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;text-align: left !important;">Name</label> <div class="col-sm-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;"> <label type="text" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;">[Payername]</label> </div> </div> <div class="form-group " style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;margin-right: 0px;margin-left: 0px;border-bottom: 1px solid #efeded;"> <label class="col-sm-6 control-label textalign" for="textinput" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;text-align: left !important;">Email</label> <div class="col-sm-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;"> <label type="text" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;">[payer_email]</label> </div> </div> <div class="form-group" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;margin-right: 0px;margin-left: 0px;border-bottom: 1px solid #efeded;"> <label class="col-sm-6 control-label textalign" for="textinput" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;text-align: left !important;">Package</label> <div class="col-sm-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;"> <label type="text" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;">[item_name] Socioboard</label> </div> </div> <div class="form-group" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;margin-right: 0px;margin-left: 0px;border-bottom: 1px solid #efeded;"> <label class="col-sm-6 control-label textalign" for="textinput" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;text-align: left !important;">Created Date</label> <div class="col-sm-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;"> <label type="text" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;">[subscr_date]</label> </div> </div> </fieldset> </form> </div> </div> <hr style="-webkit-box-sizing: content-box;-moz-box-sizing: content-box;box-sizing: content-box;height: 0;margin-top: 20px;margin-bottom: 20px;border: 0;border-top: 1px solid #eee;"> <div class="row" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-right: -15px;margin-left: -15px;"> <div class="col-sm-12 col-md-8 col-md-offset-2" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 66.66666667%;margin-left: 16.66666667%;">' +
            '<form class="form-horizontal textalign" role="form" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"> <fieldset style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding: 0;margin: 0;border: 0;min-width: 0;"> <div class="form-group" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;margin-right: 0px;margin-left: 0px;border-bottom: 1px solid #efeded;"> <label class="col-sm-6 control-label textalign" for="textinput" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;text-align: left !important;">Transaction ID</label> <div class="col-sm-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;"> <label type="text" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;">[paymentId]</label> </div> </div> <div class="form-group" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;margin-right: 0px;margin-left: 0px;border-bottom: 1px solid #efeded;"> <label class="col-sm-6 control-label textalign" for="textinput" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;text-align: left !important;">Transaction Amount</label> <div class="col-sm-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;"> <label type="text" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;">[amount]</label> </div> </div> <div class="form-group" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;margin-right: 0px;margin-left: 0px;border-bottom: 1px solid #efeded;"> <label class="col-sm-6 control-label textalign" for="textinput" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;text-align: left !important;">Transaction Status</label> <div class="col-sm-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;"> <label type="text" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;">[payment_status]</label> </div> </div> <div class="form-group" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin-bottom: 15px;margin-right: 0px;margin-left: 0px;border-bottom: 1px solid #efeded;"> <label class="col-sm-6 control-label textalign" for="textinput" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;text-align: left !important;">Media Device</label> <div class="col-sm-6" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;position: relative;min-height: 1px;padding-right: 15px;padding-left: 15px;width: 50%;"> <label type="text" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;display: inline-block;max-width: 100%;margin-bottom: 5px;font-weight: 700;">[media]</label> </div> </div> </fieldset> </form> </div> </div> </div> </div> </div> </div> <div class="modal-footer" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;padding: 15px;text-align: right;border-top: 1px solid #e5e5e5;"> </div> </div> </div> </div> </div> </div> </body> </html>',

        // Replace - [FirstName] [ActivationLink]
        forgotpassword: '<body style="background-color: #FB6947;"> <div style="margin-top: 50px; margin: 0 auto; width: 630px;"> <div style="width: 630px; height: auto; float: left; margin-top: 125px;"> <div style="width: 630px; padding-top: 17px; text-align: center; height: 80px; background: none repeat scroll 0px 0px rgb(255, 188, 173); border-top-left-radius: 5px; border-top-right-radius: 5px;"> <img style="max-height:110px" src="https://i.imgur.com/qAdpCjL.png" alt="" /> </div> <!--Email content--> <div style="font-family: Tahoma; font-size: 14px; background-color: #fff; color: rgb(24, 24, 24); padding: 10px; float: left; width: 606px; border: 2px solid rgb(255, 255, 255); border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;"> <div style="width: 610px; float: left; height: 35px;"> </div> <div style="width: 610px; height: auto; float: left;"> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Hi [FirstName], </div> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> You have requested for reset password </div> </br> </br> <!--</br>--> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> <!-- Your login details are:--> Please click the link below to change your password. </div> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> <!-- Click <a href="%replink%"> here</a> to login. </div></br></br>--> Click <a href="[ActivationLink]"> here</a> </div> </br></br> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Hope you have a great time at Socioboard. Keep socioboarding... :)</div> </br> <!--<div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> </div>--> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Warm regards,</div> </br> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Socioboard Team</div> </div> <div style="width: 610px; float: left; height: 35px;"> </div> </div> <!--End Email content--> </div> </div> </body>',

        // Replace -[Email] [AccountType]
        beforeExpireNotification: '<!DOCTYPE html PUBLIC><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="format-detection" content="telephone=no" /><title>Notification of Account Expiry - SocioBoard</title><link rel="stylesheet" href="email.css" /><style>body {font-family: "Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif;}</style></head><body bgcolor="#E1E1E1" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"><center style="background-color:#E1E1E1;"><table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;"><tr><td align="center" valign="top" id="bodyCell"><table bgcolor="#FFFFFF"  border="0" cellpadding="0" cellspacing="0" width="700" id="emailBody"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fff"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer"><tr><td align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="30" cellspacing="0" width="100%"><tr><td align="center" valign="top" class="textContent"><center><img src="http://imgur.com/nvNPyAp.png" /></center></td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffaa7b"><tr style="padding-top:0;"><td align="center" valign="top"><table border="0" cellpadding="30" cellspacing="0" width="700" class="flexibleContainer"><tr><td style="padding-top:0;" align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="0" cellspacing="0" width="90%" style="margin-top:10%;"><tr><td align="left"><p>Hi [FirstName]</p></td></tr><tr><td align="left"><p style="margin-top: 7%;">Your account will expire on [ExpireDate].</p></td></tr><tr><td align="left"><p style="margin-top: 5%;">You can continue using socioboard by upgrading your account or downgrading to basic version in a very short span of time.</p></td></tr><tr><td align="left"><p style="margin-top: 5%;">You can look into more exciting options</p></td></tr><tr><td align="left"><p style="margin-top: 5%;">Login to socioboard <a href="https://www.socioboard.com/Home#/profilesettings" target="_blank" style="text-decoration:none;color:#828282;"><span style="color:#828282;">click here</span></a>.</p></td></tr><tr><td align="left"><p style="margin-top: 5%;">Please feel free to contact us in case you have any questions</p></td></tr><tr><td align="left"><p style="margin-top: 10%; margin-bottom:5%;">Best regards<br/>Support Team<br/>Socioboard</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailFooter"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer"><tr><td align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="30" cellspacing="0" width="100%"><tr><td valign="top" bgcolor="#E1E1E1"><div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;"><div>Copyright &copy; 2019 <a href="#" target="_blank" style="text-decoration:none;color:#828282;"><span style="color:#828282;">Socioboard</span></a>. All&nbsp;rights&nbsp;reserved.</div><div></div></div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></center></body></html>',

        // Replace -[Email] [AccountType] [message]
        messagenotification: '<body style="background-color: #FB6947;"> <div style="margin-top: 50px; margin: 0 auto; width: 630px;"> <div style="width: 630px; height: auto; float: left; margin-top: 125px;"> <div style="width: 630px; padding-top: 17px; text-align: center; height: 80px; background: none repeat scroll 0px 0px rgb(255, 188, 173); border-top-left-radius: 5px; border-top-right-radius: 5px;"> <img style="max-height:110px" src="https://i.imgur.com/qAdpCjL.png" alt="" /> </div> <!--Email content--> <div style="font-family: Tahoma; font-size: 14px; background-color: #fff; color: rgb(24, 24, 24); padding: 10px; float: left; width: 606px; border: 2px solid rgb(255, 255, 255); border-bottom-left-radius: 5px; border-bottom-right-radius: 5px;"> <div style="width: 610px; float: left; height: 35px;"> </div> <div style="width: 610px; height: auto; float: left;"> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Hi [FirstName], </div> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;">Notification [message] <i class="em em-disappointed_relieved"></i></div> </div><div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Email:  [Email]  </div> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> AccountType:  [AccountType]  </div> </br> </br> <!--</br>--> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Please Upgrade the plan. </div> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Hope you have a great time at Socioboard. Keep socioboarding... :)</div> </br> <!--<div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> </div>--> <div style="width: 610px; height: auto; float: left; font-size: 15px; font-family: Arial; margin-top: 10px;"> Warm regards,</div> </br> <div style="width: 680px; height: auto; float: left; font-size: 22px; font-family: Arial; margin-top: 10px;"> Socioboard Team</div> </div> <div style="width: 610px; float: left; height: 30px;"> </div> </div> </div> </div> </body>',

        // Replace -[Email] [AccountType] 
        expirednotification: '<!DOCTYPE html PUBLIC><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="format-detection" content="telephone=no" /><title>Notification of Account Expiry - SocioBoard</title><link rel="stylesheet" href="email.css" /><style>body {font-family: "Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif;}</style></head><body bgcolor="#E1E1E1" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"><center style="background-color:#E1E1E1;"><table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;"><tr><td align="center" valign="top" id="bodyCell"><table bgcolor="#FFFFFF"  border="0" cellpadding="0" cellspacing="0" width="700" id="emailBody"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fff"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer"><tr><td align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="30" cellspacing="0" width="100%"><tr><td align="center" valign="top" class="textContent"><center><img src="http://imgur.com/nvNPyAp.png" /></center></td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffaa7b"><tr style="padding-top:0;"><td align="center" valign="top"><table border="0" cellpadding="30" cellspacing="0" width="700" class="flexibleContainer"><tr><td style="padding-top:0;" align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="0" cellspacing="0" width="90%" style="margin-top:10%;"><tr><td align="left"><p>Hi [FirstName],</p></td></tr><tr><td align="left"><p style="margin-top: 7%;">Your socioboard account has been expired .</p></td></tr><tr><td align="left"><p style="margin-top: 5%;">You can continue using socioboard by upgrading your account or downgrading to basic version in a very short span of time.</p></td></tr><tr><td align="left"><p style="margin-top: 5%;">You can look into more exciting options</p></td></tr><tr><td align="left"><p style="margin-top: 5%;">Login to socioboard <a href="https://www.socioboard.com/Home#/profilesettings" target="_blank" style="text-decoration:none;color:#828282;"><span style="color:#828282;">click here</span></a>.</p></td></tr><tr><td align="left"><p style="margin-top: 5%;">Please feel free to contact us in case you have any questions</p></td></tr><tr><td align="left"><p style="margin-top: 10%; margin-bottom:5%;">Best regards<br/>Support Team<br/>Socioboard</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailFooter"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer"><tr><td align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="30" cellspacing="0" width="100%"><tr><td valign="top" bgcolor="#E1E1E1"><div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;"><div>Copyright &copy; 2019 <a href="#" target="_blank" style="text-decoration:none;color:#828282;"><span style="color:#828282;">Socioboard</span></a>. All&nbsp;rights&nbsp;reserved.</div><div></div></div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></center></body></html>',

        //  Replace -[Email] [AccountType]  
        loginReminderNotification: '<!DOCTYPE html PUBLIC><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><meta name="format-detection" content="telephone=no" /><title>Account Expiry - SocioBoard</title><link rel="stylesheet" href="email.css" /><style>body {font-family: "Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif;}</style></head><body bgcolor="#E1E1E1" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0"><center style="background-color:#E1E1E1;"><table border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable" style="table-layout: fixed;max-width:100% !important;width: 100% !important;min-width: 100% !important;"><tr><td align="center" valign="top" id="bodyCell"><table bgcolor="#FFFFFF"  border="0" cellpadding="0" cellspacing="0" width="700" id="emailBody"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#fff"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer"><tr><td align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="30" cellspacing="0" width="100%"><tr><td align="center" valign="top" class="textContent"><center><img src="http://imgur.com/nvNPyAp.png" /></center></td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffaa7b"><tr style="padding-top:0;"><td align="center" valign="top"><table border="0" cellpadding="30" cellspacing="0" width="700" class="flexibleContainer"><tr><td style="padding-top:0;" align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="0" cellspacing="0" width="90%" style="margin-top:10%;"><tr><td align="left"><p>Hi [FirstName],</p></td></tr><tr><td align="left"><p style="margin-top: 7%;">You have not logged in to your SocioBoard account since [LastLogin].We miss you. </p></td></tr><tr><td align="left"><p style="margin-top: 2%;"> Please login to SocioBoard account by <a href="https://www.socioboard.com/#" target="_blank" style="text-decoration:none;color:#828282;"><span style="color:#2979ff;">clicking here</span></a><tr><td align="left"><p style="margin-top: 5%;">Please feel free to contact us in case you have any questions</p></td></tr><tr><td align="left"><p style="margin-top: 10%; margin-bottom:5%;">Best regards<br/>Support Team<br/>SocioBoard</p></td></tr></table></td></tr></table></td></tr></table></td></tr></table><table bgcolor="#E1E1E1" border="0" cellpadding="0" cellspacing="0" width="500" id="emailFooter"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><td align="center" valign="top"><table border="0" cellpadding="0" cellspacing="0" width="500" class="flexibleContainer"><tr><td align="center" valign="top" width="500" class="flexibleContainerCell"><table border="0" cellpadding="30" cellspacing="0" width="100%"><tr><td valign="top" bgcolor="#E1E1E1"><div style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#828282;text-align:center;line-height:120%;"><div>Copyright &copy; 2019 <a href="#" target="_blank" style="text-decoration:none;color:#828282;"><span style="color:#828282;">Socioboard</span></a>. All&nbsp;rights&nbsp;reserved.</div><div>If you do not want to recieve emails from us, you can <a href="https://www.socioboard.com/Home#/profilesettings" target="_blank" style="text-decoration:none;color:#828282;"><span style="color:#828282;">unsubscribe</span></a>.</div></div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr></table></center></body></html>',

    };
}

SendEmailServices.prototype.mailServiceSchedule = function () {

    return new Promise((resolve, reject) => {

        var scheduleDate = moment().add(2, 'seconds');

        var scheduleObject = {
            moduleId: this.moduleId,
            batchId: this.batchId,
            users: this.users,
            scheduleId: !this.scheduleId ? -1 : this.scheduleId,
            teamId: !this.teamId ? -1 : this.teamId,
            newsletterContent: !this.newsletterContent ? '' : this.newsletterContent,
            mailServiceConfiguration: this.mailServiceConfiguration
        };

        console.log("scheduleObject", scheduleObject);

        var time = new Date(scheduleDate);

        schedule.scheduleJob(this.batchId, time, function (scheduleObject) {

            console.log("Mail service query has been started with batch Id %s of module Id %s", scheduleObject.batchId, scheduleObject.moduleId);

            var emailContent = "";
            var emailTitle = "";

            switch (scheduleObject.moduleId) {
                case 1:
                    emailContent = this.template.beforeExpireNotification;
                    emailTitle = "Socioboard Account is going to Expire (Test)";
                    break;
                case 2:
                    emailContent = this.template.expirednotification;
                    emailTitle = "Socioboard Account Expired Notification (Test)";
                    break;
                case 3:
                    emailContent = this.template.loginReminderNotification;
                    emailTitle = "Socioboard Account is inactive for more than 3 days (Test)";
                    break;
                case 4:
                    emailContent = this.template.messagenotification;
                    emailTitle = "SocioBoard Offer! (Test)";
                    break;
                default:
                    break;
            }

            return sendNotificationMails(scheduleObject, emailTitle, emailContent, scheduleObject.newsletterContent, scheduleObject.mailServiceConfiguration)
                .then(() => console.log("Process completed"))
                .catch((error) => { console.log("Process Failed"); });

        }.bind(null, scheduleObject));

        resolve(true);
    });

};

SendEmailServices.prototype.sendMails = function (defaultService, Details) {
    return new Promise((resolve, reject) => {
        const MailServices = require('./mailServices');
        const mailServices = new MailServices(this.mailServiceConfiguration);
        switch (defaultService) {
            case 'gmail':
                mailServices.sendEmailByGmail(Details, function (error, info) {
                    if (error)
                        reject(error);
                    else
                        resolve(info);
                });
                break;
            case 'sendgrid':
                mailServices.sendEmailBySendGrid(Details, function (error, info) {
                    if (error)
                        reject(error);
                    else
                        resolve(info);
                });
                break;
            default:
                break;
        }
    });
};

function sendNotificationMails(scheduleObject, emailTitle, emailContent, newsletterContent, mailServiceConfiguration) {

    const MailServices = require('./mailServices');
    const mailServices = new MailServices(mailServiceConfiguration);

    return new Promise((resolve, reject) => {
        return Promise.all(scheduleObject.users.map(user => {
            var htmlContent = emailContent
                .replace('[AccountType]', user.Activations.user_plan)
                .replace('[Email]', user.email)
                .replace('[message]', newsletterContent)
                .replace('[FirstName]', user.first_name)
                .replace('[ExpireDate]', user.account_expire_date)
                .replace('[LastLogin]', user.last_login);

            var emailDetails = {
                "subject": emailTitle,
                "toMail": user.email,
                "htmlContent": htmlContent
            };



            mailServices.sendEmailByGmail(emailDetails, function (error, info) {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log(info);
                }
            });
        }))
            .then(() => {
                var mailDetails = [];
                scheduleObject.users.map(function (user) {
                    var object = {
                        userEmail: user.email,
                        notification_type: scheduleObject.moduleId,
                        plan_type: user.Activations.user_plan,
                        expire_date: user.Activations.account_expire_date,
                        last_login: user.Activations.last_login,
                        other_newsletter_title: user.message,
                        sent_date: moment(),
                        batchId: scheduleObject.batchId,
                        schedule_id: scheduleObject.scheduleId,
                        team_id: scheduleObject.teamId,
                    };
                    mailDetails.push(object);
                });
                return MailServiceMongoModel.insertMany(mailDetails);
            })
            .then(() => {
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

module.exports = SendEmailServices;