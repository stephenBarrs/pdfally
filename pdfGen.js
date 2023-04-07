const PDFDocument = require("pdfkit");
const fs = require("fs");

const vaccineData = require("./vaccines.json");
const fullName = "Doe, John R., Jr.";
const dob = "12/12/1980";

const doc = new PDFDocument({
  pdfVersion: "1.5",
  tagged: true,
  displayTitle: true,
  info: { Title: "Your Vaccines", Subject: "Vaccine Information" },
});

doc.pipe(fs.createWriteStream("file.pdf"));
// console.log(vaccineData);

doc.addStructure(
  doc.struct("P", () => {
    doc.markContent("P");
    doc.font("Helvetica-Bold").text("CONFIDENTIAL" + " ", { align: "center" });
    doc.font("Helvetica").text(fullName + " - DOB " + dob + " ", {
      align: "left",
      continue: true,
    });
    doc.endMarkedContent();
  })
);

vaccineData.forEach((element) => {
  doc.moveDown();
  doc.fontSize(20);
  doc.addStructure(
    doc.struct("H1", () => {
      doc.markContent("H1");
      doc.font("Helvetica-Bold").text(element.name + " ");
      doc.endMarkedContent();
    })
  );

  element.date ? makeDataItem("Date received: ", element.date + " ") : null;
  element.type ? makeDataItem("Type: ", element.type + " ") : null;
  element.dosage ? makeDataItem("Dosage: ", element.dosage + " ") : null;
  element.series ? makeDataItem("Series: ", element.series + " ") : null;
  element.facility ? makeDataItem("Location: ", element.facility + " ") : null;
});
doc.end();

function makeDataItem(label, value) {
  doc.fontSize(12);
  doc.markContent("Span");
  doc
    .font("Helvetica-Bold")
    .text(label, { continued: true, indent: 25 })
    .font("Helvetica")
    .text(value);
  doc.endMarkedContent();
}
