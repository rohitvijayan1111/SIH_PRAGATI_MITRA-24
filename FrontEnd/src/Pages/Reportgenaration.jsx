import React, { useState,useEffect } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, Checkbox, TextField } from '@mui/material';
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
  max-width: 600px;
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
const Documents = () => {
  const [openSections, setOpenSections] = useState({});
  const [checked, setChecked] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedData, setSelectedData] = useState({}); // State to hold fetched data
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [imageError, setImageError] = useState(''); 
  const [tableOfContents, setTableOfContents] = useState([]);
  const [selectedSections, setSelectedSections] = useState([]); // Renamed from sections

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
    if (isChecked && sectionTitle !== 'Message from Management') {
      try {
        const response = await axios.get(`http://localhost:3000/report/section-data`, {
          params: { section: sections.find((sec) => sec.title === sectionTitle).details[index] }
        });
        setSelectedData((prev) => ({
          ...prev,
          [key]: response.data
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      // Remove data if checkbox is unchecked
      setSelectedData((prev) => {
        const newData = { ...prev };
        delete newData[key];
        return newData;
      });
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
        {sections.map(({ title, details }) => (
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
                          <StyledListItem style={{ paddingLeft: '6em', flexDirection: 'column', alignItems: 'flex-start' }}>
                            {/* Display the intro text */}
                            <ListItemText primary="Introduction" secondary={selectedData[`${title}-${index}`]?.intro || "Loading..."} style={{ marginBottom: '10px' }} />
                            {/* Conditionally render the graph */}
                            {selectedData[`${title}-${index}`]?.graphdata && (
                              <div>
                                <h4>{selectedData[`${title}-${index}`].graphdata.config_name}</h4>
                                {renderGraphInUI  (selectedData[`${title}-${index}`].graphdata)}
                              </div>
                            )}
                            {/* Display the data as a table */}
                            <table style={{ width: '100%', marginBottom: '10px', borderCollapse: 'collapse' }}>
                              <thead>
                                <tr>
                                  {selectedData[`${title}-${index}`]?.data && selectedData[`${title}-${index}`].data.length > 0 &&
                                    Object.keys(selectedData[`${title}-${index}`].data[0]).map((key) => (
                                      <th key={key} style={{ border: '1px solid #ddd', padding: '8px' }}>{key}</th>
                                    ))}
                                </tr>
                              </thead>
                              <tbody>
                                {selectedData[`${title}-${index}`]?.data?.map((row, rowIndex) => (
                                  <tr key={rowIndex}>
                                    {Object.values(row).map((value, colIndex) => (
                                      <td key={colIndex} style={{ border: '1px solid #ddd', padding: '8px' }}>{value}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>

                            {/* Display the summary text */}
                            <ListItemText primary="Summary" secondary={selectedData[`${title}-${index}`]?.summary || "Loading..."} />
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
      <ToastContainer />
    </Container>
  );
};

export default Documents;