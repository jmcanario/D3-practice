// Load data in D3
d3.csv("./../data/data.csv")
    .then(function(data) {
        createBubbleChart(data);
    });

// Create a bubble chart with the given data
function createBubbleChart(consoles) {
    // Extract data columns into separate arrays
    const consoleNames = consoles.map(function(console) { return console.ConsoleName; });
    const companies = consoles.map(function(console) { return console.Company; });
    const sales = consoles.map(function(console) { return +console.UnitsSold; });

    // Count companies and find unique companies
    const counts = companies.reduce(function(obj, company) {
        obj[company] = (obj[company] || 0) + 1;
        return obj;
    }, {});

    const uniqueCompanies = new Set(companies);
    const countUniqueCompanies = uniqueCompanies.size;

    // Calculate sales and sales extent    
    const salesExtent = d3.extent(sales);

    // Chart dimensions
    let dimensions = {
        width: 1200,
        height: 700,
        margin: {
            top: 50,
            left: 50,
            right: 50,
            bottom: 50
        }
    };

    // Create main SVG
    const svg = d3.select('#chart')
        .append('svg')
        .attr('width', dimensions.width)
        .attr('height', dimensions.height);

    // Create container for the chart
    const container = svg.append('g')
        .attr('transform', `translate(${dimensions.margin.left}, ${dimensions.margin.right})`);

    // Circle sizes and scales
    const circleSize = { min: 10, max: 80 };
    const circleRadiusScale = d3.scaleSqrt()
        .domain(salesExtent)
        .range([circleSize.min, circleSize.max]);

    // Create circles and labels
    createCircles();

    // Create legend
    createLegend();

    // Create forces and force simulation
    createForces();
    createForceSimulation();

    // Function to create circles and labels
    function createCircles() {
        var formatSales = d3.format(",");

        // Create circles
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

        // Update console info on hover
        function updateConsoleInfo(d) {
            var info = "";

            if (d) {
                info = [d.ConsoleName, formatSales(d.UnitsSold)].join(": ") + ' mill';
            }
            d3.select("#sales-info").html(info);
        }

               // Create labels for each bubble
               labels = svg.selectAll(".label")
               .data(consoles)
               .enter()
               .append("text")
               .attr("class", "label")
               .text(function(d) { return d.ConsoleName; })
               .attr("text-anchor", "middle")
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
   
           // Function to calculate text width based on font size
           function getTextWidth(text, fontSize) {
               const canvas = document.createElement("canvas");
               const context = canvas.getContext("2d");
               context.font = fontSize + "px sans-serif";
               const metrics = context.measureText(text);
               return metrics.width;
           }
   
           // Apply color to bubbles based on company
           const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
               .domain(companies);
           circles.attr("fill", function(d) { return colorScale(d.Company); });
       }
   
       // Function to create legend
       function createLegend() {
           const legendSpacing = 25; // Spacing between legend items
           const legendHeight = uniqueCompanies.size * legendSpacing;
   
           // Create legend container
           const legend = svg.append('g')
               .attr('class', 'legend')
               .attr('transform', `translate(${dimensions.width - 220}, ${dimensions.height - dimensions.margin.bottom - legendHeight})`);
   
           // Create legend data
           const legendData = Array.from(uniqueCompanies).map(company => ({ Company: company }));
   
           // Create a new color scale for the legend to avoid conflicts
           const legendColorScale = d3.scaleOrdinal(d3.schemeCategory10)
               .domain(legendData.map(d => d.Company));
   
           // Create legend items
           const legendItem = legend.selectAll('.legend-item')
               .data(legendData)
               .enter()
               .append('g')
               .attr('class', 'legend-item')
               .attr('transform', (d, i) => `translate(0, ${i * 25})`);
   
           // Add colored rectangles to legend items
           legendItem.append('rect')
               .attr('width', 20)
               .attr('height', 20)
               .attr('fill', d => legendColorScale(d.Company));
   
           // Add company names to legend items
           legendItem.append('text')
               .attr('x', 25)
               .attr('y', 15)
               .text(d => d.Company);
       }
   
       // Function to create forces
       function createForces() {
           var forceStrength = 0.05;
   
           forces = createCombineForces();
   
           function createCombineForces() {
               return {
                   x: d3.forceX(dimensions.width / 2).strength(forceStrength),
                   y: d3.forceY(dimensions.height / 2).strength(forceStrength)
               };
           }
       }
    // Function to create force simulation
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
                labels
                    .attr("x", function(d) { return d.x; })
                    .attr("y", function(d) { return d.y; });
            });

        function forceCollide(d) {
            return circleRadiusScale(d.UnitsSold);
        }
    }
}
