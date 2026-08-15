/**
 * Email capture -> Google Sheet.
 *
 * Paste this into Extensions > Apps Script on the Sheet you want the addresses
 * in, then deploy it as a Web App. Full steps are in the README.
 *
 * Why a bound Apps Script rather than the Sheets API: the API route needs a
 * service account, a private key living in an env var, and a library to sign
 * with. This needs a URL. For a list that one person will read once a week,
 * that is the whole difference.
 *
 * Deploy settings that matter:
 *   Execute as:      Me
 *   Who has access:  Anyone
 *
 * "Anyone" is required for a server with no Google session to POST here, and it
 * is why TOKEN exists. The deployment URL is unguessable but it is not a secret:
 * it sits in env vars, logs and screenshots. The token is what actually stops a
 * leaked URL from being used to fill the sheet.
 */

// Change this, and set the same value as SUBSCRIBE_WEBHOOK_TOKEN in Vercel.
var TOKEN = "CHANGE-ME-TO-A-LONG-RANDOM-STRING";

var HEADERS = ["Timestamp", "Email", "Name", "Source", "Site"];

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (!TOKEN || payload.token !== TOKEN) {
      // Deliberately unhelpful. A caller without the token learns nothing about
      // whether the token was wrong or the field was missing.
      return json({ ok: false }, 403);
    }

    var email = String(payload.email || "").trim().toLowerCase();
    if (!email || email.indexOf("@") === -1) {
      return json({ ok: false, error: "invalid email" }, 400);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Lock before reading. Two people submitting at the same moment would
    // otherwise both read the same last row and one would overwrite the other.
    var lock = LockService.getScriptLock();
    lock.waitLock(20000);

    try {
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
        sheet.setFrozenRows(1);
      }

      // Skip an address already on the list. Signing up twice is normal
      // behaviour, and a list with duplicates is a list someone has to clean by
      // hand before they can use it.
      if (sheet.getLastRow() > 1) {
        var existing = sheet
          .getRange(2, 2, sheet.getLastRow() - 1, 1)
          .getValues()
          .map(function (row) {
            return String(row[0]).trim().toLowerCase();
          });
        if (existing.indexOf(email) !== -1) {
          return json({ ok: true, duplicate: true });
        }
      }

      sheet.appendRow([
        payload.submittedAt || new Date().toISOString(),
        email,
        String(payload.name || ""),
        String(payload.source || ""),
        String(payload.site || ""),
      ]);
    } finally {
      lock.releaseLock();
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  }
}

/**
 * Apps Script cannot set a status code on a ContentService response: a rejected
 * token, a bad payload and a successful append all come back as HTTP 200. The
 * real outcome goes in the body, and the API route reads `ok` from it for
 * exactly this reason. Without that, a wrong token would drop every address
 * while the form said thank you.
 */
function json(obj, status) {
  obj.status = status || 200;
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
