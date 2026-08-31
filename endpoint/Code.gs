/**
 * Executive Education Gateway: inquiry endpoint (Google Apps Script).
 * Deploy: New deployment > Web app > Execute as me > Anyone. Set the web app URL
 * as ENDPOINT_FALLBACK in js/gateway.js (or window.EEG_ENDPOINT before the script tag).
 * Persists the full structured inquiry record, including the reference, the entry
 * pathway and the selector context, and emails the office. The two daylight lines
 * (an introduction, a subscription) arrive through the same endpoint and land on
 * their own sheets.
 */
var OFFICE = 'office@ethanstarke.com';

function sheet(name, header) {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var s = book.getSheetByName(name) || book.insertSheet(name);
  if (s.getLastRow() === 0) s.appendRow(header);
  return s;
}

function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var pathway = d.pathway || 'direct';

  if (pathway === 'introduce') {
    sheet('Introductions', ['Received', 'Reference', 'Referrer', 'Referrer email', 'Organization', 'Why now'])
      .appendRow([new Date(), d.ref, d.name, d.email, d.organization, d.why]);
    MailApp.sendEmail({
      to: OFFICE,
      subject: 'Gateway introduction ' + d.ref + (d.organization ? ' · ' + d.organization : ''),
      body: 'Reference: ' + d.ref + '\nReferrer: ' + d.name + ' <' + d.email + '>'
        + '\nOrganization: ' + d.organization + '\nWhy now: ' + d.why
    });
    return ok(d.ref);
  }

  if (pathway === 'subscribe') {
    sheet('Subscribers', ['Received', 'Reference', 'Email']).appendRow([new Date(), d.ref, d.email]);
    MailApp.sendEmail({
      to: OFFICE,
      subject: 'Gateway subscription ' + d.ref,
      body: 'Reference: ' + d.ref + '\nEmail: ' + d.email + '\n\nAdd to The Starke Perspective list.'
    });
    return ok(d.ref);
  }

  sheet('Inquiries', ['Received', 'Reference', 'Pathway', 'When', 'Organization', 'Who is in the room',
    'What is happening', 'Preferred format', 'Name and title', 'Email', 'Notes', 'Selector context (JSON)'])
    .appendRow([new Date(), d.ref, pathway, d.when, d.organization, d.room,
      d.happening, d.format, d.name, d.email, d.notes, JSON.stringify(d.selector || null)]);
  var sel = d.selector && d.selector.recommendation;
  MailApp.sendEmail({
    to: OFFICE,
    subject: 'Gateway inquiry ' + d.ref + (d.organization ? ' · ' + d.organization : ''),
    body: 'Reference: ' + d.ref + '\nPathway: ' + pathway
      + '\nWhen: ' + d.when + '\nOrganization: ' + d.organization
      + '\nWho is in the room: ' + d.room + '\nWhat is happening: ' + d.happening
      + '\nPreferred format: ' + d.format + '\nName and title: ' + d.name
      + '\nEmail: ' + d.email + '\nNotes: ' + d.notes
      + (sel ? '\n\nSelector: ' + (sel.topic || 'custom') + ' as ' + sel.format : '')
  });
  return ok(d.ref);
}

function ok(ref) {
  return ContentService.createTextOutput(JSON.stringify({ ok: true, ref: ref }))
    .setMimeType(ContentService.MimeType.JSON);
}
