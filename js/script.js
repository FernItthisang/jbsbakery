// ============================================================
//  JB's Bakery — รับออร์เดอร์ → Google Sheets + แจ้งเตือนอีเมล
//  วิธีใช้: ดูขั้นตอนในไฟล์ SETUP.md
// ============================================================
 
// ✏️  แก้ตรงนี้ให้เป็นอีเมลที่อยากรับแจ้งเตือน
var NOTIFY_EMAIL = "rr9123533@gmail.com";
 
// ✏️  ชื่อ Sheet ที่จะเก็บออร์เดอร์ (ปกติชื่อ "Sheet1")
var SHEET_NAME = "Orders";
 
// ------------------------------------------------------------
 
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
 
    // บันทึกลง Google Sheets
    saveToSheet(data);
 
    // ส่งอีเมลแจ้งเตือน
    sendNotificationEmail(data);
 
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
 
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
 
// ── บันทึกลง Sheet ──────────────────────────────────────────
function saveToSheet(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
 
  // ถ้ายังไม่มี Sheet หรือไม่มี Header → สร้างให้อัตโนมัติ
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "🕐 วันเวลา",
      "👤 ชื่อ",
      "📞 เบอร์โทร",
      "🍞 เมนู",
      "🔢 จำนวน",
      "🚚 วิธีรับ",
      "📅 วัน-เวลาที่ต้องการ",
      "📝 หมายเหตุ",
      "✅ สถานะ"
    ]);
    // จัดสไตล์ Header
    var header = sheet.getRange(1, 1, 1, 9);
    header.setBackground("#7B5030");
    header.setFontColor("#ffffff");
    header.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
 
  // เพิ่มแถวออร์เดอร์ใหม่
  var timestamp = Utilities.formatDate(
    new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss"
  );
 
  sheet.appendRow([
    timestamp,
    data.name     || "-",
    data.phone    || "-",
    data.menu     || "-",
    data.quantity || "-",
    data.delivery || "-",
    data.datetime || "-",
    data.note     || "-",
    "รอยืนยัน"
  ]);
 
  // ไฮไลท์แถวใหม่สีอ่อน
  var lastRow = sheet.getLastRow();
  var rowRange = sheet.getRange(lastRow, 1, 1, 9);
  var bgColor = (lastRow % 2 === 0) ? "#FDF7F0" : "#F5EBD9";
  rowRange.setBackground(bgColor);
}
 
// ── ส่งอีเมลแจ้งเตือน ───────────────────────────────────────
function sendNotificationEmail(data) {
  var timestamp = Utilities.formatDate(
    new Date(), "Asia/Bangkok", "dd/MM/yyyy เวลา HH:mm น."
  );
 
  var subject = "🍞 ออร์เดอร์ใหม่ JB's Bakery — " + (data.name || "ลูกค้า") + " | " + (data.menu || "");
 
  var body = `
สวัสดีครับ มีออร์เดอร์ใหม่เข้ามาที่ JB's Bakery!
 
━━━━━━━━━━━━━━━━━━━━━━━
📋 รายละเอียดออร์เดอร์
━━━━━━━━━━━━━━━━━━━━━━━
 
🕐 วันเวลาที่สั่ง : ${timestamp}
👤 ชื่อลูกค้า     : ${data.name || "-"}
📞 เบอร์โทร       : ${data.phone || "-"}
🍞 เมนู           : ${data.menu || "-"}
🔢 จำนวน          : ${data.quantity || "-"}
🚚 วิธีรับ        : ${data.delivery || "-"}
📅 วัน-เวลารับ    : ${data.datetime || "-"}
📝 หมายเหตุ       : ${data.note || "-"}
 
━━━━━━━━━━━━━━━━━━━━━━━
 
👉 ดูออร์เดอร์ทั้งหมดได้ที่ Google Sheets ของคุณ
 
— ระบบอัตโนมัติ JB's Bakery
  `;
 
  var htmlBody = `
<div style="font-family:sans-serif;max-width:520px;margin:0 auto">
  <div style="background:#7B5030;padding:20px 24px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:18px">🍞 ออร์เดอร์ใหม่ JB's Bakery</h2>
    <p style="color:rgba(255,255,255,.7);margin:4px 0 0;font-size:13px">${timestamp}</p>
  </div>
  <div style="background:#FDF7F0;padding:24px;border:1px solid #E8D4B8;border-top:none;border-radius:0 0 12px 12px">
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#9A7A5A;width:130px">👤 ชื่อลูกค้า</td><td style="padding:8px 0;color:#3E2410;font-weight:600">${data.name || "-"}</td></tr>
      <tr style="background:#F5EBD9"><td style="padding:8px 6px;color:#9A7A5A">📞 เบอร์โทร</td><td style="padding:8px 6px;color:#3E2410"><a href="tel:${data.phone}" style="color:#7B5030">${data.phone || "-"}</a></td></tr>
      <tr><td style="padding:8px 0;color:#9A7A5A">🍞 เมนู</td><td style="padding:8px 0;color:#3E2410;font-weight:600">${data.menu || "-"}</td></tr>
      <tr style="background:#F5EBD9"><td style="padding:8px 6px;color:#9A7A5A">🔢 จำนวน</td><td style="padding:8px 6px;color:#3E2410">${data.quantity || "-"}</td></tr>
      <tr><td style="padding:8px 0;color:#9A7A5A">🚚 วิธีรับ</td><td style="padding:8px 0;color:#3E2410">${data.delivery || "-"}</td></tr>
      <tr style="background:#F5EBD9"><td style="padding:8px 6px;color:#9A7A5A">📅 วัน-เวลารับ</td><td style="padding:8px 6px;color:#3E2410">${data.datetime || "-"}</td></tr>
      <tr><td style="padding:8px 0;color:#9A7A5A">📝 หมายเหตุ</td><td style="padding:8px 0;color:#3E2410">${data.note || "-"}</td></tr>
    </table>
    <div style="margin-top:20px;padding:14px;background:#fff;border-radius:8px;border:1px solid #E8D4B8;text-align:center">
      <p style="color:#9A7A5A;font-size:13px;margin:0 0 4px">อย่าลืมโทรยืนยันออร์เดอร์ภายใน 24 ชั่วโมง</p>
      <a href="tel:${data.phone}" style="background:#7B5030;color:#fff;padding:8px 20px;border-radius:100px;text-decoration:none;font-size:13px;font-weight:600">โทร ${data.phone}</a>
    </div>
  </div>
</div>
  `;
 
  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body, {
    htmlBody: htmlBody,
    name: "JB's Bakery — ระบบออร์เดอร์"
  });
}
