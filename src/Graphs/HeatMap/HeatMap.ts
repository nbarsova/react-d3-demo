import * as d3 from 'd3';

export default class HeatMap {

    private rootNode: HTMLDivElement | undefined;
    private legendNode: HTMLDivElement | undefined;
    private d3graph: d3.Selection<any, any, any, any> | undefined;
    private d3Legend: d3.Selection<any, any, any, any> | undefined;
    private heatMapData: any = [];
    private onMouseOver: (mouseX: number, mouseY: number, tooltip: any) => void
        = () => {
    };
    private onMouseOut: (ev: any) => void
        = () => {
    };

    private height: number = 0;
    private width: number = 0;

    private monthNames = ["Jan", "Feb",
        "Mar", "Apr", "May",
        "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];

    private monthDisplayFunction = (d: any): string => {
        return this.monthNames[d - 1];
    };

    private colors = ["darkblue", "blue",
        "lightblue", "lavender", "yellow",
        "orange", "orangered", "darkred"];

    public create(rootNode: HTMLDivElement,
                  onMouseOver: (mouseX: number, mouseY: number, tooltip: any) => void,
                  onMouseOut: (ev: any) => void,
                  legendNode: HTMLDivElement) {
        this.rootNode = rootNode;
        this.height = rootNode.clientHeight - 80;
        this.width = rootNode.clientWidth - 100;
        this.onMouseOver = onMouseOver;
        this.onMouseOut = onMouseOut;
        this.legendNode = legendNode;

        const d3RootSelection = d3.select(this.rootNode);
        d3RootSelection.selectAll("*").remove();

        let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", this.height);

        this.d3graph = svg.append("g");

        const d3LegendSelection = d3.select(this.legendNode);
        d3LegendSelection.selectAll("*").remove();

        this.d3Legend = d3LegendSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", 50);

        this.d3graph = svg.append("g");

        d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
            .then((data: any) => {
                this.heatMapData = data;
                // console.log("Received data ", this.heatMapData);
                this.renderGraph();
            });
    }

    private renderGraph = () => {

        let yDomain = [1, 12];

        let yRange = [this.height - 50, 0];

        let yLineFunction = d3.scaleLinear().domain(yDomain).range(yRange);

        let yearFunction = (d: any) => {
            return d.year;
        };

        let varianceFunction = (d: any) => {
            return d.variance;
        }

        let minYear = Number(d3.min(this.heatMapData.monthlyVariance, yearFunction));
        let maxYear = Number(d3.max(this.heatMapData.monthlyVariance, yearFunction));


        let xDomain = [minYear ? minYear : 0, maxYear ? maxYear : 0];
        let xRange = [50, this.width - 50];

        let xLineFunction = d3.scaleLinear()
            .domain(xDomain)
            .range(xRange);

        if (this.d3graph) {

            let yAxis = d3.axisRight(yLineFunction)
                .tickFormat(this.monthDisplayFunction);
            this.d3graph.append("g")
                .call(yAxis)
                .attr("transform", "translate(20, 20)");

            let xAxis = d3.axisBottom(xLineFunction)
                .tickFormat(d3.format("d"));
            this.d3graph.append("g")
                .attr("transform", "translate(0, " + (this.height - 20) + ")")
                .call(xAxis);

            let heatRectWidth = this.width / (maxYear - minYear);
            let heatRectHeight = (this.height - 50) / 12;

            let minVariance = Number(d3.min(this.heatMapData.monthlyVariance, varianceFunction));
            let maxVariance = Number(d3.max(this.heatMapData.monthlyVariance, varianceFunction));
            console.log("Maximum variance: ", maxVariance);
            console.log("Minimum variance: ", minVariance);

            let minTemp = this.heatMapData.baseTemperature + minVariance;
            let maxTemp = this.heatMapData.baseTemperature + maxVariance;

            let tempStep = (minTemp > 0)
                ? ((maxTemp - minTemp) / this.colors.length)
                : (maxTemp + minTemp) / this.colors.length;

            let colorFunction = (d: any) => {
                let temp = this.heatMapData.baseTemperature + d.variance;

                let tempDiff = Math.ceil((temp - minTemp) / tempStep);
                return this.colors[tempDiff - 1];
            }

            this.d3graph.selectAll("rect").data(this.heatMapData.monthlyVariance)
                .enter()
                .append("rect")
                .attr("width", heatRectWidth)
                .attr("height", heatRectHeight)
                .attr('x', function (d: any) {
                    return xLineFunction(d.year);
                })
                .attr("y", (d: any) => {
                    return yLineFunction(d.month);
                })
                .attr("fill", (d: any) => colorFunction(d))
                .on("mouseover", (ev: any) => {
                    this.onMouseOver(d3.event.clientX, d3.event.clientY,
                        ev.year + " - " + this.monthDisplayFunction(ev.month) + ", temperature: " + (this.heatMapData.baseTemperature + ev.variance).toFixed(2));
                })
                .on("mouseout", this.onMouseOut);
            this.renderLegend(minTemp, maxTemp, tempStep);
        }

    }

    private renderLegend(minTemp: number, maxTemp: number, tempStep: number) {
        if (this.d3Legend) {
            console.log(this.legendNode);

            let legendDomain = [];

            for (let i = 0; i < this.colors.length; i++) {
                legendDomain.push(minTemp + tempStep * i);
            }
            legendDomain.push(maxTemp);

            let legendRange = Array.from(this.colors);
            legendRange.unshift("white");
            legendRange.push("white");

            let legendLineFunction = d3
                .scaleThreshold()
                .domain(legendDomain)
                // @ts-ignore
                .range(legendRange);

            console.log(legendDomain, legendRange);

            let simpleX = d3.scaleLinear()
                .domain([minTemp, maxTemp])
                .range([0, (this.colors.length - 1) * 50]);

            console.log("Simple x", simpleX.domain(), simpleX.range());

            let legendAxis = d3.axisBottom(simpleX)
                .tickSize(7)
                .tickValues(legendLineFunction.domain())
                .tickFormat(d3.format(".2f"));


            let legendG = this.d3Legend
                .append("g")
                .attr("transform", "translate(100, 30)")
                .call(legendAxis)
                .attr("id", "legendAxis");

            legendG.selectAll("rect")
                .data(legendLineFunction.range().map(function (color: any) {
                    let d = legendLineFunction.invertExtent(color);
                    if (d[0] == null) d[0] = 0;
                    if (d[1] == null) d[1] = Number.POSITIVE_INFINITY;
                    return d;
                }))
                .enter().insert("rect")
                .attr("height", 8)
                .attr("x", function (d: any) {
                    return simpleX(d[1]);
                })
                .attr("width", function (d: any) {
                    return simpleX(d[1]) - simpleX(d[0])
                })
                .attr("fill", function (d: any) {
                    return legendLineFunction(d[1]);
                })
                .attr("treshold", function (d: any) {
                    return (d[0] + "-" + d[1])
                });

            legendG.append("text")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .attr("y", -6)
                .text("Temperature in C");

        }
    }


}
