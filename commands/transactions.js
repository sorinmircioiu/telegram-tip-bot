var user = require('./../models').user,
  transaction = require('./../models').transaction,
  config = require('./../config'),
  numeral = require('numeral'),
  _ = require('underscore');

var Command = function(bot) {
  return function(msg, match) {
    try {
      var resp = '';

      console.log(msg.text);

      if (msg.chat.type !== 'private') {
        resp = 'Private command. Please DM the bot: @webdollar_tip_bot to use the command.';

        bot.sendMessage(msg.chat.id, resp, {
          //parse_mode: 'Markdown',
          disable_web_page_preview: true,
          disable_notification: true,
        });

        return;
      }

      if (!msg.from.username) {
        resp = 'Please set an username for your telegram account to use the bot.';

        bot.sendMessage(msg.chat.id, resp, {
          //parse_mode: 'Markdown',
          disable_web_page_preview: true,
          disable_notification: true,
        });

        return;
      }

      user.model.findOne({
        where: {
          telegram_username: msg.from.username
        }
      })
          .then(function (found_user) {
            if (found_user) {
              resp = 'Transactions for @' + found_user.telegram_username + '\n\n';

              transaction.model.findAll({
                where: {
                  user_id: found_user.id
                }
              }).then(function (transactions) {
                for (var i = 0; i < transactions.length; i++) {
                  var t = transactions[i];
                  var status = t.processed ? 'Processed' : 'Processing';

                  resp += '\t - (' + t.createdAt.toDateString() + ') ' + status + ' ' + t.type + ', amount ' + numeral(t.amount).format('0,0') + ' WEBD\n';
                }

                bot.sendMessage(msg.chat.id, resp, {
                  //parse_mode: 'Markdown',
                  disable_web_page_preview: true,
                  disable_notification: true,
                });
              });
            } else {
              resp = 'Your user can not be found. Create a new acount /start';

              bot.sendMessage(msg.chat.id, resp, {
                parse_mode: 'Markdown',
                disable_web_page_preview: true,
                disable_notification: true,
              });
            }
          })
          .catch(console.error);
    } catch(e) {
      console.error('/transactions', e);
    }
  };
};

module.exports = Command;
