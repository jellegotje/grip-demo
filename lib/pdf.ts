import { AssessmentResults, OrganisatieContext } from './types';
import { DIMENSIES } from './questions';
import { bepaalVolwassenheidsniveau } from './scoring';

// Huisstijlkleuren Native Consulting (RGB)
const NAVY: [number, number, number] = [30, 58, 95]; // #1E3A5F
const GREEN: [number, number, number] = [91, 196, 160]; // #5BC4A0
const TEXT: [number, number, number] = [55, 65, 81]; // grijs voor bodytekst
const MUTED: [number, number, number] = [120, 130, 140];
const LINE: [number, number, number] = [225, 228, 232];

function scoreKleurRgb(score: number): [number, number, number] {
  if (score >= 3.5) return [22, 163, 74]; // groen
  if (score >= 2.5) return [217, 119, 6]; // oranje
  return [220, 38, 38]; // rood
}

interface AnalyseBlock {
  type: 'p' | 'bullet';
  text: string;
}

interface AnalyseSectie {
  title: string;
  blocks: AnalyseBlock[];
}

/**
 * Zet typografische Unicode-tekens om naar PDF-veilige varianten. De standaard
 * jsPDF-lettertypen ondersteunen alleen Latin-1; tekens daarbuiten (lange
 * streepjes, "slimme" aanhalingstekens, beletselteken, bullets) worden anders
 * als onleesbare tekens weergegeven.
 */
function saneerTekst(text: string): string {
  return text
    .replace(/[‘’‚‛]/g, "'") // ‘ ’ ‚ ‛ → '
    .replace(/[“”„‟]/g, '"') // “ ” „ ‟ → "
    .replace(/[–—―−]/g, '-') // – — ― − → -
    .replace(/…/g, '...') // … → ...
    .replace(/[•‣◦⁃]/g, '-') // • ‣ ◦ ⁃ → -
    .replace(/→/g, '->') // → → ->
    .replace(/ /g, ' ') // niet-afbreekbare spatie → spatie
    .replace(/­/g, ''); // zachte afbreekstreepjes verwijderen
}

/** Verwijder inline markdown-markeringen (**vet**, *cursief*) en saneer tekens. */
function stripInlineMd(text: string): string {
  return saneerTekst(text.replace(/\*\*/g, '').replace(/\*/g, '').trim());
}

/** Parse de markdown-analyse in secties met een titel en tekstblokken. */
function parseAnalyse(analyse: string): AnalyseSectie[] {
  const secties: AnalyseSectie[] = [];
  let huidig: AnalyseSectie | null = null;

  for (const rauw of analyse.split('\n')) {
    const regel = rauw.trim();
    if (!regel) continue;

    // Markdown horizontale lijnen (---, ***, ___) overslaan: we tekenen zelf
    // al een scheidingslijn vóór elke sectie.
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(regel)) continue;

    const titelMatch = regel.match(/^\*\*(.+?)\*\*:?\s*$/);
    if (titelMatch) {
      huidig = { title: saneerTekst(titelMatch[1].trim()), blocks: [] };
      secties.push(huidig);
      continue;
    }

    if (!huidig) {
      huidig = { title: '', blocks: [] };
      secties.push(huidig);
    }

    const bulletMatch = regel.match(/^[-*•]\s+(.*)$/);
    if (bulletMatch) {
      huidig.blocks.push({ type: 'bullet', text: stripInlineMd(bulletMatch[1]) });
    } else {
      huidig.blocks.push({ type: 'p', text: stripInlineMd(regel) });
    }
  }

  return secties;
}

/** Laad het logo als data-URL plus afmetingen (voor de juiste verhouding). */
async function laadLogo(): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const res = await fetch('/logo.png');
    if (!res.ok) return null;
    const blob = await res.blob();

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as string);
      fr.onerror = reject;
      fr.readAsDataURL(blob);
    });

    const afmetingen = await new Promise<{ w: number; h: number }>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = reject;
      img.src = dataUrl;
    });

    return { dataUrl, width: afmetingen.w, height: afmetingen.h };
  } catch {
    return null;
  }
}

interface PdfOpties {
  organisatie: OrganisatieContext;
  results: AssessmentResults;
  analyse: string;
}

export async function exporteerAnalysePdf({ organisatie, results, analyse }: PdfOpties): Promise<void> {
  const { dimensionScores, totalScore, maturityLevel } = results;

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  const bodemMarge = margin + 24; // ruimte voor de voettekst
  let y = margin;

  // Zorg dat er ruimte is voor een blok; voeg anders een pagina toe.
  function controleerRuimte(hoogte: number) {
    if (y + hoogte > pageH - bodemMarge) {
      doc.addPage();
      y = margin;
    }
  }

  function streep(kleur: [number, number, number] = LINE, dikte = 0.75) {
    doc.setDrawColor(kleur[0], kleur[1], kleur[2]);
    doc.setLineWidth(dikte);
    doc.line(margin, y, pageW - margin, y);
  }

  // 1. Logo
  const logo = await laadLogo();
  if (logo) {
    const logoW = 130;
    const logoH = logoW * (logo.height / logo.width);
    doc.addImage(logo.dataUrl, 'PNG', margin, y, logoW, logoH);
    y += logoH + 14;
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...NAVY);
    doc.text('Native Consulting', margin, y + 12);
    y += 30;
  }

  // Scheidingslijn onder de header
  streep(NAVY, 1.2);
  y += 22;

  // 2. Titel
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...NAVY);
  doc.text('Volwassenheidsmeting datakwaliteit', margin, y, { maxWidth: contentW });
  y += 24;

  // 3. Organisatiecontext + datum
  const datum = new Date().toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(...MUTED);
  doc.text(
    saneerTekst(
      `${organisatie.naam} · ${organisatie.type} · ${organisatie.medewerkers} medewerkers · ${datum}`
    ),
    margin,
    y,
    { maxWidth: contentW }
  );
  y += 26;

  // 4. Totaalscore
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(32);
  doc.setTextColor(...NAVY);
  doc.text(`${totalScore.toFixed(1)}`, margin, y);
  const scoreBreedte = doc.getTextWidth(`${totalScore.toFixed(1)}`);
  doc.setFontSize(13);
  doc.setTextColor(...MUTED);
  doc.text('/ 5.0', margin + scoreBreedte + 8, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...GREEN);
  doc.text(`Niveau: ${maturityLevel}`, margin + scoreBreedte + 56, y);
  y += 20;

  // 5. Dimensiescores
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  for (const code of ['D1', 'D2', 'D3', 'D4'] as const) {
    const dim = DIMENSIES.find((d) => d.code === code)!;
    const score = dimensionScores[code];
    const niveau = bepaalVolwassenheidsniveau(score);
    controleerRuimte(18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...TEXT);
    doc.text(`${dim.naam}`, margin, y);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...scoreKleurRgb(score));
    doc.text(`${score.toFixed(1)}`, margin + 200, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(`${niveau}`, margin + 240, y);
    y += 18;
  }
  y += 8;

  // 6. Analyse — elke sectie gescheiden door een streep
  const secties = parseAnalyse(analyse);
  for (const sectie of secties) {
    // Scheidingslijn vóór elke sectie
    controleerRuimte(40);
    streep();
    y += 18;

    if (sectie.title) {
      controleerRuimte(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(...NAVY);
      const titelRegels = doc.splitTextToSize(sectie.title, contentW);
      doc.text(titelRegels, margin, y);
      y += titelRegels.length * 16 + 6;
    }

    for (const blok of sectie.blocks) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10.5);
      doc.setTextColor(...TEXT);

      const isBullet = blok.type === 'bullet';
      const inspring = isBullet ? 16 : 0;
      const regels = doc.splitTextToSize(blok.text, contentW - inspring);
      const regelHoogte = 14;

      controleerRuimte(regels.length * regelHoogte + 4);

      if (isBullet) {
        // Bullet als getekende stip (glyph wordt niet betrouwbaar weergegeven).
        doc.setFillColor(...GREEN);
        doc.circle(margin + 4, y - 3, 2, 'F');
      }
      doc.text(regels, margin + inspring, y);
      y += regels.length * regelHoogte + 6;
    }
  }

  // 6b. AI-disclaimer onder de analyse
  controleerRuimte(36);
  streep();
  y += 16;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  const disclaimerRegels = doc.splitTextToSize(
    saneerTekst(
      'Deze analyse is gegenereerd met behulp van AI en kan fouten bevatten. Voor een uitgebreidere meting kunt u contact opnemen met Native Consulting.'
    ),
    contentW
  );
  doc.text(disclaimerRegels, margin, y);
  y += disclaimerRegels.length * 12 + 6;

  // 7. Voettekst op elke pagina
  const aantalPaginas = doc.getNumberOfPages();
  for (let p = 1; p <= aantalPaginas; p++) {
    doc.setPage(p);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.5);
    doc.line(margin, pageH - margin + 4, pageW - margin, pageH - margin + 4);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(
      'Gegenereerd met AI — Native Consulting',
      margin,
      pageH - margin + 16
    );
    doc.text(`${p} / ${aantalPaginas}`, pageW - margin, pageH - margin + 16, { align: 'right' });
  }

  // 8. Opslaan
  const veiligeNaam = organisatie.naam
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'rapport';
  doc.save(`gegevenskwaliteit-${veiligeNaam}.pdf`);
}
