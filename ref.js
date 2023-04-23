function createBubbleChart(data) {
    const width = 800;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  
    const svg = d3.select('body')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
  
    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d['Released Year'])])
      .range([0, width]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d['Units sold (million)'])])
      .range([height, 0]);
  
    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d['Units sold (million)'])])
      .range([0, 40]);
  
    const bubbles = svg.selectAll('circle')
      .data(data)
      .join('circle')
      .attr('cx', d => xScale(d['Released Year']))
      .attr('cy', d => yScale(d['Units sold (million)']))
      .attr('r', d => radiusScale(d['Units sold (million)']))
      .attr('fill', 'steelblue')
      .attr('stroke', 'black')
      .attr('stroke-width', 1);
  
    // Add labels or axes as needed
  }

 // gpt

d3.csv('data.csv').then(data => {
    data.forEach(d => {
      d['Released Year'] = +d['Released Year'];
      d['Discontinuation Year'] = +d['Discontinuation Year'];
      d['Units sold (million)'] = +d['Units sold (million)'];
    });
  
    // Call the function to create the bubble chart
    createBubbleChart(data);
  });
  function createBubbleChart(data) {
    // Define the options for the BubbleChart function
    const options = {
      label: d => d['Console Name'],
      value: d => d['Units sold (million)'],
      group: d => d['Company'],
      title: d => `${d['Console Name']} (${d['Company']}) - Units sold: ${d['Units sold (million)']} million`,
    };
  
    // Create the bubble chart and append it to the body
    const bubbleChart = BubbleChart(data, options);
    document.body.appendChild(bubbleChart);
  }
    