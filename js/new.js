 // Loading data in D3
d3.csv("./../data/data.csv")
    .then(function(data) {
    createBubbleChart(data);
});


// Creating funtion with values
function createBubbleChart(consoles) {


    // Creating columns and showing values in a variable 
    const consoleNames = consoles.map(function(console) { return console.ConsoleName; });
    const companies = consoles.map(function(console) { return console.Company; });
    const sales = consoles.map(function(console) { return +console.UnitsSold; });

    // Creating useful information to build bubbles in variables
    const meanSales = d3.mean(sales) // Make the average in the sales column
    const salesExtent = d3.extent(sales) // Compute minimum and maximum in the sales column
   
   
 
     // Chart dimentions and added to the container to display
let dimentions ={
    width: 800,
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

//-----------------------------





createCircles();


  function createCircles() {
    var formatSales = d3.format(",");
    const circles = svg.selectAll("circle")
      .data(consoles)
      .enter()
        .append("circle")
        .attr("r", function(d) { return circleRadiusScale(d.UnitsSold); })     

  }


console.log(circles)
    
}