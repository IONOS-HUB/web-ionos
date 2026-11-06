// Plantilla de correo de IONOS HUB: copia de referencia del Code node «Armar Correo» del subflujo de n8n
// «Correo · Plantilla de marca» (id B5Rhj7mPIQW8kola). Si cambias el diseño, cámbialo aquí y en n8n.
// Sin dependencias: tablas y estilos en línea para Gmail, Outlook y Apple Mail. Ver README.md de esta carpeta.

const C = {
  cobalt: '#0e5fcb', cobaltDeep: '#0a47a0', cobaltInk: '#083a7a', glow: '#3f86e6',
  canvas: '#ffffff', ice: '#e9f1fc', ice2: '#d7e6fa', ice3: '#f4f8fe',
  ink: '#0f1722', ink2: '#33415a', ink3: '#5b6b85', line: '#d4deed', lineSoft: '#e6edf7',
  night: '#0b1b33', nightText: '#b8cbe8',
};
const F = "'Bricolage Grotesque','Segoe UI',Helvetica,Arial,sans-serif";
const LOGO = 'https://ionoshub.net/imgs/logo.png';
const WEB = 'https://ionoshub.net';
const WA = 'https://wa.me/593992249152';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// Texto plano a párrafos: respeta los saltos de línea de los textos que antes se mandaban "tal cual".
const parrafos = (t) => String(t ?? '').trim().split(/\n{2,}/).map((p) => '<p style="margin:0 0 14px;font-family:' + F + ';font-size:15px;line-height:1.6;color:' + C.ink2 + '">' + esc(p).replace(/\n/g, '<br>') + '</p>').join('');

// HTML "semántico" (h2, h3, p, ul, li, table, th, td, a, b, small) al estilo de la marca.
function estilizar(html) {
  // Estilo de marca primero y, si la etiqueta ya traía `style`, ese va después y gana (pero la letra ya quedó puesta).
  const T = (tag, base) => (m, a) => {
    a = a || '';
    // Del estilo viejo se descarta la letra (Arial, etc.): la marca usa una sola familia.
    const viejo = ((a.match(/\sstyle="([^"]*)"/i) || [])[1] || '').replace(/font-family:[^;"]*;?/gi, '');
    return '<' + tag + a.replace(/\sstyle="[^"]*"/gi, '') + ' style="' + base + viejo + '">';
  };
  const P = 'margin:0 0 14px;font-family:' + F + ';font-size:15px;line-height:1.6;color:' + C.ink2 + ';';
  const TD = 'padding:10px 12px;border-bottom:1px solid ' + C.lineSoft + ';font-family:' + F + ';font-size:14px;line-height:1.45;color:' + C.ink2 + ';vertical-align:top;';
  // Azules y grises sueltos de correos viejos pasan a la paleta de la marca.
  const PALETA = { '#2563eb': C.cobalt, '#1d4ed8': C.cobalt, '#006dbd': C.cobalt, '#1a73e8': C.cobalt, '#004d85': C.cobaltDeep, '#eff6ff': C.ice, '#bee1f8': C.ice, '#666': C.ink3, '#666666': C.ink3, '#888': C.ink3, '#888888': C.ink3, '#999': C.ink3, '#333': C.ink2, '#333333': C.ink2, '#f1f5f9': C.ice3, '#f8fafc': C.ice3 };
  html = String(html ?? '').replace(/#[0-9a-fA-F]{3,6}\b/g, (h) => PALETA[h.toLowerCase()] || h);
  return html
    .replace(/<h1(\s[^>]*)?>/gi, T('h2', 'margin:28px 0 10px;font-family:' + F + ';font-size:20px;line-height:1.25;font-weight:600;letter-spacing:-0.02em;color:' + C.ink + ';')).replace(/<\/h1>/gi, '</h2>')
    .replace(/<h2(\s[^>]*)?>/gi, T('h2', 'margin:28px 0 10px;font-family:' + F + ';font-size:20px;line-height:1.25;font-weight:600;letter-spacing:-0.02em;color:' + C.ink + ';'))
    .replace(/<h3(\s[^>]*)?>/gi, T('h3', 'margin:26px 0 10px;font-family:' + F + ';font-size:17px;line-height:1.3;font-weight:600;letter-spacing:-0.015em;color:' + C.ink + ';'))
    .replace(/<h4(\s[^>]*)?>/gi, T('h4', 'margin:20px 0 8px;font-family:' + F + ';font-size:15px;line-height:1.35;font-weight:600;color:' + C.ink + ';'))
    .replace(/<p(\s[^>]*)?>/gi, T('p', P))
    .replace(/<div(\s[^>]*)?>/gi, T('div', 'font-family:' + F + ';'))
    .replace(/<span(\s[^>]*)?>/gi, T('span', 'font-family:' + F + ';'))
    .replace(/<ul(\s[^>]*)?>/gi, T('ul', 'margin:0 0 16px;padding:0 0 0 20px;'))
    .replace(/<ol(\s[^>]*)?>/gi, T('ol', 'margin:0 0 16px;padding:0 0 0 20px;'))
    .replace(/<li(\s[^>]*)?>/gi, T('li', 'margin:0 0 8px;font-family:' + F + ';font-size:15px;line-height:1.55;color:' + C.ink2 + ';'))
    .replace(/<table(\s[^>]*)?>/gi, (m, a) => '<table' + String(a || '').replace(/\s(style|width|cellpadding|cellspacing|border)="[^"]*"/gi, '') + ' role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;width:100%;margin:0 0 18px;border:1px solid ' + C.line + ';border-radius:14px;overflow:hidden;">')
    .replace(/<th(\s[^>]*)?>/gi, (m, a) => { a = a || ''; const al = (a.match(/align="(\w+)"/i) || [])[1] || 'left'; return '<th' + a.replace(/\s(align|style)="[^"]*"/gi, '') + ' align="' + al + '" style="padding:10px 12px;background:' + C.ice3 + ';border-bottom:1px solid ' + C.line + ';font-family:' + F + ';font-size:11px;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;color:' + C.ink3 + ';text-align:' + al + ';">'; })
    .replace(/<td(\s[^>]*)?>/gi, (m, a) => { a = a || ''; const al = (a.match(/align="(\w+)"/i) || [])[1] || (a.match(/text-align:\s*(\w+)/i) || [])[1]; return '<td' + a.replace(/\sstyle="[^"]*"/gi, '') + ' style="' + TD + (al ? 'text-align:' + al + ';' : '') + '">'; })
    .replace(/<a\s([^>]*?)>/gi, (m, a) => '<a ' + a.replace(/\sstyle="[^"]*"/gi, '') + ' style="color:' + C.cobalt + ';font-weight:600;text-decoration:underline;">')
    .replace(/<b>/gi, '<b style="color:' + C.ink + ';font-weight:600;">')
    .replace(/<strong>/gi, '<strong style="color:' + C.ink + ';font-weight:600;">');
}

const boton = (texto, url, sec) => '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 18px;"><tr><td style="border-radius:999px;background:' + (sec ? C.canvas : C.cobalt) + ';' + (sec ? 'border:1px solid ' + C.line + ';' : '') + '">'
  + '<a href="' + esc(url) + '" style="display:inline-block;padding:13px 26px;font-family:' + F + ';font-size:15px;font-weight:600;color:' + (sec ? C.cobaltInk : '#ffffff') + ';text-decoration:none;border-radius:999px;">' + esc(texto) + '</a></td></tr></table>';

const chip = (texto, url) => '<a href="' + esc(url) + '" style="display:inline-block;margin:6px 6px 0 0;padding:5px 12px;border-radius:999px;background:' + C.ice + ';font-family:' + F + ';font-size:12.5px;font-weight:600;color:' + C.cobaltInk + ';text-decoration:none;">' + esc(texto) + '</a>';

function bloque(b) {
  if (!b) return '';
  const t = b.tipo || 'texto';
  if (t === 'texto') return b.html ? estilizar(b.html) : parrafos(b.texto);
  if (t === 'seccion') return '<h3 style="margin:30px 0 12px;font-family:' + F + ';font-size:17px;line-height:1.3;font-weight:600;letter-spacing:-0.015em;color:' + C.ink + '">' + esc(b.titulo) + (b.contador != null ? ' <span style="display:inline-block;margin-left:6px;padding:2px 9px;border-radius:999px;background:' + C.ice + ';font-size:12px;font-weight:600;color:' + C.cobaltInk + ';vertical-align:2px;">' + esc(b.contador) + '</span>' : '') + '</h3>' + (b.nota ? '<p style="margin:-6px 0 12px;font-family:' + F + ';font-size:13px;line-height:1.5;color:' + C.ink3 + '">' + esc(b.nota) + '</p>' : '');
  if (t === 'kpis') {
    const items = (b.items || []).slice(0, 4);
    const w = items.length > 1 ? Math.floor((100 - 2 * (items.length - 1)) / items.length) : 100;
    // Cada tarjeta pinta su celda: así todas quedan de la misma altura aunque una etiqueta ocupe dos líneas.
    return '<table class="k" role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 18px;border-collapse:separate;border-spacing:0;"><tr>' + items.map((k, i) =>
      (i ? '<td class="kg" width="2%" style="width:2%;font-size:0;line-height:0;">&nbsp;</td>' : '')
      + '<td class="kb" width="' + w + '%" style="padding:16px 14px;vertical-align:top;border-radius:16px;background:' + (k.destacado ? C.cobalt : C.ice3) + ';border:1px solid ' + (k.destacado ? C.cobalt : C.lineSoft) + ';">'
      + '<div class="kv" style="font-family:' + F + ';font-size:28px;line-height:1;font-weight:600;letter-spacing:-0.03em;font-variant-numeric:tabular-nums;color:' + (k.destacado ? '#ffffff' : C.ink) + ';">' + esc(k.valor) + '</div>'
      + '<div class="ke" style="margin-top:8px;font-family:' + F + ';font-size:12.5px;line-height:1.35;font-weight:600;color:' + (k.destacado ? C.ice : C.ink2) + ';">' + esc(k.etiqueta) + '</div>'
      + (k.nota ? '<div style="margin-top:4px;font-family:' + F + ';font-size:11.5px;line-height:1.35;color:' + (k.destacado ? C.ice : C.ink3) + ';">' + esc(k.nota) + '</div>' : '')
      + '</td>').join('') + '</tr></table>';
  }
  if (t === 'tabla') {
    const al = b.alinear || [];
    const th = (b.columnas || []).map((c, i) => '<th align="' + (al[i] || 'left') + '">' + esc(c) + '</th>').join('');
    const tr = (b.filas || []).map((f) => '<tr>' + f.map((v, i) => '<td align="' + (al[i] || 'left') + '"' + (i ? ' class="n"' : '') + '>' + (typeof v === 'object' && v && v.html != null ? v.html : esc(v)) + '</td>').join('') + '</tr>').join('');
    return estilizar('<table>' + (th ? '<tr>' + th + '</tr>' : '') + tr + '</table>').replace(/class="n" style="/g, 'style="font-variant-numeric:tabular-nums;') + (b.nota ? '<p style="margin:-8px 0 16px;font-family:' + F + ';font-size:12.5px;line-height:1.5;color:' + C.ink3 + '">' + esc(b.nota) + '</p>' : '');
  }
  if (t === 'lista') {
    const items = b.items || [];
    if (!items.length) return b.vacio ? '<p style="margin:0 0 14px;font-family:' + F + ';font-size:14px;color:' + C.ink3 + '">' + esc(b.vacio) + '</p>' : '';
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;border:1px solid ' + C.line + ';border-radius:16px;border-collapse:separate;border-spacing:0;">' + items.map((it, i) =>
      '<tr><td style="padding:14px 16px;' + (i ? 'border-top:1px solid ' + C.lineSoft + ';' : '') + '">'
      + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="vertical-align:top;">'
      + '<div style="font-family:' + F + ';font-size:15px;line-height:1.35;font-weight:600;color:' + C.ink + ';">' + esc(it.titulo) + '</div>'
      + (it.detalle ? '<div style="margin-top:4px;font-family:' + F + ';font-size:13.5px;line-height:1.5;color:' + C.ink2 + ';">' + (it.detalle_html != null ? it.detalle_html : esc(it.detalle)) + '</div>' : '')
      + ((it.enlaces || []).length ? '<div style="margin-top:4px;">' + it.enlaces.filter((e) => e && e.url).map((e) => chip(e.texto, e.url)).join('') + '</div>' : '')
      + '</td>' + (it.meta ? '<td style="vertical-align:top;padding-left:12px;white-space:nowrap;text-align:right;font-family:' + F + ';font-size:12.5px;font-weight:600;font-variant-numeric:tabular-nums;color:' + C.cobaltInk + ';">' + esc(it.meta) + '</td>' : '')
      + '</tr></table></td></tr>').join('') + '</table>';
  }
  if (t === 'aviso') {
    const al = b.nivel === 'alerta';
    return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr><td style="padding:14px 16px;border-radius:14px;background:' + (al ? '#fdecec' : C.ice) + ';border:1px solid ' + (al ? '#f5c2c2' : C.ice2) + ';font-family:' + F + ';font-size:14px;line-height:1.55;color:' + (al ? '#8a1c1c' : C.cobaltInk) + ';">'
      + (b.titulo ? '<div style="font-weight:600;margin-bottom:4px;">' + esc(b.titulo) + '</div>' : '') + (b.html != null ? b.html : esc(b.texto).replace(/\n/g, '<br>')) + '</td></tr></table>';
  }
  if (t === 'nota') return '<p style="margin:0 0 12px;font-family:' + F + ';font-size:13px;line-height:1.55;color:' + C.ink3 + ';">' + (b.html != null ? b.html : esc(b.texto).replace(/\n/g, '<br>')) + '</p>';
  if (t === 'boton') return boton(b.texto, b.url, b.secundario);
  if (t === 'codigo') return '<pre style="margin:0 0 18px;padding:14px 16px;border-radius:14px;background:' + C.night + ';color:' + C.nightText + ';font-family:Menlo,Consolas,monospace;font-size:12.5px;line-height:1.5;white-space:pre-wrap;word-break:break-word;">' + esc(b.texto) + '</pre>';
  if (t === 'separador') return '<div style="height:1px;margin:24px 0;background:' + C.lineSoft + ';line-height:1px;font-size:1px;">&nbsp;</div>';
  return '';
}

function render(d) {
  const cliente = d.tono === 'cliente';
  const cuerpo = (Array.isArray(d.bloques) && d.bloques.length ? d.bloques.map(bloque).join('') : '') + (d.html ? estilizar(d.html) : '') + (d.texto ? parrafos(d.texto) : '')
    + (d.boton && d.boton.url ? boton(d.boton.texto || 'Abrir', d.boton.url) : '');
  const pre = esc(d.preheader || '') + '&nbsp;&zwnj;'.repeat(60);
  const pieCliente = '<p style="margin:0 0 10px;font-family:' + F + ';font-size:13px;line-height:1.55;color:' + C.ink2 + ';"><b style="color:' + C.ink + ';font-weight:600;">IONOS HUB</b> · De datos a resultados<br>Ibarra, Imbabura · Ecuador</p>'
    + '<p style="margin:0 0 12px;">' + chip('ionoshub.net', WEB) + chip('WhatsApp 099 224 9152', WA) + chip('Instagram', 'https://www.instagram.com/ionoshub') + chip('LinkedIn', 'https://linkedin.com/company/ionoshub') + '</p>'
    + '<p style="margin:0;font-family:' + F + ';font-size:11.5px;line-height:1.5;color:' + C.ink3 + ';">Recibes este correo porque nos escribiste o agendaste con IONOS HUB. ' + '<a href="' + WEB + '/politica-de-privacidad" style="color:' + C.ink3 + ';text-decoration:underline;">Política de privacidad</a>.</p>';
  const pieInterno = '<p style="margin:0;font-family:' + F + ';font-size:12px;line-height:1.55;color:' + C.ink3 + ';">Correo automático de n8n' + (d.flujo ? ' · <b style="color:' + C.ink2 + ';font-weight:600;">' + esc(d.flujo) + '</b>' : '') + '. Solo para el equipo de IONOS HUB.</p>';
  return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">'
    + '<title>' + esc(d.asunto) + '</title>'
    + '<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..700&display=swap" rel="stylesheet">'
    + '<style>@media (max-width:620px){.c{padding-left:20px!important;padding-right:20px!important}.t{font-size:24px!important}.k td.kb{padding:12px 10px!important}.k div.kv{font-size:22px!important}.k div.ke{font-size:11.5px!important}}</style></head>'
    + '<body style="margin:0;padding:0;background:' + C.ice3 + ';-webkit-text-size-adjust:100%;">'
    + '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' + pre + '</div>'
    + '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C.ice3 + ';"><tr><td align="center" style="padding:28px 12px;">'
    + '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:' + C.canvas + ';border:1px solid ' + C.line + ';border-radius:24px;border-collapse:separate;overflow:hidden;">'
    // Cabecera: logo sobre blanco y etiqueta en píldora.
    + '<tr><td class="c" style="padding:22px 32px 18px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>'
    + '<td style="vertical-align:middle;"><a href="' + WEB + '" style="text-decoration:none;"><img src="' + LOGO + '" width="132" height="40" alt="IONOS HUB" style="display:block;border:0;width:132px;height:auto;"></a></td>'
    + (d.etiqueta ? '<td align="right" style="vertical-align:middle;"><span style="display:inline-block;padding:5px 12px;border-radius:999px;background:' + C.ice + ';font-family:' + F + ';font-size:11px;letter-spacing:0.06em;text-transform:uppercase;font-weight:600;color:' + C.cobaltInk + ';">' + esc(d.etiqueta) + '</span></td>' : '')
    + '</tr></table></td></tr>'
    // Campo cobalto con el título.
    + (d.titulo ? '<tr><td style="padding:0 12px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + C.cobalt + ';border-radius:18px;border-collapse:separate;"><tr><td class="c" style="padding:28px 24px 26px;">'
      + '<div class="t" style="font-family:' + F + ';font-size:28px;line-height:1.1;font-weight:600;letter-spacing:-0.03em;color:#ffffff;">' + esc(d.titulo) + '</div>'
      + (d.subtitulo ? '<div style="margin-top:10px;font-family:' + F + ';font-size:15px;line-height:1.5;color:' + C.ice + ';">' + esc(d.subtitulo) + '</div>' : '')
      + '</td></tr></table></td></tr>' : '')
    + '<tr><td class="c" style="padding:26px 32px 12px;">' + cuerpo + '</td></tr>'
    + '<tr><td class="c" style="padding:20px 32px 24px;background:' + C.ice3 + ';border-top:1px solid ' + C.lineSoft + ';">' + (cliente ? pieCliente : pieInterno) + '</td></tr>'
    + '</table></td></tr></table></body></html>';
}

if (typeof module !== 'undefined') module.exports = { render, bloque, estilizar };
