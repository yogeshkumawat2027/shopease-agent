import { searchKnowledgeBase } from "../tools/knowledge.tool.js";
import { getOrderStatus } from "../tools/order.tool.js";
import { checkRefundEligibility } from "../tools/refund.tool.js";
import { escalateToHuman } from "../tools/escalation.tool.js";

export const executeTool = async (name,args) => {
  
  switch (name) {
    case "search_knowledge_base":
      return searchKnowledgeBase(args.query);

    case "get_order_status":
      return getOrderStatus(args.order_id);

    case "check_refund_eligibility":
      return checkRefundEligibility(
        args.order_id
      );

    case "escalate_to_human":
      return escalateToHuman(
        args.summary,
        args.priority
      );

    default:
      throw new Error(
        `Unknown tool: ${name}`
      );
  }
};