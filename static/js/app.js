function buildMetadata(sample) {
  d3.json(`/metadata/${sample}`).then(function(sample){
    var metadataDiv = d3.select("#sample-metadata");
    metadataDiv.html("");
    Object.entries(sample).forEach(([key, value])=>{
      var row = metadataDiv.append("p");
      row.text(`${key}: ${value}`);

  })
})
};

function buildCharts(sample) {
  // PIE CHART
  d3.json(`/samples/${sample}`).then(function(data) {
    var pieValues = data.sample_values.slice(0,10);
    var pieLabel = data.otu_ids.slice(0, 10);
    var pieHover = data.otu_labels.slice(0, 10);

    var data = [{
      values: pieValues,
      labels: pieLabel,
      hovertext: pieHover,
      type: 'pie'
    }];

    Plotly.newPlot('pie', data);
  });


  //BUBBLE CHART
  d3.json(`/samples/${sample}`).then(function(data){
    
    var xValues = data.otu_ids;
    var yValues = data.sample_values;
    var tValues = data.otu_labels;
    var mSize = data.sample_values;
    var mColors = data.otu_ids;

    var bubblePlot = {
      x: xValues,
      y: yValues,
      text: tValues,
      mode: 'markers',
      marker: {
        size: mSize,
        color: mColors
      }
    };
    var data = [bubblePlot];
    Plotly.newPlot('bubble', data);
  });
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
