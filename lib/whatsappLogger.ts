import { ExpenseRecord } from "@/types";

export const generateWhatsAppLink = (expense: ExpenseRecord) => {
    const text = `Expense Logged:
Amount: ${expense.amount}
Category: ${expense.category}
Note: ${expense.note || "N/A"}
Date: ${new Date(expense.date).toLocaleDateString()}`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
};
