import * as d3 from 'd3';

export default class barChart {
    private rootNode: HTMLDivElement | undefined;
    private d3graph: d3.Selection<any, any, any, any> | undefined;
    private chartData: any = [];

    private height: number = 0;
    private width: number = 0;

    private xAxis: any;
    private yAxis: any;

    private yDomain: number[] = [0, 1];
    private yRange: number[] = [0, 100];

    create(rootNode: HTMLDivElement) {
        this.rootNode = rootNode;
        this.height = rootNode.clientHeight - 80;
        this.width = rootNode.clientWidth - 100;


        d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
            .then((data: any) => {
                this.chartData = data.data;
                console.log(this.chartData);
                this.renderGraph();
            });

        const d3RootSelection = d3.select(this.rootNode);
        d3RootSelection.selectAll("*").remove();

        let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", this.height);

        this.d3graph = svg.append("g");


    }

    private renderGraph = () => {
        let gdpMax = d3.max(this.chartData, (d: any) => {
            return d[1];
        });

        let minYear = d3.min(this.chartData, (d: any) => {
            return d[0];
        });

        let maxYear = d3.max(this.chartData, (d: any) => {
            return d[0];
        });

        let barWidth = this.width / this.chartData.length;

        this.yDomain = [0, Number(gdpMax)];
        this.yRange = [this.height, 0];

        let yLineFunction = d3.scaleLinear().domain(this.yDomain).range(this.yRange);

        if (this.d3graph) {

            let yAxis = d3.axisRight(yLineFunction);
            let yAxisG = this.d3graph.append("g")
                .call(yAxis);

            this.d3graph.selectAll("rect").data(this.chartData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", (d: any, i) => {
                   return this.height - yLineFunction(d[1]);
                })
                .attr("x", (d, i) => {
                    return i * barWidth - 2;
                })
                .attr("y",  (d: any) => {
                    return yLineFunction(d[1]);
                })
                .style("fill", "darkred");
        }

    }
}