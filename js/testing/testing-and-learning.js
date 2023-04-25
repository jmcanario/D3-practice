 // Loading data in D3
d3.csv("./../data/data.csv")
    .then(function(data) {
    createBubbleChart(data);
    // createLegend();
});


// Creating funtion with values
function createBubbleChart(consoles) {

// Creating columns and showing values in a variable 
    const consoleNames = consoles.map(function(console) { return console.ConsoleName; });
    const companies = consoles.map(function(console) { return console.Company; });
    const sales = consoles.map(function(console) { return +console.UnitsSold; });

// Companies counting
    const counts = companies.reduce(function(obj, company) {
        obj[company] = (obj[company] || 0) + 1;
        return obj;
      }, {});


    const uniqueCompanies = new Set(companies);
    const countUniqueCompanies = uniqueCompanies.size;

// Creating useful information to build bubbles in variables
    const meanSales = d3.mean(sales) // Make the average in the sales column
    const salesExtent = d3.extent(sales) // Compute minimum and maximum in the sales column

// Chart dimentions and added to the container to display
    let dimentions ={
        width: 1000,
        height: 800,
        margin:{
            top: 50,
            left: 50,
            right: 50,
            bottom: 50
        } 
    }

    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimentions.width)
        .attr('height', dimentions.height)

    const container = svg.append('g')
        .attr('transform', `translate(${dimentions.margin.left}, ${dimentions.margin.right})`)
 
// Circles and their sizes

    const circleSize = { min: 10, max: 80 }; // Min and max sizes
    const circleRadiusScale = d3.scaleSqrt() // appliyin sizes to radious
    .domain(salesExtent)
    .range([circleSize.min, circleSize.max]);

// Create circles for bubbles

createCircles();

  function createCircles() {
    var formatSales = d3.format(",");
     circles = svg.selectAll("circle")
      .data(consoles)
      .enter()
        .append("circle")
        .attr("r", function(d) { return circleRadiusScale(d.UnitsSold); })
        .on("mouseover", function() {
          updateConsoleInfo(this.__data__);
        })
        .on("mouseout", function(d) {
          updateConsoleInfo();
        });

   // showing information of the company and units solds in the html
    function updateConsoleInfo(d) {
        var info = "";
    

      if (d) {
        info = [d.ConsoleName, formatSales(d.UnitsSold)].join(": ") + ' mill';
      }
      d3.select("#sales-info").html(info);
  
    }
    // Create labels for each bubble to be added later on
    labels = svg.selectAll(".label") 
    .data(consoles)
        .enter()
            .append("text")
            .attr("class", "label")
            .text(function(d) { return d.ConsoleName; })
            .attr("text-anchor", "middle")
            
            // Adapt the text based in the bubble size     

            .style("font-size", function(d) {
                let fontSize = circleRadiusScale(d.UnitsSold) / 2;
                const circleDiameter = circleRadiusScale(d.UnitsSold) * 2;
                let textWidth = getTextWidth(d.ConsoleName, fontSize);
            
                while (textWidth > circleDiameter) {
                  fontSize = fontSize * 0.9;
                  textWidth = getTextWidth(d.ConsoleName, fontSize);
                }
                return fontSize + "px";
  });

            function getTextWidth(text, fontSize) {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                context.font = fontSize + "px sans-serif";
                const metrics = context.measureText(text);
                return metrics.width;
              }
          
// adding color to bubbles
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(companies);
circles.attr("fill", function(d) { return colorScale(d.Company); });
  }

// Build a legend 

//  const legendSvg = d3.select('#chart')
//   .append('svg')
//   .attr('class', 'legend-svg')
//   .attr('width', 150)
//   .attr('height', dimentions.height);

const legendSpacing = 25; // Spacing between legend items
const legendHeight = uniqueCompanies.size * legendSpacing;

  const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${dimentions.width - 200}, ${dimentions.height - dimentions.margin.bottom -  legendHeight})`);

  function createLegend() {
    const legendData = Array.from(uniqueCompanies).map(company => ({ Company: company }));
  
    // Create a new color scale for the legend to avoid conflicts
    const legendColorScale = d3.scaleOrdinal(d3.schemeCategory10)
      .domain(legendData.map(d => d.Company));
  
    const legendItem = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);
  
    legendItem.append('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', d => legendColorScale(d.Company));
  
    legendItem.append('text')
      .attr('x', 25)
      .attr('y', 15)
      .text(d => d.Company);
  }

  createLegend();
//---------------
createForces();
createForceSimulation();


function createForces() {
    var forceStrength = 0.05;

     forces = createCombineForces();
      
    function createCombineForces() {
        return {
          x: d3.forceX(dimentions.width / 2).strength(forceStrength),
          y: d3.forceY(dimentions.height / 2).strength(forceStrength)
        };
      }
      
      
  }
    
// interesting!!

  function createForceSimulation() {
    forceSimulation = d3.forceSimulation()
      .force("x", forces.x)
      .force("y", forces.y)
      .force("collide", d3.forceCollide(forceCollide));
    forceSimulation.nodes(consoles)
      .on("tick", function() {
       circles
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
          labels // Add this block to update the labels' positions
        .attr("x", function(d) { return d.x; })
        .attr("y", function(d) { return d.y; });
      });
      
      function forceCollide(d) { return circleRadiusScale(d.UnitsSold); }
  }    
    
}