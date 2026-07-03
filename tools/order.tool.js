import ordersData from "../data/orders.json" with { type: "json" };

export const getOrderStatus = (orderId) => {
  const order = ordersData.orders.find(
    (item) => item.order_id.toLowerCase() === orderId.toLowerCase()
  );

  if (!order) {
    return {
      found: false,
      message: "Order not found",
    };
  }

  return {
    found: true,
    order_id: order.order_id,
    status: order.status,
    order_date: order.order_date,
    delivery_date: order.delivery_date || null,
    estimated_delivery: order.estimated_delivery || null,
    tracking_number: order.tracking_number || null,
    carrier: order.carrier || null,
    tracking_url: order.tracking_url || null,
    total: order.total,
    items: order.items,
  };
};