async function draw() {
    // Data 
const dataset = await d3.csv('data.csv')

    // Chart dimentions calculation
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

    // Draw Chart
const svg = d3.select('#chart')
    .append('svg')
    .attr('width', dimentions.width)
    .attr('height', dimentions.height)

const container = svg.append('g')
    .attr('transform', `translate(${dimentions.margin.left}, ${dimentions.margin.right})`)

    container.append('circle')
        .attr('r', 30)

}

draw()