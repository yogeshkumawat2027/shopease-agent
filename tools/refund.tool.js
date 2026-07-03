import ordersData from "../data/orders.json" with { type: "json" };

export const checkRefundEligibility = (orderId) => {
  const order = ordersData.orders.find(
    (item) => item.order_id.toLowerCase() === orderId.toLowerCase()
  );

  if (!order) {
    return {
      found: false,
      eligible: false,
      reason: "Order not found",
    };
  }

  if (order.status === "refunded") {
    return {
      found: true,
      eligible: false,
      order_id: order.order_id,
      reason: "This order has already been refunded.",
    };
  }

  if (order.status === "cancelled") {
    return {
      found: true,
      eligible: false,
      order_id: order.order_id,
      reason: "This order was cancelled, so it is not eligible for a refund through the return process.",
    };
  }

  if (order.status !== "delivered") {
    return {
      found: true,
      eligible: false,
      order_id: order.order_id,
      status: order.status,
      reason: "Only delivered orders are eligible for refund checks.",
    };
  }

  const deliveryDate = new Date(order.delivery_date);
  const today = new Date();

  const diffMs = today - deliveryDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 30) {
    return {
      found: true,
      eligible: true,
      order_id: order.order_id,
      status: order.status,
      delivery_date: order.delivery_date,
      days_since_delivery: diffDays,
      reason: "This order is within the 30-day return window.",
    };
  }

  return {
    found: true,
    eligible: false,
    order_id: order.order_id,
    status: order.status,
    delivery_date: order.delivery_date,
    days_since_delivery: diffDays,
    reason: "This order is outside the 30-day return window.",
  };
};