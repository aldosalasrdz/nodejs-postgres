/* eslint-disable no-useless-constructor */
const boom = require('@hapi/boom')

const { models } = require('./../libs/sequelize')

class OrderService {
  constructor () {}

  async createOrder (data) {
    const newOrder = await models.Order.create(data)
    return newOrder
  }

  async addItem (data) {
    const newItem = await models.OrderProduct.create(data)
    return newItem
  }

  async findOrders () {
    const orders = await models.Order.findAll({
      include: ['items']
    })
    return orders
  }

  async findOneOrder (id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user']
        },
        'items'
      ]
    })
    if (!order) {
      throw boom.notFound('Order not found')
    }
    return order
  }

  async updateOrder (id, changes) {
    const order = await this.findOneOrder(id)
    const response = await order.update(changes)
    return response
  }

  async deleteOrder (id) {
    const order = await this.findOneOrder(id)
    await order.destroy()
    return { id }
  }
}

module.exports = OrderService
