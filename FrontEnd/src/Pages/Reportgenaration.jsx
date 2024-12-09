import React, { useState,useEffect} from 'react';
import QRCode from 'qrcode';
import { useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, Checkbox, TextField } from '@mui/material';
import { Backdrop, CircularProgress } from '@mui/material';
import { PDFDocument,StandardFonts,rgb } from "pdf-lib";
import html2pdf from 'html2pdf.js';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { Paper, Table, TableBody, TableContainer,
  TableCell, 
  TableHead, 
  TableRow,
  ButtonGroup,
  Typography,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Popover,
  Chip
} from '@mui/material';
import jsPDF from 'jspdf';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Grid,
  Box,
  Button
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import styled from 'styled-components';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import axios from 'axios';
import { StyleSheet, Document, Page, Text, View,PDFDownloadLink,Image,pdf} from '@react-pdf/renderer';
import { Bar, Pie,Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; 
import 'chartjs-plugin-datalabels';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(ChartDataLabels);

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// Register the necessary components

import html2canvas from 'html2canvas';
import ChartJsImage from 'chartjs-to-image';
import { getTokenData } from './authUtils';
import HTMLReport from './HTMLReport';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


const sections = [
  { title: 'Message from Management', details: ["Chairperson's Message", "Principal's Message"] },

  { title: 'Curricular Design and Academic Performances', details: [
    'List of Courses Offered',
    'Overall and Department-wise Faculty Count and Faculty-Student Ratios',
     'Placement Summary',
    //'Overall Pass and Fail Percentage',
    'Department-wise Pass and Fail Percentage',
    'Average CGPA of Students',
    'Graduation Rate of College',
    'Guest Lectures Organized',
    'Industrial Visits Organized',
   // 'University Rank Holders'
  ]},

  {title: 'Department of IT',details:[
    'IT List of Faculties',
    'Student Faculty ratio',
     'IT Students Achievements',
     'IT Faculty Achievements',
     'IT Placement details',
     'IT GuestLectures',
     'IT Industrial Visits'
     //'IT Faculty Achievements',
    // 'List of Ongoing Research Projects',
    // 'List of Journal Papers Published',
    // 'List of Patents Grants',
    // 'Training Programmes Offered'
  ]},

  {
    title:'Faculty Achievement',
    details:[

      'List of Faculties Department-wise',
      'Awards Received',
      'Research Works Projects and Book Publications',
      'Conference details',
      // 'Advanced Degree / Certifications',
      // 'Leadership Roles',
      // 'Public Lectures',
      'Overall Performance'
    ]
  },
  {
    title:'Student Achievements',
    details:[
      'List of Students Department-wise',
      // 'Top Performers in Academics',
      // 'Awards Received by Students',
      // 'Scholarships Received',
      // 'Competition Wins',
      // 'Internships',
      // 'Projects'
      'Paper Publications',
      'Hackathons',
      'Patents',
      'Symposiums',
      'Overall Performance',
    ]
  }
  ,{
    title:'Financial Statements',
    details:[
      'Sources of Income',
      'Expense statements',
      'Salary statements',
      'Revenue generated',
    ]
  }
  ,
  {
    title:'Infrastructural Development',
    details:[
      // 'New Academic, Administrative & Residential Buildings Introduced',
      // 'Renovations & Upgradations',
      // 'Campus Expansion – Lands Purchase Statements',
      // 'Laboratories Inaugurated',
      // 'Equipment Purchase Statements',
      // 'Utility Improvements',
      // 'Sustainability & Green Campus Initializations'
      'Physical Infrastructure',
      'Digital Infrastructure',
      'Green Initiatives',
      
    ]
  },
  {
    title:'Extra Curricular Activities',
    details:[
      'List of Clubs',
      'List of Cells / Committees',
      'List of Sports Available',
      'Workshops & Seminars for Students & Faculties',
      //'Cultural Events'
    ]
  }
];
  
const Container = styled.div`
  max-width: 900px; // Fixed max-width
  margin: 20px auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const ChatSection = styled(Box)`
  flex: ${props => props.showChat ? '0 0 30%' : '0'};
  max-width: ${props => props.showChat ? '30%' : '0'};
  transition: all 0.3s ease;
`;
const DocumentSection = styled(Box)`
  flex: ${props => props.showChat ? '0 0 70%' : '1'};
  max-width: ${props => props.showChat ? '70%' : '100%'};
  overflow-x: auto;
`;

const MainContentWrapper = styled(Box)`
  display: flex;
  width: 100%;
    position: relative; 
  gap: 20px; // Space between document and chat sections
`;


const TitleC = styled.h2`
  text-align: center;
  color: #fff;
  background-color: #164863;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const StyledListItem = styled(ListItem)`
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0; /* Light background on hover */
  }
`;

const ListItemIconStyled = styled(ListItemIcon)`
  color: #007bff;
`;

const StyledButton = styled.button`
  text-align: center;
  padding: 12px 20px;
  background-color: #164863;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s, transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
`;

const ChatSectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; // Full height of the parent
  max-height: 100vh; // Prevent overflow
`;

const ChatContainer = styled(Box)`
width: 100%;
height: 100%;
display: flex;
flex-direction: column;
background-color: #f9f9f9;
border-radius: 8px;
overflow: hidden; // Prevent inner overflow
`;

const ChatMessagesContainer = styled(Box)`
flex-grow: 1;
overflow-y: auto; // Enable vertical scrolling
overflow-x: hidden; // Prevent horizontal scrolling
padding: 10px;
background-color: #fff;
`;

const ChatHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;


const MessageInputContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const MessageInput = styled(TextField)`
  flex-grow: 1;
  margin-right: 10px;
`;

const SendButton = styled(Button)`
  background-color: #007bff;
  color: white;

  &:hover {
    background-color: #0056b3;
  }
`;
// Main Component



const transformData = (graph) => {
  const labels = graph.data.map(item => item.label);
  const data = graph.data.map(item => item.value);
  const colors = labels.map(label => graph.colorSettings[label] || '#000');
  return {
    labels,
    datasets: [{
      data,
      backgroundColor: colors,
    }]
  };
};
const renderGraphInUI = (graph) => {
  const ChartWrapper = ({ children }) => (
    <div style={{ 
      width: '100%', 
      height: window.innerWidth < 768 ? '300px' : '400px',
      position: 'relative' 
    }}>
      {children}
    </div>
  );

  // Prepare chart data and options based on graph type
  let chartData, options;
  console.log(graph.graph_type);
  switch (graph.graph_type) {
    case 'line': // New case for line chart
      chartData = {
        labels: graph.data.map(item => item.name),
        datasets: [{
          label: graph.title || 'Line Chart',
          data: graph.data.map(item => item.value), // Assuming value is a single value for line chart
          borderColor: getColorForDataset(0), // Dynamic color
          backgroundColor: getColorForDataset(0, 1), // Dynamic background color
          fill: false,
          tension: 0.1 // Smooth line
        }]
      };

      options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.dataset.label || '';
                const value = context.parsed.y || '';
                return `${label}: ${value}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Categories'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Values'
            }
          }
        }
      };

      return (
        <ChartWrapper>
          <Line data={chartData} options={options} />
        </ChartWrapper>
      );
    case 'pie':
  const totalValue = graph.data.reduce((sum, item) => sum + item.value, 0);

  chartData = {
    labels: graph.data.map(item => item.name), // Department names
    datasets: [{
      data: graph.data.map(item => item.value), // Percentage values
      backgroundColor: graph.data.map((_, index) => getColorForDataset(index)), // Dynamic colors
      borderColor: graph.data.map((_, index) => getColorForDataset(index, 1)), // Dynamic border colors
      borderWidth: 1
    }]
  };

  options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 20,
          font: {
            size: 17
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || '';
            return `${label}: ${value}%`;
          }
        }
      },
      datalabels: {
        color: 'white',
        font: {
          weight: 'bold',
          size: 12
        },
        formatter: (value, context) => {
          const percentage = ((value / totalValue) * 100).toFixed(1) + '%';
          return percentage;
        },
        anchor: 'center',
        align: 'center',
        // Only show labels for segments larger than a certain threshold
        display: (context) => {
          const percentage = ((context.dataset.data[context.dataIndex] / totalValue) * 100);
          return percentage > 3; // Only show labels for segments > 3%
        }
      }
    }
  };

  return (
    <ChartWrapper>
      <Pie 
        data={chartData} 
        options={options} 
        plugins={[ChartDataLabels]} 
      />
    </ChartWrapper>
  );

    case 'bar':
      // If there are multiple value columns, create a stacked bar chart
      if (graph.data.length > 0 && graph.data[0].values) {
        chartData = {
          labels: graph.data.map(item => item.name),
          datasets: Object.keys(graph.data[0].values).map((key, index) => ({
            label: key,
            data: graph.data.map(item => item.values[key]),
            backgroundColor: getColorForDataset(index), // Dynamic colors
            borderColor: getColorForDataset(index, 1), // Dynamic border colors
            borderWidth: 1,
          }))
        };

        options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: graph.title || 'Stacked Bar Chart',
              font: {
                size: (context) => {
                  const screenWidth = window.innerWidth;
                  return screenWidth < 768 ? 14 : 18;
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const datasetLabel = context.dataset.label;
                  const value = context.parsed.y;
                  return `${datasetLabel}: ${value}`;
                },
                title: function(context) {
                  return graph.data[context.dataIndex].name;
                }
              },
              titleFont: {
                size: (context) => {
                  const screenWidth = window.innerWidth;
                  return screenWidth < 768 ? 12 : 16;
                }
              },
              bodyFont: {
                size: (context) => {
                  const screenWidth = window.innerWidth;
                  return screenWidth < 768 ? 10 : 14;
                }
              }
            },
            legend: {
              labels: {
                font: {
                  size: (context) => {
                    const screenWidth = window.innerWidth;
                    return screenWidth < 768 ? 10 : 14;
                  }
                }
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              ticks: {
                autoSkip: true,
                maxRotation: 45,
                font: {
                  size: (context) => {
                    const screenWidth = window.innerWidth;
                    return screenWidth < 768 ? 8 : 12;
                  }
                }
              }
            },
            y: {
              stacked: true,
              ticks: {
                font: {
                  size: (context) => {
                    const screenWidth = window.innerWidth;
                    return screenWidth < 768 ? 8 : 12;
                  }
                }
              }
            }
          }
        };

        return (
          <ChartWrapper>
            <Bar data={chartData} options={options} />
          </ChartWrapper>
        );
      }
      break;

    default:
      return <p>Unsupported graph type: {graph.graph_type}</p>;
  }
};
// Color generation remains the same
  const getColorForDataset = (index, alpha = 0.9) => {
    const COLORS = [
      "#FF6666",
      "#FFB366",
      "#FF9933",
      "#80E6B3",
      "#66CCCC",
      "#9999FF",
      "#FF66FF",
      "#66FF66",
      "#FFB300",
      "#FF80AA"
    ];
    const colors = COLORS.map(color => {
      const [r, g, b] = color
        .match(/\w\w/g) // Extract hexadecimal components
        .map(hex => parseInt(hex, 16)); // Convert to RGB values
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    });
    return colors[index % colors.length];
  };
// Function to generate Chart.js images for PDF
const generateChartImage = async (graph) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate graph data
      if (!graph || !graph.data || graph.data.length === 0) {
        throw new Error('Invalid graph data');
      }

      // Color generation function
      const getColorForDataset = (index, alpha = 0.9) => {
        const COLORS = [
          "#FF6666",
          "#FFB366",
          "#FF9933",
          "#80E6B3",
          "#66CCCC",
          "#9999FF",
          "#FF66FF",
          "#66FF66",
          "#FFB300",
          "#FF80AA"
        ];
        const colors = COLORS.map(color => {
          const [r, g, b] = color
            .match(/\w\w/g)
            .map(hex => parseInt(hex, 16));
          return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        });
        return colors[index % colors.length];
      };

      // Prepare chart configuration based on graph type
      let chartConfig = {};
      console.log(graph.graph_type);
      switch (graph.graph_type) {
        
        case 'pie':
          const totalValue = graph.data.reduce((sum, item) => sum + item.value, 0);

          chartConfig = {
            type: 'pie',
            data: {
              labels: graph.data.map(item => item.name),
              datasets: [{
                data: graph.data.map(item => item.value),
                backgroundColor: graph.data.map((_, index) => getColorForDataset(index)),
                borderColor: graph.data.map((_, index) => getColorForDataset(index, 1)),
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'right',
                  labels: {
                    boxWidth: 20,
                    font: {
                      size: 17
                    }
                  }
                },
                datalabels: {
                  color: 'white',
                  font: {
                    weight: 'bold',
                    size: 12
                  },
                  formatter: (value) => {
                    const percentage = ((value / totalValue) * 100).toFixed(1) + '%';
                    return percentage;
                  },
                  anchor: 'center',
                  align: 'center',
                  display: (context) => {
                    const percentage = ((context.dataset.data[context.dataIndex] / totalValue) * 100);
                    return percentage > 3;
                  }
                }
              }
            }
          };
          break;

        case 'bar':
          // Check if it's a stacked bar chart
          if (graph.data.length > 0 && graph.data[0].values) {
            chartConfig = {
              type: 'bar',
              data: {
                labels: graph.data.map(item => item.name),
                datasets: Object.keys(graph.data[0].values).map((key, index) => ({
                  label: key,
                  data: graph.data.map(item => item.values[key]),
                  backgroundColor: getColorForDataset(index),
                  borderColor: getColorForDataset(index, 1),
                  borderWidth: 1,
                }))
              },
              options: {
                responsive: true,
                plugins: {
                  title: {
                    display: true,
                    text: graph.title || 'Stacked Bar Chart'
                  },
                  legend: {
                    position: 'top'
                  }
                },
                scales: {
                  x: {
                    stacked: true
                  },
                  y: {
                    stacked: true
                  }
                }
              }
            };
          } else {
            // Regular bar chart
            chartConfig = {
              type: 'bar',
              data: {
                labels: graph.data.map(item => item.name),
                datasets: [{
                  label: graph.config_name || 'Data',
                  data: graph.data.map(item => item.value),
                  backgroundColor: graph.data.map((_, index) => getColorForDataset(index)),
                  borderColor: graph.data.map((_, index) => getColorForDataset(index, 1)),
                  borderWidth: 1
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    display: true,
                    position: 'top'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            };
          }
          break;
          case 'line': // New case for line chart
          chartConfig = {
            type: 'line',
            data: {
              labels: graph.data.map(item => item.name),
              datasets: [{
                label: graph.title || 'Line Chart',
                  data: graph.data.map(item => item.value), // Assuming value is a single value for line chart
                  borderColor: getColorForDataset(0), // Dynamic color
                  backgroundColor: getColorForDataset(0, 1), // Dynamic background color
                  fill: false,
                  tension: 0.1 // Smooth line
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.parsed.y || '';
                        return `${label}: ${value}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Categories'
                    }
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Values'
                    }
                  }
                }
              }
            };
            break;
        default:
          // Fallback to default bar chart configuration
          chartConfig = {
            type: 'bar',
            data: {
              labels: graph.data.map(item => item.name || 'Unknown'),
              datasets: [{
                label: graph.config_name || 'Data',
                data: graph.data.map(item => item.value),
                backgroundColor: graph.data.map((_, index) => getColorForDataset(index)),
                borderColor: graph.data.map((_, index) => getColorForDataset(index, 1)),
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top'
                }
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          };
      }

      // Alternative approach using a web service URL
      const baseUrl = 'https://quickchart.io/chart';
      const queryParams = new URLSearchParams({
        c: JSON.stringify(chartConfig),
        w: 600,
        h: 400,
        f: 'png',
        bkg: 'white'
      });

      const chartUrl = `${baseUrl}?${queryParams.toString()}`;

      // Fetch the image and convert to data URL
      const response = await fetch(chartUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(blob);

    } catch (error) {
      console.error('Chart generation error:', error);
      reject(error);
    }
  });
};  
const styles = StyleSheet.create({
  page: { 
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 12,
    margin: 0,
    color: '#333',
    position: 'relative', // Important for positioning border
    border: '1px solid #e0e0e0', // Light border around entire page
  },
  pageBorder: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 2,
    borderColor: '#164863', // Match your primary color
    borderStyle: 'solid',
    pointerEvents: 'none', // Ensures border doesn't interfere with content
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '45%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.1,
    fontSize: 40,
    color: '#164863',
    zIndex: -100,
  },
  header: { 
    fontSize: 18, 
    marginBottom: 10, 
    textAlign: 'center', 
    fontFamily: 'Helvetica-Bold',
    color: '#164863', // Primary color for headers
    textDecoration: 'underline', // Underlined header
  },
  footer: { 
    position: 'absolute', 
    bottom: 20, 
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#999' // Light grey for footer
  },
  coverImage: { 
    width: '100%', 
    height: 'auto', 
    marginBottom: 20 
  },
  sectionTitle: { 
    marginTop: 10,
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'center',
    color: '#164863', // Primary color for section titles
    textDecoration: 'underline', // Underlined section title
  },
  table: { 
    marginVertical: 5, // Reduced vertical margin
    marginHorizontal: 3, // Narrower horizontal margin
    width: '100%', 
    borderCollapse: 'collapse',
  },
  tableHeaderCell: { 
    border: '1px solid #ddd', 
    padding: 5, // Reduced padding
    textAlign: 'center', 
    fontSize: 10, // Reduced font size
    fontWeight: 'bold', 
    backgroundColor: '#164863', // Deep blue background
    color: '#FFFFFF', // White text for contrast
    flex: 1,
  },
  tableCell: { 
    border: '1px solid #ddd', 
    padding: 3, // Reduced padding
    textAlign: 'center', 
    fontSize: 9, // Smaller font size
    color: '#333',
    flex: 1,
  },
  titleCell: {
    textAlign: 'left',
    paddingLeft: 5, // Reduced padding
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  alternatingRow: {
    backgroundColor: '#f0f4f7', // Lighter, more subtle alternating row color
  }
});

const PDFGenerator = ({
  coverImageUrl,
  tableOfContents,
  sections,
  isLoading,
  onReportGenerated,
}) => {
  const [processedPDF, setProcessedPDF] = useState(null);
  const [chartImages, setChartImages] = useState({});
  const [qrCodes, setQRCodes] = useState({});

  // QR Code Generation useEffect
  useEffect(() => {
    const generateQRCodes = async () => {
      const newQRCodes = {};
      
      try {
        await Promise.all(
          sections.map(async (section) => {
            await Promise.all(
              section.details.map(async (detail) => {
                if (detail.youtubeUrl) {
                  try {
                    const qrCodeDataUrl = await QRCode.toDataURL(detail.youtubeUrl, {
                      errorCorrectionLevel: 'M',
                      type: 'image/png',
                      quality: 0.92,
                      margin: 1,
                      width: 150 
                    });
                    
                    newQRCodes[detail.title] = qrCodeDataUrl;
                  } catch (error) {
                    console.error(`Error generating QR code for ${detail.title}:`, error);
                    newQRCodes[detail.title] = null;
                  }
                }
              })
            );
          })
        );
        
        setQRCodes(newQRCodes);
      } catch (error) {
        console.error('Overall QR code generation error:', error);
      }
    };

    // Only generate QR codes when loading
    if (isLoading) {
      generateQRCodes();
    }
  }, [sections, isLoading]);

  // Add a new useEffect to generate chart images before PDF creation
  useEffect(() => {
    const generateChartImages = async () => {
      const newImages = {};
      
      try {
        await Promise.all(
          sections.map(async (section) => {
            await Promise.all(
              section.details.map(async (detail) => {
                if (detail.graphdata) {
                  try {
                    const imageUrl = await generateChartImage(detail.graphdata);
                    newImages[detail.title] = imageUrl;
                  } catch (error) {
                    console.error(`Error generating chart image for ${detail.title}:`, error);
                    newImages[detail.title] = null;
                  }
                }
              })
            );
          })
        );
        
        setChartImages(newImages);
      } catch (error) {
        console.error('Overall chart image generation error:', error);
      }
    };

    if (isLoading) {
      generateChartImages();
    }
  }, [sections, isLoading]);

  useEffect(() => {
    const generateAndProcessPDF = async () => {
      try {
        // Pass chart images to the Report component
        const docBlob = await pdf(
          <Report
            coverImageUrl={coverImageUrl}
            tableOfContents={tableOfContents}
            sections={sections}
            isLoading={isLoading}
            chartImages={chartImages}
            qrCodes={qrCodes}
            onReportGenerated={onReportGenerated}
          />
        ).toBlob();

        // Rest of the PDF processing remains the same...
        const docArrayBuffer = await docBlob.arrayBuffer();
        const pdfDoc = await PDFDocument.load(docArrayBuffer);
        
        const modifiedPdf = await PDFDocument.create();
        const helveticaFont = await modifiedPdf.embedFont(StandardFonts.Helvetica);

        const copiedPages = await modifiedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        
        copiedPages.forEach((page, index) => {
          modifiedPdf.addPage(page);

          const { width, height } = page.getSize();

          page.drawRectangle({
            x: 30,
            y: 30,
            width: width - 60,
            height: height - 60,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            opacity: 0.5
          });

          page.drawText(`Page ${index + 1} of ${copiedPages.length}`, {
            x: width / 2 - 30,
            y: 20,
            size: 10,
            font: helveticaFont,
            color: rgb(0, 0, 0)
          });
        });

        const modifiedPdfBytes = await modifiedPdf.save();
        const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        
        setProcessedPDF(modifiedPdfBlob);
      } catch (error) {
        console.error("Error generating or processing the PDF:", error);
      }
    };

    // Only generate PDF when chart images are ready
    if (Object.keys(chartImages).length > 0  && Object.keys(qrCodes).length > 0) {
      generateAndProcessPDF();
    }
  }, [coverImageUrl, tableOfContents, sections, isLoading, chartImages, onReportGenerated]);


  const downloadProcessedPDF = () => {
    if (!processedPDF) return;
    
    const url = URL.createObjectURL(processedPDF);
    const link = document.createElement("a");
    link.href = url;
    link.download = "report.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!processedPDF) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={downloadProcessedPDF}>Download Report</button>
    </div>
  );
};
const ResponsiveImage = ({ 
  src, 
  style = {}, 
  maxWidth = '100%', 
  maxHeight = 300, 
  objectFit = 'contain' 
}) => {
  return (
    <View style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 5,
      ...style
    }}>
      <Image 
        src={src}
        style={{
          maxWidth: maxWidth,
          maxHeight: maxHeight,
          objectFit: objectFit,
          width: 'auto',
          height: 'auto'
        }} 
      />
    </View>
  );
}
const Report = ({ coverImageUrl, tableOfContents, sections, isLoading,chartImages,onReportGenerated,qrCodes}) => {
 
  const [pageNumbers, setPageNumbers] = useState({}); // To store page numbers for sections
  let currentPageNumber = 1; // Start page number from 1
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  
  useEffect(() => {
    // Remove the chart image generation logic from here
    // Since it's now handled in the parent component

    // Call onReportGenerated when images are loaded and we're no longer loading
    if (chartImages && Object.keys(chartImages).length > 0 && qrCodes && Object.keys(qrCodes).length > 0) {
      setImagesLoaded(true);
      if (onReportGenerated) {
        onReportGenerated();
      }
    }
  }, [chartImages, onReportGenerated,qrCodes]);
  // Use another useEffect to call onReportGenerated
  // useEffect(() => {
  //   // Call onReportGenerated when images are loaded and we're no longer loading
  //   if (imagesLoaded && onReportGenerated) {
  //     onReportGenerated();
  //   }
  // }, [imagesLoaded, isLoading, onReportGenerated]);

  // if (isLoading) {
  //   return (
  //     <Document>
  //       <Page style={{
  //         flexDirection: 'column',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         padding: 30
  //       }}>
  //         <View style={{
  //           width: '100%',
  //           height: '100%',
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           backgroundColor: '#f0f0f0'
  //         }}>
  //           <Text style={{
  //             fontSize: 24,
  //             color: '#333',
  //             textAlign: 'center'
  //           }}>
  //             Generating Report...
  //           </Text>
  //         </View>
  //       </Page>
  //     </Document>
  //   );
  // }


  return (
    <Document>
      {/* Cover Page */}
      <Page style={styles.page}>
        {/* Watermark (optional) */}
        <Text style={styles.watermark}>PRAGATI MITRA</Text>
        {coverImageUrl && <Image src={coverImageUrl} style={styles.coverImage} />}
      </Page>

      {/* Table of Contents */}
      <Page style={styles.page}>
        <Text style={styles.header}>Table of Contents</Text>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.tableHeaderCell}>No.</Text>
            <Text style={{ ...styles.tableHeaderCell, ...styles.titleCell }}>Title</Text>
            <Text style={styles.tableHeaderCell}>Page</Text>
          </View>
          {tableOfContents.map((item, index) => (
            <View key={index}>
              <View style={styles.row}>
                <Text style={styles.tableCell}>{index + 1}</Text>
                <Text style={{ ...styles.tableCell, ...styles.titleCell }}>{item.title}</Text>
                <Text style={styles.tableCell}>{item.page+4}</Text>
              </View>
              {item.subItems && item.subItems.map((subItem, subIndex) => (
                <View key={subIndex} style={styles.row}>
                  <Text style={styles.tableCell}></Text>
                  <Text style={{ ...styles.tableCell, ...styles.titleCell }}>
                    {`${String.fromCharCode(97 + subIndex)})` + subItem.title}
                  </Text>
                  <Text style={styles.tableCell}>{subItem.page+4}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>

      {/* Content Sections */}
      {console.log("IN sectionssss")}
      {console.log(sections[0])}
      {sections.map((section, index) => {
        // Store the page number for this section
        pageNumbers[section.title] = currentPageNumber;

        return (
          <Page style={styles.page} key={index}>
            <Text style={styles.header}>{section.title}</Text>
            <Text style={{ textAlign: 'center', marginBottom: 10 }}>{section.intro}</Text>
            
            {section.details.map((detail, detailIndex) => {
              // Increment page number for each detail
              currentPageNumber++;

              return (
                < View key={detailIndex}>
                  <Text style={styles.sectionTitle}>{detail.title}</Text>
                  <Text>{detail.intro}</Text>
                  
                  {/* Render chart image with more robust checking */}
                  {detail.graphdata && chartImages[detail.title] && (
                      <View style={{ 
                        marginBottom: 20, 
                        width: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        justifyContent: 'center', 
                        alignItems: 'center' 
                      }}>
                        <Text style={styles.sectionTitle}>
                          {detail.graphdata.config_name}
                        </Text>
                        <ResponsiveImage 
                          src={chartImages[detail.title]} 
                          maxHeight={250}
                          style={{ 
                            width: '90%',
                            marginHorizontal: 'auto'
                          }} 
                        />
                      </View>
                    )}
                  
                  {/* Render uploaded images */}
                  {detail.images && detail.images.length > 0 && (
                <View style={{ marginBottom: 20 }}>
                  {detail.images.map((imageObj, imgIndex) => (
                    <View key={imgIndex} style={{ marginBottom: 10 }}>
                      <Image 
                        src={`http://localhost:3000/${imageObj.url}`} 
                        style={{ 
                          width: '100%', 
                          height: 200, 
                          objectFit: 'contain', 
                          marginBottom: 5 
                        }} 
                      />
                      {imageObj.description && (
                        <Text 
                          style={{ 
                            textAlign: 'center', 
                            fontStyle: 'italic', 
                            fontSize: 10, 
                            color: '#666' 
                          }}
                        >
                          {imageObj.description}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
                  {detail.youtubeUrl && qrCodes[detail.title] && (
                    <View style={{ 
                      marginBottom: 20, 
                      width: '100%', 
                      display: 'flex', 
                      flexDirection: 'row', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 10,
                      backgroundColor: '#f0f0f0',
                      borderRadius: 5 // Optional: adds rounded corners
                    }}>
                      <View style={{ flex: 1, marginRight: 10 }}>
                        <Text style={{ 
                          fontWeight: 'bold', 
                          marginBottom: 5 
                        }}>
                          Recommended Video
                        </Text>
                        <Text style={{ 
                          color: 'blue', 
                          textDecoration: 'underline',
                          fontSize: 10,
                          wordBreak: 'break-all' // Ensures long URLs don't overflow
                        }}>
                          {detail.youtubeUrl}
                        </Text>
                      </View>
                      
                      <ResponsiveImage 
                        src={qrCodes[detail.title]} 
                        maxWidth={120}
                        maxHeight={120}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 5, // Optional: adds rounded corners to QR code
                          borderWidth: 1,
                          borderColor: '#e0e0e0'
                        }}
                      />
                    </View>
                  )}

                  {detail.data && detail.data.length > 0 && (
                    <View style={styles.table}>
                      <View style={styles.row}>
                        {Object.keys(detail.data[0]).map((key) => (
                          <Text key={key} style={styles.tableHeaderCell}>{key}</Text>
                        ))}
                      </View>
                      {detail.data.map((row, rowIndex) => (
                        <View 
                          key={rowIndex} 
                          style={[
                            styles.row, 
                            rowIndex % 2 === 0 ? {} : styles.alternatingRow
                          ]}
                        >
                          {Object.values(row).map((value, colIndex) => (
                            <Text key={colIndex} style={styles.tableCell}>
                              {value}
                            </Text>
                          ))}
                        </View>
                      ))}
                    </View>
                  )}
                  
                  <Text style={{ fontWeight: 'bold', marginTop: 5 }}>Summary:</Text>
                  <Text>{detail.summary}</Text>
                </View>
            );
              
            })}
          </Page>
        );
      })}
    </Document>
  );
};
const VersionHistoryModal = ({ open, onClose, sectionTitle, detailTitle, versions, onSelectVersion, onBringToEditor, selectedVersion }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Version History - {sectionTitle}-{detailTitle}</DialogTitle>
      <DialogContent>
        <List>
          {versions.map((version) => (
            <ListItem 
              key={version.version_number} // Use version_number as the key
              button 
              onClick={() => onSelectVersion(version)} // Pass the entire version object
            >
              <ListItemText primary={`Version ${version.version_number}`} />
            </ListItem>
          ))}
        </List>
        {selectedVersion && (
          <div>
            <Typography variant="h6">Version Details:</Typography>
            <Typography>Introduction: {selectedVersion.introduction}</Typography>
            <Typography>Summary: {selectedVersion.summary}</Typography>
            
            {/* Render the data table */}
            {selectedVersion.data && selectedVersion.data.length > 0 && (
              <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {Object.keys(selectedVersion.data[0]).map((key) => (
                        <TableCell key={key}>{key}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedVersion.data.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {Object.values(row).map((value, colIndex) => (
                          <TableCell key={colIndex}>{value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {/* Button to bring selected version to editor */}
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => onBringToEditor(
                selectedVersion.introduction,
                selectedVersion.summary,
                selectedVersion.graph_data,
                selectedVersion.data
              )}
              style={{ marginTop: '20px' }}
            >
              Bring to Editor
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
  const SectionChat = React.memo(({ 
    sectionTitle, 
    subsectionName, 
    reportId, 
    onClose,
    reportSectionDetailId,
    initialMode = 'general'
  }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [feedbackDiscussions, setFeedbackDiscussions] = useState([]);
    const [showFeedbackDiscussions, setShowFeedbackDiscussions] = useState(
      initialMode === 'feedback'
    );
    
    // Add this line to track the overall feedback status
    const [currentFeedbackStatus, setCurrentFeedbackStatus] = useState('Open');

    // Fetch existing chat messages
    useEffect(() => {
      const fetchChatMessages = async () => {
        try {
          // Fetch general chat messages
          const messagesResponse = await axios.get('http://localhost:3000/report/messages', {
            params: { 
              reportId, 
              sectionName: sectionTitle, 
              subsectionName,
              messageType: 'general'
            }
          });
    
          // Fetch feedback discussions
          const feedbackResponse = await axios.get('http://localhost:3000/report/messages', {
            params: { 
              reportId, 
              sectionName: sectionTitle, 
              subsectionName,
              messageType: 'feedback'
            }
          });
    
          // Normalize message fetching
          const processMessages = (messages) => {
            // If messages is an array of arrays, flatten it
            if (Array.isArray(messages) && messages.length > 0 && Array.isArray(messages[0])) {
              return messages.flat();
            }
            // If messages is already a flat array, return it
            return messages || [];
          };
    
          const generalMessages = processMessages(messagesResponse.data.messages);
          const feedbackMessages = processMessages(feedbackResponse.data.messages);
    
          // Sort messages by timestamp
          const sortedGeneralMessages = generalMessages.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
    
          const sortedFeedbackMessages = feedbackMessages.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
          );
    
          setMessages(sortedGeneralMessages);
          setFeedbackDiscussions(sortedFeedbackMessages);
    
          // Set initial feedback status if exists
          if (sortedFeedbackMessages.length > 0) {
            const latestStatus = sortedFeedbackMessages.reduce((latest, current) => 
              (current.status && ['Under Review', 'Resolved'].includes(current.status)) 
                ? current.status 
                : latest, 
              'Open'
            );
            setCurrentFeedbackStatus(latestStatus);
          }
    
          // Optional: Log for debugging
          console.log('General Messages:', sortedGeneralMessages);
          console.log('Feedback Messages:', sortedFeedbackMessages);
        } catch (error) {
          console.error('Failed to fetch chat messages', error);
        }
      };
    
      if (reportId && sectionTitle && subsectionName) {
        fetchChatMessages();
      }
    }, [reportId, sectionTitle, subsectionName]);
    // Update the handleUpdateFeedbackStatus method
    const handleUpdateFeedbackStatus = async (newStatus) => {
      try {
        // API call to update overall feedback status
        await axios.patch('http://localhost:3000/report/update-feedback-status', {
          reportId,
          reportSectionDetailId,
          sectionName: sectionTitle,
          subsectionName,
          status: newStatus
        });

        // Update local state
        setCurrentFeedbackStatus(newStatus);

        // Optional: Show success toast
        toast.success(`Feedback status updated to ${newStatus}`);
      } catch (error) {
        console.error('Failed to update feedback status', error);
        toast.error('Failed to update feedback status');
      }
    };

    const handleSendMessage = async () => {
      if (!newMessage.trim()) return;

      try {
        const response = await axios.post('http://localhost:3000/report/send', {
          reportId,
          reportSectionDetailId,
          sectionName: sectionTitle,
          subsectionName,
          message: newMessage,
          sender: getTokenData().username,
          type: showFeedbackDiscussions ? 'feedback' : 'general',
          status: showFeedbackDiscussions ? 'Open' : null
        });

        // Add new message to appropriate list
        if (showFeedbackDiscussions) {
          setFeedbackDiscussions(prev => [...prev, response.data.message]);
        } else {
          setMessages(prev => [...prev, response.data.message]);
        }
        
        setNewMessage('');
      } catch (error) {
        console.error('Failed to send message', error);
        toast.error('Failed to send message');
      }
    };

    const handleUpdateMessageStatus = async (messageId, newStatus) => {
      try {
        // API call to update individual message status
        await axios.patch('http://localhost:3000/report/message-status', {
          messageId,
          status: newStatus
        });
    
        // Update local state
        if (showFeedbackDiscussions) {
          setFeedbackDiscussions(prev => 
            prev.map(msg => 
              msg.id === messageId ? { ...msg, status: newStatus } : msg
            )
          );
        } else {
          // If needed, add similar logic for general messages
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId ? { ...msg, status: newStatus } : msg
            )
          );
        }
    
        toast.success(`Message status updated to ${newStatus}`);
      } catch (error) {
        console.error('Failed to update message status', error);
        toast.error('Failed to update message status');
      }
    };

    // Function to render messages
    // Function to render messages
  // Function to render messages
  const statusColors = {
    'Open': {
      background: '#fff3e0', // Light blue
      text: '#1976d2'        // Darker blue
    },
    'Under Review': {
      background: '#fff3e0', // Light orange
      text: '#ed6c02'        // Darker orange
    },
    'Resolved': {
      background: '#e8f5e9', // Light green
      text: '#2e7d32'        // Darker green
    }
  };
  const renderMessages = (messageList) => {

    const statuses = ['Open', 'Under Review', 'Resolved'];
    
    return messageList.map((msg, index) => {
      const isOwnMessage = msg.sender === getTokenData().username;
      const currentStatus = msg.status || 'Open';
      const statusColor = statusColors[currentStatus];
    
      return (
        <Box 
          key={index} 
          sx={{ 
            display: 'flex',
            justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
            mb: 2
          }}
        >
          <Box
            sx={{
              maxWidth: '70%',
              backgroundColor: isOwnMessage ? '#e6f2ff' : '#f0f0f0',
              borderRadius: '12px',
              p: 1.5,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              position: 'relative',
              // Add status indicator
              '&::before': showFeedbackDiscussions ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '5px',
                backgroundColor: statusColor.text,
                borderTopLeftRadius: '12px',
                borderBottomLeftRadius: '12px'
              } : {}
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: isOwnMessage ? '#1976d2' : '#333',
                mb: 0.5
              }}
            >
              {msg.sender}
            </Typography>
            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
              {msg.message}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                textAlign: 'right', 
                color: 'text.secondary',
                mt: 0.5
              }}
            >
              {new Date(msg.timestamp).toLocaleString()}
            </Typography>
    
            {showFeedbackDiscussions && (
              <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <FormControl size="small" variant="outlined">
                  <Select
                    value={currentStatus}
                    onChange={(e) => handleUpdateMessageStatus(msg.id, e.target.value)}
                    sx={{ 
                      minWidth: 120,
                      '& .MuiSelect-select': {
                        backgroundColor: statusColor.background,
                        color: statusColor.text,
                        fontWeight: 600
                      }
                    }}
                  >
                    {statuses.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
          </Box>
        </Box>
      );
    });
  };

  // Update the Feedback Status Chip section
  {showFeedbackDiscussions && (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 1, 
        backgroundColor: statusColors[currentFeedbackStatus].background, 
        borderRadius: '4px', 
        mb: 2 
      }}
    >
      <Chip 
        label={`Status: ${currentFeedbackStatus}`} 
        sx={{
          backgroundColor: statusColors[currentFeedbackStatus].text,
          color: 'white',
          fontWeight: 600
        }}
      />
    </Box>
  )}

  // Update the Feedback Status Chip section
  {showFeedbackDiscussions && (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        p: 1, 
        backgroundColor: statusColors[currentFeedbackStatus].background, 
        borderRadius: '4px', 
        mb: 2 
      }}
    >
      <Chip 
        label={`Status: ${currentFeedbackStatus}`} 
        sx={{
          backgroundColor: statusColors[currentFeedbackStatus].text,
          color: 'white',
          fontWeight: 600
        }}
      />
    </Box>
  )}
    return (
      <ChatContainer>
        <ChatHeader 
    sx={{ 
      backgroundColor: '#f0f0f0', 
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column', // Change to column to stack vertically
      alignItems: 'center',
      justifyContent: 'center', // Center the content vertically
      p: 2,
      flexShrink: 0
    }}
  >
    <Box 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 1 // Add margin bottom to create space between header and button group
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#333', 
          fontWeight: 600 
        }}
      >
        {subsectionName} {showFeedbackDiscussions ? 'Feedback' : 'Discussion'}
      </Typography>
      <IconButton 
        onClick={onClose} 
        size="small" 
        sx={{ 
          color: 'text.secondary',
          '&:hover': { 
            backgroundColor: 'rgba(0,0,0,0.1)' 
          }
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>

    <Box 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center' 
      }}
    >
      <ButtonGroup 
        variant="outlined" 
        aria-label="chat mode selection"
      >
        <Button
          variant={!showFeedbackDiscussions ? 'contained' : 'outlined'}
          onClick={() => setShowFeedbackDiscussions(false)}
          color="primary"
          size="small"
        >
          Chat
        </Button>
        <Button
          variant={showFeedbackDiscussions ? 'contained' : 'outlined'}
          onClick={() => setShowFeedbackDiscussions(true)}
          color="secondary"
          size="small"
        >
          Feedback
        </Button>
      </ButtonGroup>
    </Box>
  </ChatHeader>

        {/* Feedback Status Chip for Visual Indication */}
        

  <ChatMessagesContainer 
          sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            p: 2,
            backgroundColor: '#fafafa'
          }}
        >
          {showFeedbackDiscussions 
            ? renderMessages(feedbackDiscussions)
            : renderMessages(messages)
          }
        </ChatMessagesContainer>

        <MessageInputContainer 
          sx={{ 
            borderTop: '1px solid #e0e0e0', 
            p: 2,
            backgroundColor: '#fff',
            flexShrink: 0
          }}
        >
          <MessageInput
            fullWidth
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={`Type a ${showFeedbackDiscussions ? 'feedback' : 'message'}...`}
            size="small"
            sx={{ 
              mr: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px'
              }
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <SendButton 
            onClick={handleSendMessage}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: '20px',
              minWidth: '100px'
            }}
          >
            Send
          </SendButton>
        </MessageInputContainer>
      </ChatContainer>
    );
  });
  const ChatPopover = ({ children, anchorEl, open, onClose }) => {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={onClose}
        anchorOrigin={{
          vertical: 'center', // Changed to center
          horizontal: 'right', // Changed to center
        }}
        transformOrigin={{
          vertical: 'center', // Changed to center
          horizontal: 'left', // Changed to center
        }}
        PaperProps={{
          sx: {
            width: '700px', // Increased width
            maxWidth: '95vw', // Responsive max-width
            height: '700px', // Fixed height
            maxHeight: '90vh', // Responsive max-height
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            overflow: 'hidden', // Ensure content is contained
            boxShadow: 4,
            border: '1px solid rgba(0,0,0,0.12)',
            '@media (max-width: 768px)': {
              width: '95vw',
              height: 'auto',
              maxHeight: '90vh'
            }
          }
        }}
        sx={{
          // Center the popover
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Ensure full viewport coverage
          '& .MuiPopover-paper': {
            maxWidth: 'calc(100% - 32px)',
            maxHeight: 'calc(100% - 32px)',
            overflow: 'visible', // Allow scrolling if needed
          }
        }}
      >
        <Box 
          sx={{
            width: '100%', 
            height: '100%', 
            overflowY: 'auto', // Enable vertical scrolling
            overflowX: 'hidden', // Prevent horizontal scrolling
            position: 'relative'
          }}
        >
          {children}
        </Box>
      </Popover>
    );
  };
  
  // Update ChatContainer and ChatMessagesContainer for better scrolling
  const getYouTubeEmbedUrl = (url) => {
    // Regular expressions to match different YouTube URL formats
    const regexes = [
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/,
      /^(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/
    ];
  
    for (let regex of regexes) {
      const match = url.match(regex);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}`;
      }
    }
  
    return url; // Return original URL if no match
  };
const Documents = () => {
  const [openSections, setOpenSections] = useState({});
  const [checked, setChecked] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedData, setSelectedData] = useState({}); 
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [imageError, setImageError] = useState(''); 
  const [tableOfContents, setTableOfContents] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]); // Renamed from sections
  const [sectionVersions, setSectionVersions] = useState({});
  const location = useLocation();
  const reportId=location.state;
  const [activeChatSection, setActiveChatSection] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [chatMode, setChatMode] = useState('');
  const [isHTMLReport, setIsHTMLReport] = useState(false);

  console.log(reportId);
  const [availableSections, setAvailableSections] = useState([]);
  const [reportSectionDetailId, setReportSectionDetailId] = useState(null); // To store the report_section_detail ID
  const [openVersionModal, setOpenVersionModal] = useState({
    open: false,
    sectionTitle: '',
    detailTitle: '',
    versions: [],
    index:'',
    selectedVersion: null,
  });
  const [selectedImages, setSelectedImages] = useState({});
  const [isReportLoading, setIsReportLoading] = useState(false);

  // const { reportId } = location.state || {};
  const role= getTokenData().role;
  useEffect(() => {
    console.log('Current reportSectionDetailId:', reportSectionDetailId);
  }, [reportSectionDetailId]);
  useEffect(() => {
    const fetchAvailableSections = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/report/${reportId}/sections`, {
          params: { role }
        });
        console.log(response.data);
        // Filter the original sections based on available sections from backend
        const filteredSections = sections.filter(section => 
          response.data.includes(section.title)
        );
        
        setAvailableSections(filteredSections);
      } catch (error) {
        console.error('Error fetching available sections:', error);
        // Fallback logic based on role
        let defaultSections = [];
        switch(role) {
          case 'academic_coordinator':
            defaultSections = sections; // All sections
            break;
          case 'infrastructure_coordinator':
            defaultSections = sections.filter(section => 
              section.title === 'Infrastructural Development'
            );
            break;
          case 'finance_coordinator':
            defaultSections = sections.filter(section => 
              section.title === 'Financial Statements'
            );
            break;
          default:
            defaultSections = [];
        }
        setAvailableSections(defaultSections);
      }
    };

    if (reportId && role) {
      fetchAvailableSections();
    }
  }, [reportId, role]);
  const renderSectionChat = () => {
    // Only render chat if showChat is true and activeChatSection is set
    if (!showChat || !activeChatSection) return null;
  
    const { title, index } = activeChatSection;
    const reportSectionDetailId = selectedData[`${title}-${index}`]?.reportSectionDetailId;
  
    // Get the reference to the subsection element
    const subsectionRef = document.querySelector(`[data-section="${title}-${index}"]`);
  
    return (
      <ChatPopover 
        anchorEl={subsectionRef}
        open={showChat}
        onClose={() => {
          setShowChat(false);
          setActiveChatSection(null);
        }}
      >
        <SectionChat
          sectionTitle={title}
          subsectionName={sections.find(sec => sec.title === title).details[index]}
          reportId={reportId}
          reportSectionDetailId={reportSectionDetailId}
          initialMode={chatMode}
          onClose={() => {
            setShowChat(false);
            setActiveChatSection(null);
          }}
        />
      </ChatPopover>
    );
  };
  const validateImageSize = (file) => {
    const image = new window.Image();
    image.src = URL.createObjectURL(file);
  
    return new Promise((resolve, reject) => {
      image.onload = () => {
        const width = image.width;
        const height = image.height;
  
        // A4 at 300 DPI in pixels: 2480 x 3508
        if (width === 1275 && height === 1650) {
          resolve(true);
        } else {
          reject('Image must be A4 size (2480 x 3508 px at 300dpi).');
        }
      };  
      image.onerror = () => reject('Error loading image.');
    });
  };
  
  // Handle file input change and validate the image
  // Inside handleFileChange function
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0];
      if (fileType !== 'image') {
        setImageError('Please upload an image file.');
        return;
      }
  
      try {
        setImageError(''); 
        const isValid = await validateImageSize(file);
        if (isValid) {
          // Store the image URL instead of the file object
          const imageUrl = URL.createObjectURL(file);
          setCoverImageUrl(imageUrl);
        }
      } catch (error) {
        // Make sure to set a string message for the error
        setImageError(error.message || 'An unknown error occurred.'); 
      }
    }
  };
  
  // Rendering the error message
  {imageError && <p style={{ color: 'red' }}>{imageError}</p>}


  const handleClick = (sectionTitle) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle],
    }));
  };

  const handleCheck = async (sectionTitle, index) => {
    const key = `${sectionTitle}-${index}`;
    const isChecked = !checked[key];
    
    setChecked((prev) => ({
      ...prev,
      [key]: isChecked,
    }));
    
    // Reset reportSectionDetailId and selectedImages when unchecking
    if (!isChecked) {
      setReportSectionDetailId(null);
      setSelectedImages(prev => {
        const newImages = {...prev};
        delete newImages[key];
        return newImages;
      });
    }
  
    // Fetch data only if checkbox is checked
    if (isChecked) {
      try {
        // First, try to fetch the latest version
        const latestVersionResponse = await axios.get('http://localhost:3000/report/section-details', {
          params: {
            reportId: reportId,
            sectionName: sectionTitle,
            subsectionName: sections.find((sec) => sec.title === sectionTitle).details[index],
          }
        });
  
        // Check if details exist
        if (latestVersionResponse.data.details) {
          const latestDetails = latestVersionResponse.data.details;
          
          // Set reportSectionDetailId only if details exist
          setReportSectionDetailId(latestDetails.id);
  
          setSelectedData((prev) => ({
            ...prev,
            [key]: {
              intro: latestDetails.introduction,
              data: latestDetails.data,
              summary: latestDetails.summary,
              graphdata: latestDetails.graph_data,
              youtubeUrl: latestDetails.youtube_url,
              canUploadImages: true // Add a flag to enable image upload
            }
          }));
  
          // Fetch images for this section
          const imagesResponse = await axios.get('http://localhost:3000/report/section-images', {
            params: { reportSectionDetailId: latestDetails.id }
          });
  
          // Update the selected data to include images
          setSelectedData((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              images: imagesResponse.data.images || []
            }
          }));
  
        } else {
          // If no latest version exists, fetch default section data
          const response = await axios.get(`http://localhost:3000/report/section-data`, {
            params: { section: sections.find((sec) => sec.title === sectionTitle).details[index] }
          });
          
          // Update selected data with the fetched section data
          setSelectedData((prev) => ({
            ...prev,
            [key]: {
              ...response.data,
              canUploadImages: false // Disable image upload
            }
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Fallback mechanism if first data fetch fails
        try {
          const response = await axios.get(`http://localhost:3000/report/section-data`, {
            params: { section: sections.find((sec) => sec.title === sectionTitle).details[index] }
          });
          
          // Update selected data with fallback data
          setSelectedData((prev) => ({
            ...prev,
            [key]: {
              ...response.data,
              canUploadImages: false // Disable image upload
            }
          }));
        } catch (fallbackError) {
          console.error('Fallback data fetch failed:', fallbackError);
        }
      }
    } else {
      // If checkbox is unchecked, remove the data for this section
      setSelectedData((prev) => {
        const newData = { ...prev };
        delete newData[key];
        return newData;
      });
    }
  };
  
  
  const handleGenerateWithAI = async (detailTitle) => {
    try {
      const response = await axios.get(`http://localhost:3000/report/section-data`, {
        params: { section: detailTitle }
      });
  
      const key = `${openVersionModal.sectionTitle}-${detailTitle}`;
      setSelectedData((prev) => ({
        ...prev,
        [key]: response.data
      }));
    } catch (error) {
      console.error('Error generating data with AI:', error);
      toast.error('Failed to generate data with AI');
    }
  };

  const handleInputChange = (sectionTitle, index, event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [`${sectionTitle}-${index}-${name}`]: value,
    }));
  };

  const notifysuccess = () => {
    toast.success('Report Generated!!!', {
      position: "top-center",
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Zoom,
    });
  };
  // Saving a section
  const saveSection = async (sectionTitle, detailTitle, index) => {
    const key = `${sectionTitle}-${index}`;
    const sectionData = selectedData[key];
  
    try {
      const response = await axios.post('http://localhost:3000/report/section-details', {
        reportId: reportId,
        sectionName: sectionTitle,
        subsectionName: detailTitle,
        introduction: sectionData?.intro || '',
        data: sectionData?.data || [],
        summary: sectionData?.summary || '',
        youtubeUrl: sectionData?.youtubeUrl || null,
        graphData: sectionData?.graphdata || null,
        createdBy: getTokenData().username
      });
  
      // Update versions state with new details
      setSectionVersions(prev => ({
        ...prev,
        [key]: {
          ...(prev[key] || {}),
          [detailTitle]: {
            currentVersion: response.data.version,
            sectionDetailsId: response.data.sectionDetailsId,
            versionHistoryId: response.data.versionHistoryId,
            versions: [
              ...(prev[key]?.[detailTitle]?.versions || []),
              response.data.version
            ]
          }
        }
      }));
  
      // Refetch the section details to update the state
      try {
        const latestVersionResponse = await axios.get('http://localhost:3000/report/section-details', {
          params: {
            reportId: reportId,
            sectionName: sectionTitle,
            subsectionName: detailTitle,
          }
        });
  
        // If details exist, update the state
        if (latestVersionResponse.data.details) {
          const latestDetails = latestVersionResponse.data.details;
          
          // Set reportSectionDetailId
          setReportSectionDetailId(latestDetails.id);
  
          // Update selected data with latest details and enable image upload
          setSelectedData((prev) => ({
            ...prev,
            [key]: {
              intro: latestDetails.introduction,
              data: latestDetails.data,
              summary: latestDetails.summary,
              graphdata: latestDetails.graph_data,
              youtubeUrl: sectionData?.youtubeUrl || null,
              canUploadImages: true // Enable image upload
            }
          }));
  
          // Fetch images for this section
          const imagesResponse = await axios.get('http://localhost:3000/report/section-images', {
            params: { reportSectionDetailId: latestDetails.id }
          });
  
          // Update the selected data to include images
          setSelectedData((prev) => ({
            ...prev,
            [key]: {
              ...prev[key],
              images: imagesResponse.data.images || []
            }
          }));
        }
      } catch (refetchError) {
        console.error('Error refetching section details:', refetchError);
      }
  
      // Set the report section detail ID
      setReportSectionDetailId(response.data.report_section_id);
      
      // Success toast
      toast.success(`Section ${detailTitle} saved successfully (Version ${response.data.version})`);
    } catch (error) {
      console.error('Save failed', error);
      toast.error(`Failed to save ${detailTitle}: ${error.response?.data?.details || error.message}`);
    }
  };


  const handleSubmit = () => {
    const contents = []; // This will hold the Table of Contents entries
    setIsReportLoading(true);
    const chosenSections = sections.map(section => {
      const selectedDetails = section.details.map((detail, index) => {
        const key = `${section.title}-${index}`;
  
        if (checked[key]) { // Include only checked items
          const subItem = {
            title: detail,
            page: contents.length + 2 // Increment page number for each detail
          };
  
          // Add the main section if it doesn't exist in the table of contents
          const mainItemIndex = contents.findIndex(item => item.title === section.title);
          if (mainItemIndex === -1) {
            contents.push({ title: section.title, page: contents.length + 1, subItems: [subItem] });
          } else {
            contents[mainItemIndex].subItems.push(subItem);
          }
  
          // Return the data needed for the selected section detail
          return {
            title: detail,
            intro: selectedData[key]?.intro || formData[`${section.title}-${index}-description`] || '',
            data: selectedData[key]?.data || [],
            summary: selectedData[key]?.summary || '',
            graphdata: selectedData[key]?.graphdata || null,
            youtubeUrl: selectedData[key]?.youtubeUrl || null ,
            images:selectedData[key]?.images || null
          };
        }
        return null;
      }).filter(detail => detail != null); // Remove unchecked items
  
      // Only include sections that have selected details
      return selectedDetails.length > 0 ? { title: section.title, details: selectedDetails } : null;
    }).filter(section => section != null); // Remove empty sections
  
    setTableOfContents(contents);
    setSelectedSections(chosenSections); // Update selectedSections with structured data
  };
  const handleViewVersions = async (sectionTitle, detailTitle,index) => {
    // Check if reportSectionDetailId is already set
    if (!reportSectionDetailId) {
      toast.error('No section detail ID available. Please check the section first.');
      return;
    }
    console.log(sectionTitle+"----"+detailTitle);
    try {
      const versionsResponse = await axios.get(`http://localhost:3000/report/section-versions`, {
        params: { reportSectionDetailId } // Fetch versions using the ID
      });
      console.log(versionsResponse.data.versions);
      setOpenVersionModal({
        open: true,
        sectionTitle: sectionTitle,
        detailTitle: detailTitle,
        index:index,
        versions: versionsResponse.data.versions || [], // Set the fetched versions
        selectedVersion: null, // Reset selected version
      });
    } catch (error) {
      console.error('Failed to fetch versions', error);
      toast.error('Failed to fetch versions');
    }
  };

  const handleSelectVersion = (version) => {
    console.log(version);
    console.log(JSON.parse(version.content));
    // Since version contains all necessary details, no need for an API call
    const versionDetails = {
      introduction: JSON.parse(version.content).introduction,
      summary: JSON.parse(version.content).summary,
      data: JSON.parse(version.content).data,
      graph_data: JSON.parse(version.content).graphData
    };
    
    // Update the selected version details in the modal
    setOpenVersionModal((prev) => ({
      ...prev,
      selectedVersion: versionDetails 
    }));
  };

  const handleBringToEditor = (introduction, summary, graphData, data) => {
    // Construct the key based on sectionTitle and detailTitle
    
    const key = `${openVersionModal.sectionTitle}-${openVersionModal.index}`;
    console.log("Bringing to editor with key:", selectedData);
    
    // Create the sanitized data object
    const sanitizedData = {
      intro: introduction || '',
      data: Array.isArray(data) ? data : (typeof data === 'string' ? JSON.parse(data) : []),
      summary: summary || '',
      graphdata: graphData || null
    };
  
    // Reset the current editor data before updating with new version data
    setSelectedData(prev => ({
      ...prev,
      [key]: {
        intro: '', // Reset introduction
        data: [], // Reset data table
        summary: '', // Reset summary
        graphdata: null // Reset graph data
      }
    }));
  
    // Update the selectedData state with new version data
    setSelectedData(prev => ({
      ...prev,
      [key]: {
        ...prev[key], // Preserve existing data if any
        ...sanitizedData // Update with new version data
      }
    }));
  
    // Close the modal after bringing to editor
    setOpenVersionModal({ open: false, sectionTitle: '', detailTitle: '', versions: [], selectedVersion: null,index:'' });
  };
  const handleImageChange = (sectionTitle, index, event) => {
    const files = Array.from(event.target.files);
    const key = `${sectionTitle}-${index}`;
  
    // Initialize descriptions as empty strings for new images
    const initialDescriptions = files.map(() => '');
  
    setSelectedImages((prev) => ({
      ...prev,
      [key]: files.map((file, idx) => ({
        file,
        description: initialDescriptions[idx],
      })),
    }));
  };
  
  const handleDescriptionChange = (sectionTitle, index, imgIndex, value) => {
    const key = `${sectionTitle}-${index}`;
  
    setSelectedImages((prev) => ({
      ...prev,
      [key]: prev[key].map((imgObj, i) =>
        i === imgIndex ? { ...imgObj, description: value } : imgObj
      ),
    }));
  };
  
  const handleUploadImages = async (sectionTitle, index) => {
    const key = `${sectionTitle}-${index}`;
    const images = selectedImages[key];
  
    if (!selectedData[key]?.canUploadImages) {
      toast.error('Please save the section before uploading images.');
      return;
    }
  
    if (!images || images.length === 0) {
      toast.error('No images selected for upload.');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('reportId', reportId);
      formData.append('reportSectionDetailId', reportSectionDetailId);
  
      images.forEach(({ file, description }) => {
        formData.append('images', file);
        formData.append('descriptions', description || '');
      });
  
      const response = await axios.post(
        'http://localhost:3000/report/upload-images',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
  
      const imagesResponse = await axios.get(
        'http://localhost:3000/report/section-images',
        {
          params: { reportSectionDetailId },
        }
      );
  
      setSelectedData((prev) => ({
        ...prev,
        [`${sectionTitle}-${index}`]: {
          ...prev[`${sectionTitle}-${index}`],
          images: imagesResponse.data.images || [],
        },
      }));
  
      setSelectedImages((prev) => ({ ...prev, [key]: [] }));
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error.response?.data || error.message);
      toast.error(`Failed to upload images: ${error.response?.data?.error || 'Unknown error'}`);
    }
  };
  const handleDeleteImage = async (imageData, reportSectionDetailId, title, index) => {
    try {
      // Ensure we're passing the full URL without leading slash
      const imageUrl = imageData.url.replace(/^\/+/, '');
  
      const response = await axios.delete('http://localhost:3000/report/delete-image', {
        data: {
          imageUrl,
          reportSectionDetailId
        }
      });
  
      // Update the state to remove the deleted image
      setSelectedData((prev) => {
        const updatedImages = prev[`${title}-${index}`].images.filter(
          img => img.url !== imageData.url
        );
        return {
          ...prev,
          [`${title}-${index}`]: {
            ...prev[`${title}-${index}`],
            images: updatedImages
          }
        };
      });
  
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error.response?.data || error.message);
      toast.error(
        error.response?.data?.error || 
        'Failed to delete image'
      );
    }
  };

return (
  <Container showChat={showChat}>
  <TitleC>Generate Report</TitleC>
  
  <MainContentWrapper>
    <DocumentSection showChat={showChat}>

      {/* Image Picker for Cover Page */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          <strong>Select Cover Image:</strong>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </label>
        {imageError && <p style={{ color: 'red' }}>{imageError}</p>}
      </div>
      <List component="nav">
        {availableSections.map(({ title, details }) => (
          <React.Fragment key={title}>
            <StyledListItem button onClick={() => handleClick(title)}>
              <ListItemIconStyled>
                {openSections[title] ? <ExpandLess /> : <ExpandMore />}
              </ListItemIconStyled>
              <ListItemText primary={title} />
            </StyledListItem>

            <Collapse in={openSections[title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {details.map((detail, index) => (
                  <React.Fragment key={index}>
                    <StyledListItem style={{ paddingLeft: '4em' }}>
                      <ListItemIconStyled>
                        <Checkbox
                          edge="start"
                          checked={checked[`${title}-${index}`] || false}
                          onChange={() => handleCheck(title, index)}
                        />
                      </ListItemIconStyled>
                      <ListItemText primary={detail} />
                    </StyledListItem>
                    
                    {/* Conditionally render input or fetched data */}
                    {checked[`${title}-${index}`] && (
  title === 'Message from Management' ? (
    <StyledListItem style={{ paddingLeft: '6em' }}>
      <TextField
        label="Description"
        variant="outlined"
        fullWidth
        name="description"
        value={formData[`${title}-${index}-description`] || ''}
        onChange={(e) => handleInputChange(title, index, e)}
        multiline
        rows={4}
      />
    </StyledListItem>
  ) : (
    <StyledListItem 
      style={{ 
        paddingLeft: '6em', 
        flexDirection: 'column', 
        alignItems: 'flex-start',
      }}
      data-section={`${title}-${index}`} // Add this line
    >
      {/* Add Version Tracking Buttons */}
      <Box 
        display="flex" 
        justifyContent="space-between" 
        width="100%" 
        marginBottom="10px"
      >
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => saveSection(title, detail, index)}
        >
          Save Section
        </Button>
  
          <Button 
            variant="outlined" 
            color="secondary"
            onClick={() => handleViewVersions(title,detail,index)}
          >
            View Versions
          </Button>
          <Button 
                      variant="outlined" 
                      color="primary"
                      onClick={() => {
                        setActiveChatSection({ 
                          title: title, 
                          index: index 
                        });
                        setChatMode('feedback');
                        setShowChat(true);
                      }}
                    >
                      Feedback Discussion
                    </Button>

      </Box>
      {/* Display Uploaded Images */}
      
      {selectedData[`${title}-${index}`]?.images && selectedData[`${title}-${index}`].images.length > 0 && (
  <div>
  <h4>Uploaded Images:</h4>
  {selectedData[`${title}-${index}`]?.images?.map((image, idx) => (
    <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      {/* Display the image */}
      <img 
        src={`http://localhost:3000/${image.url}`} 
        alt={`Uploaded ${idx}`} 
        style={{ width: '100px', height: '100px', marginRight: '10px' }} 
      />
      
      {/* Display the description */}
      <div style={{ flexGrow: 1 }}>
        <p style={{ margin: 0 }}>{image.description || 'No description provided'}</p>
      </div>

      {/* Delete button */}
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={() => handleDeleteImage(image, reportSectionDetailId, title, index)}
>
        Delete
      </Button>
    </div>
  ))}
</div>

)}    
 <TextField
        label="YouTube URL (Optional)"
        variant="outlined"
        fullWidth
        value={selectedData[`${title}-${index}`]?.youtubeUrl || ""}
        onChange={(e) => {
          setSelectedData(prev => ({
            ...prev,
            [`${title}-${index}`]: {
              ...prev[`${title}-${index}`],
              youtubeUrl: e.target.value
            }
          }));
        }}
        style={{ marginBottom: '20px' }}
        placeholder="Enter YouTube video URL"
      />

      {/* Validate and Display YouTube Video */}
      {selectedData[`${title}-${index}`]?.youtubeUrl && (
        <Box 
          sx={{ 
            width: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginBottom: '20px'
          }}
        >
          <Typography variant="subtitle1">Preview Video</Typography>
          <iframe
            width="560"
            height="315"
            src={getYouTubeEmbedUrl(selectedData[`${title}-${index}`].youtubeUrl)}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
      )}
  {/* Editable Introduction */}
      <TextField
        label="Introduction"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={selectedData[`${title}-${index}`]?.intro || ""}
        onChange={(e) => {
          setSelectedData(prev => ({
            ...prev,
            [`${title}-${index}`]: {
              ...prev[`${title}-${index}`],
              intro: e.target.value
            }
          }));
        }}
        style={{ marginBottom: '20px' }}
      />
      {/* Image Upload Section */}
      {selectedData[`${title}-${index}`] && (
  <>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={(e) => handleImageChange(title, index, e)}
    />
    {selectedImages[`${title}-${index}`]?.map((imgObj, idx) => (
      <div key={idx}>
        <img
          src={URL.createObjectURL(imgObj.file)}
          alt={`preview-${idx}`}
          style={{ width: '100px', height: '100px', margin: '5px' }}
        />
        <input
          type="text"
          placeholder="Enter description"
          value={imgObj.description}
          onChange={(e) =>
            handleDescriptionChange(title, index, idx, e.target.value)
          }
        />
      </div>
    ))}
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleUploadImages(title, index)}
    >
      Upload Images
    </Button>
  </>
)}

        {/* Display Uploaded Images
        {selectedImages[`${title}-${index}`] && selectedImages[`${title}-${index}`].length > 0 && (
            <div>
                <h4>Selected Images:</h4>
                {selectedImages[`${title}-${index}`].map((file, idx) => (
                    <div key={idx}>
                        <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
                    </div>
                ))}
            </div>
        )} */}
      {/* Editable Data Table */}
      <Paper style={{ width: '100%', overflowX: 'auto', marginBottom: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              {selectedData[`${title}-${index}`]?.data && 
               selectedData[`${title}-${index}`].data.length > 0 &&
               Object.keys(selectedData[`${title}-${index}`].data[0]).map((key) => (
                <TableCell key={key}>{key}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {selectedData[`${title}-${index}`]?.data?.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {Object.entries(row).map(([key, value], colIndex) => (
                  <TableCell key={colIndex}>
                    <TextField
                      value={value}
                      onChange={(e) => {
                        const newData = [...selectedData[`${title}-${index}`].data];
                        newData[rowIndex] = {
                          ...newData[rowIndex],
                          [key]: e.target.value
                        };
                        
                        setSelectedData(prev => ({
                          ...prev,
                          [`${title}-${index}`]: {
                            ...prev[`${title}-${index}`],
                            data: newData
                          }
                        }));
                      }}
                      variant="standard"
                      fullWidth
                    />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Editable Summary */}
      <TextField
        label="Summary"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={selectedData[`${title}-${index}`]?.summary || ""}
        onChange={(e) => {
          setSelectedData(prev => ({
            ...prev,
            [`${title}-${index}`]: {
              ...prev[`${title}-${index}`],
              summary: e.target.value
            }
          }));
        }}
      />

      {/* Optional: Graph Rendering */}
      {selectedData[`${title}-${index}`]?.graphdata && (
        <div style={{ marginTop: '20px', width: '100%' }}>
          <Typography variant="h6">
            {selectedData[`${title}-${index}`].graphdata.config_name}
          </Typography>
          {renderGraphInUI(selectedData[`${title}-${index}`].graphdata)}
        </div>
      )}
    </StyledListItem>
  )
)}

                  </React.Fragment>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
      
          <ButtonContainer>
            <StyledButton onClick={handleSubmit}>Generate Report</StyledButton>
            <button onClick={() => setIsHTMLReport(true)}>Download HTML</button>

            {isHTMLReport && tableOfContents.length > 0 && selectedSections.length > 0 && (
              <HTMLReport
                coverImageUrl={coverImageUrl} 
                tableOfContents={tableOfContents} 
                sections={selectedSections} 
              />
            )}

            {tableOfContents.length > 0 && selectedSections.length > 0 && !isHTMLReport && (
              <PDFGenerator 
                coverImageUrl={coverImageUrl} 
                tableOfContents={tableOfContents} 
                sections={selectedSections} 
                isLoading={isReportLoading}
                onReportGenerated={() => setIsReportLoading(false)} 
              />
            )}
          </ButtonContainer>

      {isReportLoading && (
  <Backdrop 
    sx={{ 
      color: '#fff', 
      zIndex: (theme) => theme.zIndex.drawer + 1 
    }} 
    open={isReportLoading}
  >
    <CircularProgress color="inherit" />
    <Typography variant="h6" sx={{ ml: 2 }}>
      Generating Report...
    </Typography>
  </Backdrop>
)}
      <VersionHistoryModal
        open={openVersionModal.open}
        onClose={() => setOpenVersionModal({ 
          open: false, 
          sectionTitle: '', 
          detailTitle: '', 
          index:'',
          versions: [],
          selectedVersion: null // Reset selected version
        })}
        sectionTitle={openVersionModal.sectionTitle}
        detailTitle={openVersionModal.detailTitle}
        versions={openVersionModal.versions}
        onSelectVersion={handleSelectVersion} // Pass the function to handle version selection
        onBringToEditor={handleBringToEditor} // Pass the function to bring selected version to editor
        selectedVersion={openVersionModal.selectedVersion} // Pass the selected version details
      />
      <ToastContainer />
      </DocumentSection>
      {/* Chat Section */}
      {/* <ChatSection showChat={showChat}>
        <ChatSectionWrapper>
          
        </ChatSectionWrapper>
      </ChatSection> */}
      {renderSectionChat()}
    </MainContentWrapper>
  </Container>
  );
};

export default Documents;