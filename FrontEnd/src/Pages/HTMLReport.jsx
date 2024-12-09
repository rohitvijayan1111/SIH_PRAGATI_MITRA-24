const HTMLReport = ({ coverImageUrl, tableOfContents, sections }) => {
    const downloadHTMLReport = () => {
      const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comprehensive Report</title>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
        <style>
            body {
              font-family: 'Arial', sans-serif;
              font-size: 14px;
              color: #333;
              line-height: 1.6;
              margin: 0;
              padding: 20px;
              background-color: #f9f9f9;
              scroll-behavior: smooth;
            }
            .page {
              max-width: 900px;
              margin: 0 auto;
              padding: 20px;
              background: #fff;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .header {
              font-size: 24px;
              text-align: center;
              color: #164863;
              margin-bottom: 20px;
            }
            .section-title {
              font-size: 20px;
              color: #164863;
              border-bottom: 2px solid #164863;
              padding-bottom: 5px;
              margin-top: 20px;
            }
            .image-container {
              text-align: center;
              margin: 20px 0;
            }
            .image-container img {
              max-width: 100%;
              max-height: 400px;
              object-fit: contain;
            }
            .table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .table th, .table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .table th {
              background-color: #164863;
              color: white;
            }
            .table tr:nth-child(even) {
              background-color: #f2f2f2;
            }
            .chart-container {
              width: 100%;
              max-width: 600px;
              margin: 20px auto;
              text-align: center;
            }
            .toc-link {
              color: #164863;
              text-decoration: none;
              cursor: pointer;
            }
            .toc-link:hover {
              text-decoration: underline;
            }
          </style>
      </head>
      <body>
        ${coverImageUrl ? `
          <div class="page cover-page">
            <img src="${coverImageUrl}" style="max-width: 100%; height: auto;">
          </div>
        ` : ''}

        <div class="page">
          <h2 class="header">Table of Contents</h2>
          <table class="table">
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              ${tableOfContents.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <a href="#section-${item.title.replace(/\\s+/g, '-')}" class="toc-link">
                      ${item.title}
                    </a>
                  </td>
                </tr>
                ${item.subItems ? item.subItems.map((subItem, subIndex) => `
                  <tr>
                    <td></td>
                    <td>
                      <a href="#detail-${subItem.title.replace(/\\s+/g, '-')}" class="toc-link">
                        ${String.fromCharCode(97 + subIndex)}) ${subItem.title}
                      </a>
                    </td>
                  </tr>
                `).join('') : ''}
              `).join('')}
            </tbody>
          </table>
        </div>

        ${sections.map((section) => `
          <div class="page">
            <h2 class="header" id="section-${section.title.replace(/\\s+/g, '-')}">
              ${section.title}
            </h2>
            
            ${section.details.map((detail) => `
              <div>
                <h3 class="section-title" id="detail-${detail.title.replace(/\\s+/g, '-')}">
                  ${detail.title}
                </h3>
                <p>${detail.intro || ''}</p>
                
                ${detail.graphdata ? `
                  <div class="chart-container">
                    <canvas id="chart-${detail.title.replace(/\\s+/g, '-')}"></canvas>
                  </div>
                ` : ''}

                ${detail.images && detail.images.length > 0 ? `
                  <div class="image-container">
                    ${detail.images.map((image) => `
                      <img src="http://localhost:3000/${image.url}" alt="${image.description || ''}">
                      ${image.description ? `<p>${image.description}</p>` : ''}
                    `).join('')}
                  </div>
                ` : ''}

                ${detail.data && detail.data.length > 0 ? `
                  <table class="table">
                    <thead>
                      <tr>
                        ${Object.keys(detail.data[0]).map(key => `<th>${key}</th>`).join('')}
                      </tr>
                    </thead>
                    <tbody>
                      ${detail.data.map(row => `
                        <tr>
                          ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                ` : ''}

                ${detail.summary ? `
                  <h4>Summary</h4>
                  <p>${detail.summary}</p>
                ` : ''}
                ${detail.youtubeUrl ? `
  <div class="video-container" style="
    width: 100%;
    max-width: 700px;
    margin: 20px auto;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  ">
    <div style="
      position: relative;
      padding-bottom: 56.25%; /* 16:9 aspect ratio */
      height: 0;
      overflow: hidden;
    ">
      <iframe 
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        "
        src="${detail.youtubeUrl.replace('watch?v=', 'embed/') + '?rel=0&modestbranding=1'}" 
        title="YouTube Video: ${detail.title}" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen
      ></iframe>
    </div>
    <div style="
      background-color: #f4f4f4;
      padding: 10px;
      text-align: center;
      font-size: 14px;
      color: #333;
    ">
      <strong>Recommended Video:</strong> ${detail.title || 'Related Content'}
    </div>
  </div>
` : ''}
              </div>
            `).join('')}
          </div>
        `).join('')}

        <script>
          ${sections.map((section) => 
    section.details.map((detail) => 
      detail.graphdata ? `
        (function() {
          const ctx = document.getElementById('chart-${detail.title.replace(/\\s+/g, '-')}');
          const graphData = ${JSON.stringify(detail.graphdata).replace(/</g, '\\u003c')};
          
          const getColorForDataset = (index, alpha = 0.9) => {
            const COLORS = [
              "#FF6666", "#FFB366", "#FF9933", "#80E6B3", 
              "#66CCCC", "#9999FF", "#FF66FF", "#66FF66", 
              "#FFB300", "#FF80AA"
            ];
            const colors = COLORS.map(color => {
              const [r, g, b] = color.match(/\\w\\w/g).map(hex => parseInt(hex, 16));
              return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
            });
            return colors[index % colors.length];
          };

          // Check if it's a stacked bar chart
          const isStackedChart = graphData.data[0] && graphData.data[0].values;

          const chartData = isStackedChart 
            ? {
                labels: graphData.data.map(item => item.name),
                datasets: Object.keys(graphData.data[0].values).map((key, index) => ({
                  label: key,
                  data : graphData.data.map(item => item.values[key]),
                  backgroundColor: getColorForDataset(index),
                  borderColor: getColorForDataset(index, 1),
                  borderWidth: 1,
                }))
              }
            : {
                labels: graphData.data.map(item => item.name),
                datasets: [{
                  label: graphData.config_name || 'Data',
                  data: graphData.data.map(item => item.value),
                  backgroundColor: graphData.data.map((_, index) => getColorForDataset(index)),
                  borderColor: graphData.data.map((_, index) => getColorForDataset(index, 1)),
                  borderWidth: 1
                }]
              };

          const chartOptions = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: graphData.title || 'Chart'
              }
            },
            scales: isStackedChart 
              ? {
                  x: { stacked: true },
                  y: { stacked: true }
                }
              : {}
          };

          new Chart(ctx, {
            type: graphData.graph_type,
            data: chartData,
            options: chartOptions
          });
        })();
      ` : ''
    ).join('')
  ).join('')}
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'comprehensive_report.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={downloadHTMLReport}>Download HTML Report</button>
    </div>
  );
};

export default HTMLReport;