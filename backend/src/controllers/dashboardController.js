import { Customer } from '../models/Customer.js';
import { Device } from '../models/Device.js';
import { ServiceOrder } from '../models/ServiceOrder.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboard = asyncHandler(async (_request, response) => {
  const [customers, devices, users, orders, byStatus, recentOrders, revenueAgg, priorityAgg] = await Promise.all([
    Customer.countDocuments(),
    Device.countDocuments(),
    User.countDocuments(),
    ServiceOrder.countDocuments(),
    ServiceOrder.aggregate([{ $group: { _id: '$status', total: { $sum: 1 } } }, { $sort: { total: -1 } }]),
    ServiceOrder.find().populate('customer').populate('device').sort({ createdAt: -1 }).limit(6),
    ServiceOrder.aggregate([
      { $match: { 'payment.status': 'pago' } },
      { $group: { _id: null, total: { $sum: '$payment.amountPaid' } } },
    ]),
    ServiceOrder.aggregate([{ $group: { _id: '$priority', total: { $sum: 1 } } }]),
  ]);

  response.json({
    totals: {
      customers,
      devices,
      users,
      orders,
      revenue: revenueAgg[0]?.total || 0,
    },
    byStatus: byStatus.map((item) => ({ status: item._id, total: item.total })),
    byPriority: priorityAgg.map((item) => ({ priority: item._id, total: item.total })),
    recentOrders,
  });
});

