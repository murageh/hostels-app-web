//@ts-nocheck
import jsPDF from "jspdf";
import "jspdf-autotable";

import {errorToaster, successToaster} from "./Toaster";
import {capitalize} from "@mui/material";
import {format} from "date-fns";

export function printStudents(students, title) {
    // title, type, rows, columns
    let columns = ["Name", "Reg Number", "Year", "Hostel", "Room", "Amount",	"Paid", "Clearance status"];
    let rows = [];
    students.forEach((student) => {
        rows.push([
            student.name, student.reg_no, `${student.study_year}.${student.study_semester}`, student.hostel_id ?? "N/A", student.room_id ?? "N/A", `Kshs. ${student.room_cost ?? 0}`, parseInt(student.paid) > 0 ? "Yes" : "No",
            (typeof student.awaiting_clearance === "undefined" || student.awaiting_clearance == null)
                ? "Not requested" : parseInt(student.awaiting_clearance) === 1 ? "Awaiting clearance" : "Already cleared",]);
    });

    generatePDF(capitalize(title ?? "All students"), rows, columns, "p");
}

export function printHostels(hostels) {
    // title, type, rows, columns
    let columns = ["Hostel ID", "Name", "All rooms", "Available rooms",];
    let rows = [];
    hostels.forEach((hostel) => {
        rows.push([hostel.id, hostel.name, hostel.num_rooms, hostel.num_available_rooms ?? "--",]);
    });

    generatePDF(capitalize("All hostels"), rows, columns, "p");
}

export function printRooms(rooms) {
    // title, type, rows, columns
    let columns = ["Name", "Hostel", "Cost", "Active",];
    let rows = [];
    rooms.forEach((room) => {
        rows.push([room.id, room.name, room.hostel_name, room.room_cost, parseInt(room.active) === 0 ? "Inactive" : "Active"]);
    });

    generatePDF(capitalize("All rooms"), rows, columns, "p");
}


// define a generatePDF function that accepts a tickets argument
const generatePDF = (type, rows, columns, orientation) => {
    // initialize jsPDF
    const doc = new jsPDF({
        orientation: orientation,
        unit: "px",
        format: "a4",
        putOnlyUsedFonts: true
    });

    // define an empty array of rows
    const tableColumn = [...columns];
    const tableRows = [...rows];

    const date = Date().split(" ");
    // we use a date string to generate our filename.
    const dateStr = date[0] + date[1] + date[2] + date[3] + date[4];

    const commonText = `This is a list of ${type}. Generated on ${format(
        new Date(),
        "dd/MM/yyyy"
    )} at ${format(
        new Date(),
        "hh:mm:ss a"
    )}`;
    const footerText = `${date}`;

    let pageSize = doc.internal.pageSize;
    let pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();

    // report title. and margin-top + margin-left
    doc.setFontSize(20);
    doc.setFont("Helvetica", "bold");
    doc.text("Hostel Management System", 30, 22);
    // doc.text(title, 14, 30);
    doc.setFontSize(16);
    doc.text(doc.splitTextToSize(type, pageWidth - 35, {}), 30, 40);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    pageSize = doc.internal.pageSize;
    pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    doc.setFont("Helvetica", "normal");
    let text = doc.splitTextToSize(commonText, pageWidth - 35, {});
    doc.text(text, 30, 60);

    if (tableRows.length < 1) {
        errorToaster("There's no data. Add some data first, before trying to export.");
        return;
    }

    // startY is basically margin-top
    doc.autoTable(
        {
            columns: tableColumn,
            body: tableRows,
            startY: 80,
            showHead: "firstPage",
        }
    );

    //footer
    doc.setFontSize(11);
    doc.text(footerText, 30, doc.lastAutoTable.finalY + 30);

    // we define the name of our PDF file.
    doc.save(`HOSTEL_SYSTEM_${type.toUpperCase()}_Report_${dateStr}.pdf`);

    successToaster(`Your ${type} data has been successfully exported to pdf.`);
};

export default generatePDF;