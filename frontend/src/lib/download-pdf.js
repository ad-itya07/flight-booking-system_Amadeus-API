import { jsPDF } from "jspdf";

export const handleDownloadPDF = async ({ booking }) => {
  if (!booking) return;

  try {
    // Initialize PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    // PDF dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const usableWidth = pageWidth - margin * 2;

    // Start Y position
    let yPos = 20;

    // Helper functions
    const addText = (text, x, y, options = {}) => {
      const defaults = { fontSize: 10, fontStyle: "normal", align: "left" };
      const settings = { ...defaults, ...options };

      pdf.setFontSize(settings.fontSize);
      pdf.setFont("helvetica", settings.fontStyle);
      pdf.text(text, x, y, { align: settings.align });

      return pdf.getTextDimensions(text).h + 2;
    };

    const addHorizontalLine = (y) => {
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, y, pageWidth - margin, y);
      return 3;
    };

    // Format date to readable string
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Add header with logo/airline name
    pdf.setFillColor(25, 47, 89); // Professional dark blue
    pdf.rect(0, 0, pageWidth, 18, "F");

    pdf.setTextColor(255, 255, 255);
    yPos = 12;
    yPos += addText("FLIGHT E-TICKET", pageWidth / 2, yPos, {
      fontSize: 16,
      fontStyle: "bold",
      align: "center",
    });

    pdf.setTextColor(0, 0, 0);
    yPos = 25;

    // Add booking reference
    const bookingId = booking._id.slice(-6).toUpperCase();
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos - 5, usableWidth, 10, "F");

    yPos += addText(`BOOKING REFERENCE: #${bookingId}`, pageWidth / 2, yPos, {
      fontSize: 11,
      fontStyle: "bold",
      align: "center",
    });

    yPos += 10;

    // Flight information header
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos, usableWidth, 8, "F");

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("FLIGHT DETAILS", margin + 5, yPos + 5.5);

    yPos += 12;

    // Flight info box
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.5);
    pdf.rect(margin, yPos, usableWidth, 35, "S");

    // Airline & Flight Number
    yPos += 8;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `${booking.flight.flightName} | Flight ${booking.flight.flightNo}`,
      margin + 5,
      yPos
    );

    // Journey details with arrow
    yPos += 15;

    // From city
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(booking.from, margin + 5, yPos);

    // Departure time
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(booking.flight.departureTime, margin + 5, yPos + 7);

    // Center arrow
    const arrowStartX = margin + 45;
    const arrowEndX = pageWidth - margin - 45;

    pdf.setDrawColor(100, 100, 100);
    pdf.setLineWidth(0.7);
    pdf.line(arrowStartX, yPos, arrowEndX, yPos);

    // Small plane icon in the middle
    const planeX = pageWidth / 2;
    pdf.text("✈", planeX, yPos - 2, { align: "center" });

    // Duration below the line
    pdf.setFontSize(8);
    pdf.text(booking.flight.duration, planeX, yPos + 7, { align: "center" });

    // Add arrowhead
    pdf.line(arrowEndX, yPos, arrowEndX - 3, yPos - 2);
    pdf.line(arrowEndX, yPos, arrowEndX - 3, yPos + 2);

    // To city
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text(booking.to, pageWidth - margin - 5, yPos, { align: "right" });

    // Arrival time
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(booking.flight.arrivalTime, pageWidth - margin - 5, yPos + 7, {
      align: "right",
    });

    yPos += 20;

    // Date info
    const journeyDateStr = formatDate(booking.journeyDate);

    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos, usableWidth, 8, "F");

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("TRAVEL DATE", margin + 5, yPos + 5.5);

    yPos += 12;
    pdf.setFont("helvetica", "normal");
    pdf.text(journeyDateStr, margin + 5, yPos);

    yPos += 10;

    // Passenger information
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos, usableWidth, 8, "F");

    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("PASSENGER DETAILS", margin + 5, yPos + 5.5);

    yPos += 15;

    // Create table for passenger info
    pdf.setLineWidth(0.1);

    // Table header
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPos - 6, usableWidth, 7, "F");

    const colWidth = usableWidth / 3;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "bold");
    pdf.text("PASSENGER NAME", margin + 5, yPos);
    pdf.text("AGE", margin + colWidth + 5, yPos);
    pdf.text("GENDER", margin + colWidth * 2 + 5, yPos);

    // Table border
    pdf.rect(
      margin,
      yPos - 6,
      usableWidth,
      7 + booking.passengers.length * 8,
      "S"
    );

    // Vertical lines for columns
    pdf.line(
      margin + colWidth,
      yPos - 6,
      margin + colWidth,
      yPos + 1 + booking.passengers.length * 8
    );
    pdf.line(
      margin + colWidth * 2,
      yPos - 6,
      margin + colWidth * 2,
      yPos + 1 + booking.passengers.length * 8
    );

    // Horizontal line after header
    pdf.line(margin, yPos + 1, margin + usableWidth, yPos + 1);

    // Passenger rows
    yPos += 6;
    pdf.setFont("helvetica", "normal");

    booking.passengers.forEach((passenger, index) => {
      pdf.text(passenger.name, margin + 5, yPos);
      pdf.text(passenger.age.toString(), margin + colWidth + 5, yPos);
      pdf.text(passenger.gender, margin + colWidth * 2 + 5, yPos);

      // Line between passengers
      if (index < booking.passengers.length - 1) {
        yPos += 8;
        pdf.line(margin, yPos - 4, margin + usableWidth, yPos - 4);
      }
    });

    yPos += 15;

    // Fare details
    pdf.setFillColor(240, 240, 240);
    pdf.rect(margin, yPos, usableWidth, 8, "F");
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("FARE DETAILS", margin + 5, yPos + 5.5);

    yPos += 15;

    // Display price
    pdf.setFont("helvetica", "normal");
    pdf.text("Base Fare:", margin + 5, yPos);
    pdf.text(
      `INR ${(booking.flight.price - booking.flight.price * 0.18).toFixed(2)}`,
      pageWidth - margin - 5,
      yPos,
      { align: "right" }
    );

    yPos += 7;
    pdf.text("Taxes & Fees:", margin + 5, yPos);
    const taxes = (booking.flight.price * 0.18).toFixed(2); // Assuming 18% tax
    pdf.text(`INR ${taxes}`, pageWidth - margin - 5, yPos, { align: "right" });

    yPos += 7;
    pdf.setDrawColor(150, 150, 150);
    pdf.line(pageWidth - margin - 50, yPos, pageWidth - margin, yPos);

    yPos += 7;
    pdf.setFont("helvetica", "bold");
    pdf.text("Total:", margin + 5, yPos);
    const total = (booking.flight.price).toFixed(2);
    pdf.text(`INR ${total}`, pageWidth - margin - 5, yPos, { align: "right" });

    // Add footer
    const footerY = pageHeight - 15;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "italic");
    pdf.setTextColor(100, 100, 100);
    pdf.text(
      "This is an electronic ticket. Please bring a valid ID proof for verification at the airport.",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );

    pdf.text(
      `Generated on: ${new Date().toLocaleString()}`,
      pageWidth / 2,
      footerY + 5,
      { align: "center" }
    );

    // Save PDF
    pdf.save(`e-ticket-${bookingId}-${new Date().getTime()}.pdf`);
  } catch (err) {
    console.error("Failed to generate PDF", err);
  }
};
