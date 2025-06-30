import { useCallback } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TimelineCard, CardGroup } from '../types';
import { format, parseISO } from 'date-fns';

export const useExport = () => {
  const formatTimeInfo = (card: TimelineCard) => {
    const { timeInfo } = card;
    
    switch (timeInfo.type) {
      case 'absolute':
        if (timeInfo.absoluteDate) {
          const date = parseISO(timeInfo.absoluteDate);
          const timeStr = timeInfo.absoluteTime ? ` at ${timeInfo.absoluteTime}` : '';
          return `${format(date, 'MMM dd, yyyy')}${timeStr}`;
        }
        return 'No date set';
      
      case 'relative':
        return `${timeInfo.relativeValue} ${timeInfo.relativeUnit} ${timeInfo.relativeReference ? `after ${timeInfo.relativeReference}` : 'later'}`;
      
      case 'story':
        return `${timeInfo.storyUnit} ${timeInfo.storyValue}`;
      
      default:
        return 'Unknown time';
    }
  };

  const exportAsJSON = useCallback((cards: TimelineCard[], groups: CardGroup[]) => {
    const data = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      cards: cards.map(card => ({
        ...card,
        timeFormatted: formatTimeInfo(card)
      })),
      groups,
      metadata: {
        totalCards: cards.length,
        totalGroups: groups.length,
        exportedBy: 'Story Timeline System'
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `story-timeline-${format(new Date(), 'yyyy-MM-dd-HHmm')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportAsTXT = useCallback((cards: TimelineCard[], groups: CardGroup[]) => {
    let content = `STORY TIMELINE EXPORT\n`;
    content += `Generated: ${format(new Date(), 'PPpp')}\n`;
    content += `Total Cards: ${cards.length}\n`;
    content += `Total Groups: ${groups.length}\n`;
    content += `\n${'='.repeat(60)}\n\n`;

    // Export by groups
    groups.forEach(group => {
      const groupCards = cards.filter(card => group.cardIds.includes(card.id));
      
      content += `GROUP: ${group.title.toUpperCase()}\n`;
      content += `Type: ${group.type}\n`;
      content += `Description: ${group.description}\n`;
      content += `Cards: ${groupCards.length}\n`;
      content += `${'-'.repeat(40)}\n\n`;

      groupCards.forEach((card, index) => {
        content += `${index + 1}. ${card.title}\n`;
        content += `   Time: ${formatTimeInfo(card)}\n`;
        content += `   Status: ${card.metadata.status}\n`;
        
        if (card.metadata.pointOfView) {
          content += `   POV: ${card.metadata.pointOfView}\n`;
        }
        
        if (card.metadata.location) {
          content += `   Location: ${card.metadata.location}\n`;
        }
        
        if (card.metadata.tags.length > 0) {
          content += `   Tags: ${card.metadata.tags.join(', ')}\n`;
        }
        
        content += `   Description: ${card.description}\n`;
        
        if (card.content) {
          content += `   Content: ${card.content}\n`;
        }
        
        content += `\n`;
      });
      
      content += `\n`;
    });

    // Export ungrouped cards
    const ungroupedCards = cards.filter(card => !card.parentId);
    if (ungroupedCards.length > 0) {
      content += `UNGROUPED CARDS\n`;
      content += `${'-'.repeat(40)}\n\n`;

      ungroupedCards.forEach((card, index) => {
        content += `${index + 1}. ${card.title}\n`;
        content += `   Time: ${formatTimeInfo(card)}\n`;
        content += `   Status: ${card.metadata.status}\n`;
        
        if (card.metadata.pointOfView) {
          content += `   POV: ${card.metadata.pointOfView}\n`;
        }
        
        if (card.metadata.location) {
          content += `   Location: ${card.metadata.location}\n`;
        }
        
        if (card.metadata.tags.length > 0) {
          content += `   Tags: ${card.metadata.tags.join(', ')}\n`;
        }
        
        content += `   Description: ${card.description}\n`;
        
        if (card.content) {
          content += `   Content: ${card.content}\n`;
        }
        
        content += `\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `story-timeline-${format(new Date(), 'yyyy-MM-dd-HHmm')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportAsPDF = useCallback(async (cards: TimelineCard[], groups: CardGroup[]) => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * fontSize * 0.4);
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Story Timeline Export', margin, yPosition);
    yPosition += 15;

    // Metadata
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    yPosition = addText(`Generated: ${format(new Date(), 'PPpp')}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Total Cards: ${cards.length}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition = addText(`Total Groups: ${groups.length}`, margin, yPosition, pageWidth - 2 * margin);
    yPosition += 10;

    // Export by groups
    for (const group of groups) {
      const groupCards = cards.filter(card => group.cardIds.includes(card.id));
      
      checkNewPage(30);
      
      // Group header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      yPosition = addText(`${group.title}`, margin, yPosition, pageWidth - 2 * margin, 16);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      yPosition = addText(`Type: ${group.type} | Cards: ${groupCards.length}`, margin, yPosition, pageWidth - 2 * margin);
      yPosition = addText(`${group.description}`, margin, yPosition, pageWidth - 2 * margin);
      yPosition += 5;

      // Group cards
      for (let i = 0; i < groupCards.length; i++) {
        const card = groupCards[i];
        
        checkNewPage(40);
        
        // Card title
        pdf.setFont('helvetica', 'bold');
        yPosition = addText(`${i + 1}. ${card.title}`, margin + 10, yPosition, pageWidth - 2 * margin - 10);
        
        pdf.setFont('helvetica', 'normal');
        yPosition = addText(`Time: ${formatTimeInfo(card)}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        yPosition = addText(`Status: ${card.metadata.status}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        
        if (card.metadata.pointOfView) {
          yPosition = addText(`POV: ${card.metadata.pointOfView}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        }
        
        if (card.metadata.location) {
          yPosition = addText(`Location: ${card.metadata.location}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        }
        
        if (card.metadata.tags.length > 0) {
          yPosition = addText(`Tags: ${card.metadata.tags.join(', ')}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        }
        
        yPosition = addText(`Description: ${card.description}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        
        if (card.content) {
          yPosition = addText(`Content: ${card.content}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        }
        
        yPosition += 5;
      }
      
      yPosition += 10;
    }

    // Export ungrouped cards
    const ungroupedCards = cards.filter(card => !card.parentId);
    if (ungroupedCards.length > 0) {
      checkNewPage(30);
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      yPosition = addText('Ungrouped Cards', margin, yPosition, pageWidth - 2 * margin, 16);
      yPosition += 5;

      for (let i = 0; i < ungroupedCards.length; i++) {
        const card = ungroupedCards[i];
        
        checkNewPage(40);
        
        pdf.setFont('helvetica', 'bold');
        yPosition = addText(`${i + 1}. ${card.title}`, margin + 10, yPosition, pageWidth - 2 * margin - 10);
        
        pdf.setFont('helvetica', 'normal');
        yPosition = addText(`Time: ${formatTimeInfo(card)}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        yPosition = addText(`Status: ${card.metadata.status}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        
        if (card.metadata.pointOfView) {
          yPosition = addText(`POV: ${card.metadata.pointOfView}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        }
        
        if (card.metadata.location) {
          yPosition = addText(`Location: ${card.metadata.location}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        }
        
        if (card.metadata.tags.length > 0) {
          yPosition = addText(`Tags: ${card.metadata.tags.join(', ')}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        }
        
        yPosition = addText(`Description: ${card.description}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        
        if (card.content) {
          yPosition = addText(`Content: ${card.content}`, margin + 15, yPosition, pageWidth - 2 * margin - 15);
        }
        
        yPosition += 5;
      }
    }

    pdf.save(`story-timeline-${format(new Date(), 'yyyy-MM-dd-HHmm')}.pdf`);
  }, []);

  return {
    exportAsJSON,
    exportAsTXT,
    exportAsPDF,
  };
};