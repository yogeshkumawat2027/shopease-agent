import ordersData from "../data/orders.json" with { type: "json" };

const REFUND_WINDOW_DAYS = 30;

export const checkRefundEligibility = (orderId) => {
  const order = ordersData.orders.find(
    (item) => item.order_id.toLowerCase() === String(orderId).toLowerCase()
  );

  if (!order) {
    return {
      found: false,
      eligible: false,
      message: "Order not found",
    };
  }

  if (order.status === "refunded") {
    return {
      found: true,
      eligible: false,
      order_id: order.order_id,
      status: order.status,
      refund_date: order.refund_date || null,
      refund_amount: order.refund_amount || null,
      message: "This order has already been refunded.",
    };
  }

  if (order.status === "cancelled") {
    return {
      found: true,
      eligible: false,
      order_id: order.order_id,
      status: order.status,
      cancelled_date: order.cancelled_date || null,
      message: "This order was cancelled, so it is not eligible for a refund through the return process.",
    };
  }

  if (order.status !== "delivered") {
    return {
      found: true,
      eligible: false,
      order_id: order.order_id,
      status: order.status,
      message: "Order must be delivered before it can be reviewed for a refund.",
    };
  }

  if (!order.delivery_date) {
    return {
      found: true,
      eligible: false,
      order_id: order.order_id,
      status: order.status,
      delivery_date: null,
      message: "Delivery date is missing, so refund eligibility cannot be determined.",
    };
  }

  const deliveryDate = new Date(order.delivery_date);

  if (Number.isNaN(deliveryDate.getTime())) {
    return {
      found: true,
      eligible: false,
      order_id: order.order_id,
      status: order.status,
      delivery_date: order.delivery_date,
      message: "Invalid delivery date on the order.",
    };
  }

  const today = new Date();
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const daysSinceDelivery = Math.floor(
    (today - deliveryDate) / millisecondsPerDay
  );

  const eligible =
    daysSinceDelivery >= 0 && daysSinceDelivery <= REFUND_WINDOW_DAYS;

  return {
    found: true,
    eligible,
    order_id: order.order_id,
    status: order.status,
    delivery_date: order.delivery_date,
    refund_window_days: REFUND_WINDOW_DAYS,
    days_since_delivery: daysSinceDelivery,
    message: eligible
      ? "This order is eligible for a refund."
      : "The refund window has expired for this order.",
  };
};