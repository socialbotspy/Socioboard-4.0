'use strict';
module.exports = (sequelize, Sequelize) => {
  const user_payments = sequelize.define('user_payments', {
    payment_id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    transaction_id: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    transaction_type: {
      type: Sequelize.STRING(64),
      allowNull: false
    },
    currency_code: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    amount: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    coupon_code: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    payment_mode: {
      // 0-Paypal, 1-PayUMoney
      type: Sequelize.INTEGER(3),
      allowNull: false,
      defaultValue: 0
    },
    payment_status: {
      //  0-Failed, 1- Success
      type: Sequelize.INTEGER(3),
      allowNull: false,
      defaultValue: 0
    },
    payment_initiated_date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    requested_plan_id: {
      type: Sequelize.INTEGER(3),
      allowNull: false,
    },
    payment_completed_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    is_payment_verified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    payment_verified_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    payment_verified_by: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    payer_id: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    payer_email: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    payer_name: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    subscription_details: {
      type: Sequelize.TEXT('tiny'),
      allowNull: true
    },
    invoice_id: {
      type: Sequelize.STRING(64),
      allowNull: true
    },
    invoice_url: {
      type: Sequelize.TEXT('tiny'),
      allowNull: true
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'user_details',
        key: 'user_id'
      },
      onUpdate: 'cascade',
      onDelete: 'cascade'
    }
  }, {});
  user_payments.associate = function (models) {
    user_payments.belongsTo(models.user_details, { as: 'Payment', foreignKey: 'user_id', targetKey: 'user_id' });
    // associations can be defined here
  };
  return user_payments;
};