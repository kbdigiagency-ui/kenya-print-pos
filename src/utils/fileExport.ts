// File export utilities for CSV, PDF, and other formats

export interface ExportData {
  [key: string]: any;
}

/**
 * Convert data to CSV format and trigger download
 */
export const exportToCSV = (data: ExportData[], filename: string) => {
  if (!data.length) {
    throw new Error('No data to export');
  }

  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Header row
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle values that might contain commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    )
  ].join('\n');

  // Create blob and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Generate and download PDF content
 */
export const exportToPDF = (content: string, filename: string) => {
  // Simple PDF generation using HTML content
  const printWindow = window.open('', '_blank');
  
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #3B82F6;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #3B82F6;
            }
            .document-title {
              font-size: 20px;
              margin: 10px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .total-row {
              font-weight: bold;
              background-color: #f9f9f9;
            }
            .footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #ddd;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${content}
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()} | KB Digital Agency LTD</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Auto-print after a brief delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};

/**
 * Generate invoice PDF content
 */
export const generateInvoicePDF = (invoice: any) => {
  const itemsHTML = invoice.items.map((item: any) => `
    <tr>
      <td>${item.description}</td>
      <td style="text-align: center;">${item.quantity}</td>
      <td style="text-align: right;">KES ${item.rate.toLocaleString()}</td>
      <td style="text-align: right;">KES ${item.amount.toLocaleString()}</td>
    </tr>
  `).join('');

  const content = `
    <div class="header">
      <div class="company-name">KB Digital Agency LTD</div>
      <p>Nairobi, Kenya | +254722123456 | kbdigiagency@gmail.com</p>
      <div class="document-title">${invoice.type.toUpperCase()} #${invoice.id}</div>
    </div>
    
    <div style="display: flex; justify-content: space-between; margin: 30px 0;">
      <div>
        <h3>Bill To:</h3>
        <p><strong>${invoice.clientName}</strong></p>
        <p>${invoice.clientEmail}</p>
      </div>
      <div style="text-align: right;">
        <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString()}</p>
        ${invoice.dueDate ? `<p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>` : ''}
        <p><strong>Status:</strong> <span style="text-transform: uppercase; color: ${
          invoice.status === 'paid' ? '#10B981' : 
          invoice.status === 'overdue' ? '#EF4444' : '#F59E0B'
        };">${invoice.status}</span></p>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: center;">Quantity</th>
          <th style="text-align: right;">Rate</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
        <tr style="border-top: 2px solid #ddd;">
          <td colspan="3" style="text-align: right; font-weight: bold;">Subtotal:</td>
          <td style="text-align: right; font-weight: bold;">KES ${invoice.subtotal.toLocaleString()}</td>
        </tr>
        <tr>
          <td colspan="3" style="text-align: right; font-weight: bold;">VAT (16%):</td>
          <td style="text-align: right; font-weight: bold;">KES ${invoice.tax.toLocaleString()}</td>
        </tr>
        <tr class="total-row">
          <td colspan="3" style="text-align: right; font-size: 18px;">TOTAL:</td>
          <td style="text-align: right; font-size: 18px;">KES ${invoice.total.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>

    ${invoice.notes ? `
      <div style="margin: 30px 0;">
        <h3>Notes:</h3>
        <p>${invoice.notes}</p>
      </div>
    ` : ''}

    <div style="margin-top: 50px;">
      <p><strong>Payment Terms:</strong> Payment is due within 14 days of invoice date.</p>
      <p><strong>Bank Details:</strong> KB Digital Agency LTD - Equity Bank - Account: 1234567890</p>
    </div>
  `;

  return content;
};

/**
 * Generate report PDF content
 */
export const generateReportPDF = (reportData: any, reportType: string) => {
  const { stats, period } = reportData;
  
  const content = `
    <div class="header">
      <div class="company-name">KB Digital Agency LTD</div>
      <div class="document-title">${reportType} Report - ${period}</div>
      <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 30px 0;">
      ${stats.map((stat: any) => `
        <div style="border: 1px solid #ddd; padding: 15px; text-align: center; border-radius: 8px;">
          <h3 style="margin: 0; color: #666; font-size: 14px;">${stat.title}</h3>
          <p style="margin: 10px 0; font-size: 24px; font-weight: bold; color: #3B82F6;">${stat.value}</p>
          <p style="margin: 0; font-size: 12px; color: ${stat.trend === 'up' ? '#10B981' : '#EF4444'};">
            ${stat.change} ${stat.description}
          </p>
        </div>
      `).join('')}
    </div>

    <div style="margin: 40px 0;">
      <h2>Executive Summary</h2>
      <p>This report provides comprehensive insights into the business performance for the selected period.</p>
      <ul>
        <li><strong>Revenue Growth:</strong> Business shows positive growth trends across key metrics</li>
        <li><strong>Client Base:</strong> Active client engagement with increasing order volumes</li>
        <li><strong>Profitability:</strong> Healthy profit margins maintained throughout the period</li>
        <li><strong>Market Position:</strong> Strong performance in the branding and printing sector</li>
      </ul>
    </div>
  `;

  return content;
};

/**
 * Import CSV data
 */
export const importFromCSV = (file: File): Promise<ExportData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          reject(new Error('CSV file must contain header and at least one data row'));
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data: ExportData[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          const row: ExportData = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          data.push(row);
        }

        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse CSV file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Generate backup data
 */
export const generateBackup = (allData: { [key: string]: any[] }) => {
  const backup = {
    generatedAt: new Date().toISOString(),
    version: '1.0',
    data: allData
  };

  const backupContent = JSON.stringify(backup, null, 2);
  const blob = new Blob([backupContent], { type: 'application/json' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `kb-digital-backup-${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};