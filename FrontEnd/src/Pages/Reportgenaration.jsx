import React, { useState,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, Checkbox, TextField } from '@mui/material';
import { Paper, Table, TableBody, TableContainer,
  TableCell, 
  TableHead, 
  TableRow,
  Typography
} from '@mui/material';
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
import { StyleSheet, Document, Page, Text, View,PDFDownloadLink,Image} from '@react-pdf/renderer';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
// Register the necessary components

import html2canvas from 'html2canvas';
import ChartJsImage from 'chartjs-to-image';
import { getTokenData } from './authUtils';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


const sections = [
  { title: 'Message from Management', details: ["Chairperson's Message", "Principal's Message"] },
  { title: 'Curricular Design and Academic Performances', details: [
    'List of Courses Offered',
    'Overall and Department-wise Faculty Count and Faculty-Student Ratios',
    'Summary of Academic Performance',
    'Overall Pass and Fail Percentage',
    'Department-wise Pass and Fail Percentage',
    'Average CGPA of Students',
    'Graduation Rate of College',
    'Guest Lectures Organized',
    'Department-wise Industrial Visits Organized',
    'University Rank Holders'
  ]},
  {title: 'Research Works & Publications',details:[
    'Institution Research Strategy and Summary',
    'Total Funds Received',
    'Major Grants & Scholarships',
    'List of Ongoing Research Projects',
    'List of Journal Papers Published',
    'List of Patents Grants',
    'Training Programmes Offered'
  ]},
  {
    title:'Faculty Achievement',
    details:[
      'List of Faculties Department-wise',
      'Awards Received',
      'Research Works  Projects and Publications',
      'Advanced Degree / Certifications',
      'Leadership Roles',
      'Public Lectures'
    ]
  },
  {
    title:'Student Achievements',
    details:[
      'Top Performers in Academics',
      'Awards Received by Students',
      'Scholarships Received',
      'Competition Wins',
      'Internships',
      'Projects'
    ]
  }
  ,{
    title:'Financial Statements',
    details:[
      'Income / Revenue Statement',
      'Expenditure',
      'Net Income Statement',
      'Investments'
    ]
  }
  ,
  {
    title:'Infrastructural Development',
    details:[
      'New Academic, Administrative & Residential Buildings Introduced',
      'Renovations & Upgradations',
      'Campus Expansion – Lands Purchase Statements',
      'Laboratories Inaugurated',
      'Equipment Purchase Statements',
      'Utility Improvements',
      'Sustainability & Green Campus Initializations'
    ]
  },
  {
    title:'Extra Curricular Activities',
    details:[
      'List of Clubs & Societies Offered',
      'List of Cells / Committees',
      'List of Sports Available',
      'Workshops & Seminars for Students & Faculties',
      'Cultural Events'
    ]
  }
];
  
const Container = styled.div`
  max-width: 900px;
  margin: 20px auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

// Main Component


const styles = StyleSheet.create({
  page: { 
    padding: 40,
    fontFamily: 'Helvetica', // Use a clean font
    fontSize: 12,
    margin:0,
    color: '#333' // Dark grey for better readability
  },
  header: { 
    fontSize: 18, 
    marginBottom: 10, 
    textAlign: 'center', 
    fontFamily: 'Helvetica-Bold',
    color: '#164863' // Primary color for headers
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
    marginTop:10,
    fontSize: 14, 
    fontWeight: 'bold', 
    marginBottom: 8, 
    textAlign: 'center',
    color: '#164863' // Primary color for section titles
  },
  table: { 
    marginVertical: 10, 
    marginHorizontal: 5, // Narrow margins on the sides
    width: '100%', // Full width
    borderCollapse: 'collapse',
  },
  tableHeaderCell: { 
    border: '1px solid #ddd', 
    padding: 10, 
    textAlign: 'center', 
    fontSize: 12, 
    fontWeight: 'bold', 
    backgroundColor: '#f2f2f2',
    color: '#164863', // Header text color
    flex: 1, // Make each header cell flexible
  },
  tableCell: { 
    border: '1px solid #ddd', 
    padding: 10, 
    textAlign: 'center', 
    fontSize: 12,
    color: '#333', // Dark grey for cell text
    flex: 1, // Make each cell flexible
  },
  titleCell: {
    textAlign: 'left',
    paddingLeft: 8,
  },
  row: {
    flexDirection: 'row',
    width: '100%', // Ensure row takes full width
  },
  alternatingRow: {
    backgroundColor: '#f9f9f9',
  },
});

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
  const chartData = {
    labels: graph.data.map(item => item.name), // Use 'name' instead of 'label'
    datasets: [{
      data: graph.data.map(item => item.value),
      backgroundColor: graph.data.map(item => item.color || 'rgba(75, 192, 192, 0.2)'),
      borderColor: graph.data.map(item => item.color || 'rgba(75, 192, 192, 1)'),
      borderWidth: 1,
    }]
  };

  switch (graph.graph_type) {
    case 'pie':
      return <Pie data={chartData} />;
    case 'bar':
      return <Bar data={chartData} />;
    default:
      return <p>Unsupported graph type: {graph.graph_type}</p>;
  }
};

// Function to generate Chart.js images for PDF
const generateChartImage = async (graph) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validate graph data
      if (!graph || !graph.data || graph.data.length === 0) {
        throw new Error('Invalid graph data');
      }

      // Prepare chart configuration
      const chartConfig = {
        type: graph.graph_type || 'bar',
        data: {
          labels: graph.data.map(item => item.name || 'Unknown'),
          datasets: [{
            label: graph.config_name || 'Data',
            data: graph.data.map(item => item.value),
            backgroundColor: graph.data.map(item => 
              item.color || 'rgba(75, 192, 192, 0.6)'
            ),
            borderColor: graph.data.map(item => 
              item.color || 'rgba(75, 192, 192, 1)'
            ),
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
  const Report = ({ coverImageUrl, tableOfContents, sections }) => {
  const [chartImages, setChartImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchChartImages = async () => {
      const newImages = {};
      
      try {
        // Use Promise.all to wait for all chart images to be generated
        await Promise.all(
          sections.map(async (section) => {
            await Promise.all(
              section.details.map(async (detail) => {
                if (detail.graphdata) {
                  try {
                    const imageUrl = await generateChartImage(detail.graphdata);
                    // Use the detail's title as the key
                    newImages[detail.title] = imageUrl;
                  } catch (error) {
                    console.error(`Error generating chart image for ${detail.title}:`, error);
                    newImages[detail.title] = null; // Provide a fallback
                  }
                }
              })
            );
          })
        );
  
        setChartImages(newImages);
      } catch (error) {
        console.error('Overall chart image generation error:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchChartImages();
  }, [sections]);

  // If images are still loading, return a loading indicator
  if (isLoading) {
    return (
      <Document>
        <Page style={styles.page}>
          <Text>Loading report...</Text>
        </Page>
      </Document>
    );
  }
  return (
    <Document>
      {/* Cover Page */}
      <Page style={styles.page}>
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
                <Text style={styles.tableCell}>{item.page}</Text>
              </View>
              {item.subItems && item.subItems.map((subItem, subIndex) => (
                <View key={subIndex} style={styles.row}>
                  <Text style={styles.tableCell}></Text>
                  <Text style={{ ...styles.tableCell, ...styles.titleCell }}>
                    {`${String.fromCharCode(97 + subIndex)})` + subItem.title}
                  </Text>
                  <Text style={styles.tableCell}>{subItem.page}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Page>

      {/* Content Sections */}
      {sections.map((section, index) => (
        <Page style={styles.page} key={index}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={{ textAlign: 'center', marginBottom: 10 }}>{section.intro}</Text>
          
          {section.details.map((detail, detailIndex) => (
            <View key={detailIndex}>
              <Text style={styles.sectionTitle}>{detail.title}</Text>
              <Text>{detail.intro}</Text>
              
              {/* Render chart image with more robust checking */}
              {detail.graphdata && chartImages[detail.title] && (
                <View style={{ 
                  marginBottom: 20, 
                  width: '100%', 
                  height: 250, 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}>
                  <Text style={styles.sectionTitle}>
                    {detail.graphdata.config_name}
                  </Text>
                  <Image 
                    src={chartImages[detail.title]} 
                    style={{ 
                      width: '80%', 
                      height: 200, 
                      objectFit: 'contain' 
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
          ))}
          
          <Text style={styles.footer}>Page {index + 2}</Text>
        </Page>
      ))}
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
  // const { reportId } = location.state || {};
  const role= getTokenData().role;
  useEffect(() => {
    const fetchAvailableSections = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/report/${reportId}/sections`, {
          params: { role }
        });
        
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
  
    // Fetch data only if checkbox is checked
    if (isChecked) {
      try {
        // First, try to fetch the latest version
        console.log("Trying this");
        const latestVersionResponse = await axios.get('http://localhost:3000/report/section-details', {
          params: {
            reportId: reportId,
            sectionName: sectionTitle,
            subsectionName: sections.find((sec) => sec.title === sectionTitle).details[index],
          }
        });
        setReportSectionDetailId(latestVersionResponse.data.details.id);
        // If latest version exists, use it
        if (latestVersionResponse.data.details) {
          const latestDetails = latestVersionResponse.data.details;
          setSelectedData((prev) => ({
            ...prev,
            [key]: {
              intro: latestDetails.introduction,
              data: latestDetails.data,
              summary: latestDetails.summary,
              graphdata: latestDetails.graph_data
            }
          }));
  
        } else {
          // If no latest version, fetch from section-data
          const response = await axios.get(`http://localhost:3000/report/section-data`, {
            params: { section: sections.find((sec) => sec.title === sectionTitle).details[index] }
          });
          setSelectedData((prev) => ({
            ...prev,
            [key]: response.data
          }));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        
        // Fallback to section-data if version fetch fails
        try {
          const response = await axios.get(`http://localhost:3000/report/section-data`, {
            params: { section: sections.find((sec) => sec.title === sectionTitle).details[index] }
          });
          setSelectedData((prev) => ({
            ...prev,
            [key]: response.data
          }));
        } catch (fallbackError) {
          console.error('Fallback data fetch failed:', fallbackError);
        }
      }
    } else {
      // If checkbox is unchecked, you can clear the selected data for that section
      setSelectedData((prev) => {
        const newData = { ...prev };
        delete newData[key]; // Remove the data for the unchecked section
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
      console.log("response data for save Section");
      console.log(response.data);
      setReportSectionDetailId(response.data.report_section_id);
      toast.success(`Section ${detailTitle} saved successfully (Version ${response.data.version})`);
    } catch (error) {
      console.error('Save failed', error);
      toast.error(`Failed to save ${detailTitle}: ${error.response?.data?.details || error.message}`);
    }
  };


  const handleSubmit = () => {
    const contents = []; // This will hold the Table of Contents entries
  
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
            graphdata: selectedData[key]?.graphdata || null
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
    
    // Update the selected images for the specific section
    setSelectedImages(prev => ({
        ...prev,
        [key]: files
    }));
};

const handleUploadImages = async (sectionTitle, index) => {
  const key = `${sectionTitle}-${index}`;
  const images = selectedImages[key];

  if (!images || images.length === 0) {
    toast.error('No images selected for upload.');
    return;
  }

  const formData = new FormData();
  images.forEach(image => {
    formData.append('images', image);
  });

  // Add reportId and reportSectionDetailId to the form data
  formData.append('reportId', reportId);
  formData.append('reportSectionDetailId', reportSectionDetailId);

  try {
    const response = await axios.post('http://localhost:3000/report/upload-images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    toast.success('Images uploaded successfully');
    setSelectedImages(prev => ({
      ...prev,
      [key]: [] // Clear the selected images after upload
    }));
  } catch (error) {
    console.error('Error uploading images:', error);
    // Log the detailed error response
    if (error.response) {
      console.error('Error details:', error.response.data);
      toast.error(`Failed to upload images: ${error.response.data.error || 'Unknown error'}`);
    } else {
      toast.error('Failed to upload images');
    }
  }
};

return (
    <Container>
      <TitleC>Generate Report</TitleC>
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
        alignItems: 'flex-start' 
      }}
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
        
      </Box>

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
      <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(title, index, e)}
        />
        <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleUploadImages(title, index)}
        >
            Upload Images
        </Button>

        {/* Display Uploaded Images */}
        {selectedImages[`${title}-${index}`] && selectedImages[`${title}-${index}`].length > 0 && (
            <div>
                <h4>Selected Images:</h4>
                {selectedImages[`${title}-${index}`].map((file, idx) => (
                    <div key={idx}>
                        <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
                    </div>
                ))}
            </div>
        )}
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

        {tableOfContents.length > 0 && selectedSections.length > 0 && (
  <PDFDownloadLink
    document={<Report coverImageUrl={coverImageUrl} tableOfContents={tableOfContents} sections={selectedSections} />}
    fileName="myprint1.pdf"
  >
    {({ loading }) => (loading ? 'Loading document...' : 'Download PDF')}
  </PDFDownloadLink>
)}


      </ButtonContainer>
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
    </Container>
  );
};

export default Documents;