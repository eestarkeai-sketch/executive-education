/**
 * Executive Education Gateway: inquiry endpoint (Google Apps Script).
 * Deploy: New deployment > Web app > Execute as me > Anyone. Set the web app URL
 * as ENDPOINT_FALLBACK in js/gateway.js (or window.EEG_ENDPOINT before the script tag).
 * Persists the full structured inquiry record, including the reference, the entry
 * pathway and the selector context, and emails the office.
 */
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Inquiries')
        || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Inquiries');
  if (ss.getLastRow() === 0) {
    ss.appendRow(['Received','Reference','Pathway','When','Organization','Who is in the room',
      'What is happening','Preferred format','Name and title','Email','Notes','Selector context (JSON)']);
  }
  ss.appendRow([new Date(), d.ref, d.pathway || 'direct', d.when, d.organization, d.room,
    d.happening, d.format, d.name, d.email, d.notes, JSON.stringify(d.selector || null)]);
  var sel = d.selector && d.selector.recommendation;
  MailApp.sendEmail({
    to: 'ethan@ethanstarke.com',
    subject: 'Gateway inquiry ' + d.ref + (d.organization ? ' · ' + d.organization : ''),
    body: 'Reference: ' + d.ref + '\nPathway: ' + (d.pathway || 'direct')
      + '\nWhen: ' + d.when + '\nOrganization: ' + d.organization
      + '\nWho is in the room: ' + d.room + '\nWhat is happening: ' + d.happening
      + '\nPreferred format: ' + d.format + '\nName and title: ' + d.name
      + '\nEmail: ' + d.email + '\nNotes: ' + d.notes
      + (sel ? '\n\nSelector: ' + (sel.topic || 'custom') + ' as ' + sel.format : '')
  });
  return ContentService.createTextOutput(JSON.stringify({ok: true, ref: d.ref}))
    .setMimeType(ContentService.MimeType.JSON);
}
