// url of json data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//initialize the page with default plot
function init() {
  // Read the json data
  d3.json(url).then(function(data) {
    console.log(data);
    var dropdownMenu = d3.select("#selDataset");
    data.names.forEach(function(name) {
      dropdownMenu.append("option").text(name).property("value");
    });
    var firstSample = data.names[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

//call init() to initialize the page
init();

//create a function for building the charts
function buildCharts(sample) {
  //Use d3.json to fetch the sample data for the plots
  d3.json(url).then(function(data) {
    //console.log(data);
    var samples = data.samples;
    var resultArray = samples.filter(function(data) {
      return data.id === sample;
    });
    var result = resultArray[0];
    console.log(result);
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    //console.log(otu_ids);
    //console.log(otu_labels);
    //console.log(sample_values);

    //Build a Bubble Chart using the sample data
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0},
      hovermode: "closest",
      xaxis: { title: "OTU ID"},
      margin: { t: 30}
    };
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker:{
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    //Build a Bar Chart using the sample data
    var yticks = otu_ids.slice(0,10).map(function(otuID) {
      return `OTU ${otuID}`;
    }).reverse();
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
      }
    ];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150}
    };
    Plotly.newPlot("bar", barData, barLayout);
  });
}

//create a function for building the metadata
function buildMetadata(sample) {
  //Use d3.json to fetch the metadata for a sample
  d3.json(url).then(function(data) {
    //console.log(data);
    var metadata = data.metadata;
    var resultArray = metadata.filter(function(data) {
      return data.id === parseInt(sample);
    });
    var result = resultArray[0];
    console.log(result);
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(result).forEach(function([key, value]) {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

//create a function for optionChanged
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
};
