import * as d3 from 'd3';

export default class barChart {
    private rootNode: HTMLDivElement | undefined;
    private d3graph: d3.Selection<any, any, any, any> | undefined;
    private chartData: any = [];

    private height: number = 0;
    private width: number = 0;

    private yDomain: number[] = [0, 1];
    private yRange: number[] = [0, 100];
    private xDomain: number[] = [0, 1];
    private xRange: number[] = [0, 100];
    private tooltip: any;
    private overlay: any;

    create(rootNode: HTMLDivElement) {
        this.rootNode = rootNode;
        this.height = rootNode.clientHeight - 80;
        this.width = rootNode.clientWidth - 100;


        d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
            .then((data: any) => {
                this.chartData = data.data;
                this.renderGraph();
            });

        const d3RootSelection = d3.select(this.rootNode);
        d3RootSelection.selectAll("*").remove();

        let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", this.height);

        this.d3graph = svg.append("g");

        this.overlay = svg.append('div')
            .attr("id", 'overlay')
            .style("position", "absolute")
            .style("pointer-events", "none")
            .attr("height", 40)
            .attr("width", 100)
            .style("background", "#fff")
            .style('opacity', 0);

        this.tooltip = svg.append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .attr("height", 40)
            .attr("width", 100)
            .style("opacity", 0);


    }

    private renderGraph = () => {
        let gdpMax = d3.max(this.chartData, (d: any) => {
            return d[1];
        });

        let dateAccessor = this.chartData && this.chartData.map(function(item: any) {
            return new Date(item[0]);
        });

        let dateformatter = this.chartData.map((item: any) => {
            var quarter;
            var temp = item[0].substring(5, 7);

            if(temp === '01') {
                quarter = '1';
            }
            else if (temp === '04'){
                quarter = '2';
            }
            else if(temp === '07') {
                quarter = '3';
            }
            else if(temp ==='10') {
                quarter = '4';
            }

            return item[0].substring(0, 4) + '-' + quarter
        });

        let gdp = this.chartData.map((item: any)=> {
            return item[1]
        });

        // @ts-ignore
        let maxDate = new Date(d3.max(dateAccessor));
        maxDate.setMonth(maxDate.getMonth() + 3);
        let minDate = d3.min(dateAccessor);

        let barWidth = this.width / this.chartData.length;

        this.yDomain = [0, Number(gdpMax)];
        this.yRange = [this.height - 50, 0];

        this.xDomain = [minDate, maxDate];
        this.xRange = [0, this.width];

        let yLineFunction = d3.scaleLinear().domain(this.yDomain).range(this.yRange);
        let xLineFunction = d3.scaleTime()
            .domain(this.xDomain)
            .range(this.xRange);

        if (this.d3graph) {

            let yAxis = d3.axisRight(yLineFunction);
            this.d3graph.append("g")
                .call(yAxis);

            let xAxis = d3.axisBottom(xLineFunction);
            this.d3graph.append("g")
                .attr("transform", "translate(0, " + (this.height - 50) + ")")
                .call(xAxis);

            this.d3graph.selectAll("rect").data(this.chartData)
                .enter()
                .append("rect")
                .attr("width", barWidth)
                .attr("height", (d: any, i) => {
                    return this.height - 50 - yLineFunction(d[1]);
                })
                .attr('x', function(d, i) {
                    return  xLineFunction(dateAccessor[i]);
                })
                .attr("y", (d: any) => {
                    return yLineFunction(d[1]);
                })
                .on('mouseover', (d:any, i:any) => {
                    this.overlay.transition()
                        .duration(0)
                        .style('height', d + 'px')
                        .style('opacity', .9)
                        .style('left', (i * barWidth) + 0 + 'px')
                        .style('top', Number(this.height) - d + 'px')
                        .style('transform', 'translateX(60px)');
                    this.tooltip.transition()
                        .duration(200)
                        .style('opacity', .9);
                    this.tooltip.html(dateformatter[i]+'<br>'
                        +gdp[i]+"$")
                        .attr('data-date', this.chartData[i][0])
                        .style('left', (i * barWidth) + 30 + 'px')
                        .style('top', Number(this.height) + 100 + 'px')
                        .style('transform', 'translateX(60px)');
                })
                .on('mouseout', (d) => {
                    this.tooltip.transition()
                        .duration(200)
                        .style('opacity', 0);
                    this.overlay.transition()
                        .duration(200)
                        .style('opacity', 0);
                })
                .attr('data-date', (d, i) => {
                    return this.chartData[i][0]
                })
                .attr("data-gdp", (d: any)=>{
                    return d[1]
                })
                .style("fill", "darkred");


        }

    }
}