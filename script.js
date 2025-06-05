document
  .getElementById("expense-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const purpose = document.getElementById("purpose").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    if (!name || !purpose || isNaN(amount) || amount <= 0 || !date) return;

    const row = document.createElement("tr");

    row.innerHTML = `
  <td>${name}</td>
  <td>${purpose}</td>
  <td>Rs.${amount.toFixed(2)}</td>
  <td>${date}</td>
`;

    document.getElementById("expense-list").appendChild(row);

    // Save and calculate total
    if (!window.expenses) window.expenses = [];
    window.expenses.push({ name, purpose, amount });

    const total = window.expenses.reduce((sum, item) => sum + item.amount, 0);
    document.getElementById(
      "total"
    ).textContent = `Total Expenses: Rs.${total.toFixed(2)}`;

    // Summary by person
    const summary = {};
    window.expenses.forEach((item) => {
      summary[item.name] = (summary[item.name] || 0) + item.amount;
    });

    document.getElementById("summary").innerHTML =
      "Individual Summary:<br>" +
      Object.entries(summary)
        .map(([person, amt]) => `${person}: Rs.${amt.toFixed(2)}`)
        .join("<br>");

    // Reset form
    document.getElementById("expense-form").reset();
  });

//Pdf generation
document.getElementById("download-pdf").addEventListener("click", function () {
  const { jsPDF } = window.jspdf;

  html2canvas(document.getElementById("expense-list")).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("trip-expenses.pdf");
  });
});
