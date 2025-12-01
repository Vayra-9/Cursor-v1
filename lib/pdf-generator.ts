import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ReportData {
    userName: string;
    month: string;
    totalIncome: number;
    totalExpenses: number;
    totalSaved: number;
    expenses: Array<{
        date: string;
        category: string;
        amount: number;
        note?: string;
    }>;
}

export const generateFinancialReport = (data: ReportData) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(20);
    doc.text("VAYRA Financial Report", 20, 20);

    // User Info
    doc.setFontSize(12);
    doc.text(`User: ${data.userName}`, 20, 35);
    doc.text(`Period: ${data.month}`, 20, 42);

    // Summary
    doc.setFontSize(14);
    doc.text("Summary", 20, 55);
    doc.setFontSize(11);
    doc.text(`Total Income: $${data.totalIncome.toFixed(2)}`, 20, 65);
    doc.text(`Total Expenses: $${data.totalExpenses.toFixed(2)}`, 20, 72);
    doc.text(`Total Saved: $${data.totalSaved.toFixed(2)}`, 20, 79);

    // Expenses Table
    autoTable(doc, {
        startY: 90,
        head: [["Date", "Category", "Note", "Amount"]],
        body: data.expenses.map(exp => [
            exp.date,
            exp.category,
            exp.note || "-",
            `$${exp.amount.toFixed(2)}`
        ]),
    });

    // Save
    doc.save(`vayra-report-${data.month}.pdf`);
};
