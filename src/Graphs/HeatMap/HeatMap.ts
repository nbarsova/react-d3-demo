import * as d3 from 'd3';

export default class HeatMap {

    private rootNode: HTMLDivElement | undefined;
    private d3graph: d3.Selection<any, any, any, any> | undefined;
    private heatMapData: any = [];
    private onMouseOver: (mouseX: number, mouseY: number, tooltip: any) => void = () => {
    };
    private onMouseOut: (ev: any) => void = () => {
    };

    private height: number = 0;
    private width: number = 0;

    public create(rootNode: HTMLDivElement,
                  onMouseOver: (mouseX: number, mouseY: number, tooltip: any) => void,
                  onMouseOut: (ev: any) => void) {
        this.rootNode = rootNode;
        this.height = rootNode.clientHeight - 80;
        this.width = rootNode.clientWidth - 100;
        this.onMouseOver = onMouseOver;
        this.onMouseOut = onMouseOut;

        const d3RootSelection = d3.select(this.rootNode);
        d3RootSelection.selectAll("*").remove();

        let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", this.height);

        this.d3graph = svg.append("g");

        d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
            .then((data: any) => {
                this.heatMapData = data;
                console.log("Received data ", this.heatMapData);
                this.renderGraph();
            });
    }

    private renderGraph = () => {

        let yDomain = [1, 12];
        let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let monthDisplayFunction = (d: any, i: number): string => {
            switch (d) {
                case 1:
                    return "Jan";
                case 2:
                    return "Feb";
                case 3:
                    return "Mar";
                case 4:
                    return "Apr";
                case 5:
                    return "May";
                case 6:
                    return "Jun";
                case 7:
                    return "Jul";
                case 8:
                    return "Aug";
                case 9:
                    return "Sep";
                case 10:
                    return "Oct";
                case 11:
                    return "Nov";
                case 12:
                    return "Dec";
                default:
                    return "";
            }
        };
        let yRange = [this.height - 50, 0];

        let yLineFunction = d3.scaleLinear().domain(yDomain).range(yRange);

        let yearFunction = (d: any) => {
            return d.year;
        };


        let minYear = Number(d3.min(this.heatMapData.monthlyVariance, yearFunction));
        let maxYear = Number(d3.max(this.heatMapData.monthlyVariance, yearFunction));

        let xDomain = [minYear ? minYear : 0, maxYear ? maxYear : 0];
        let xRange = [50, this.width - 50];

        let xLineFunction = d3.scaleLinear()
            .domain(xDomain)
            .range(xRange);

        if (this.d3graph) {

            let yAxis = d3.axisRight(yLineFunction)
                .tickValues(months).tickFormat(monthDisplayFunction);
            this.d3graph.append("g")
                .call(yAxis)
                .attr("transform", "translate(20, 20)");

            let xAxis = d3.axisBottom(xLineFunction);
            this.d3graph.append("g")
                .attr("transform", "translate(0, " + (this.height - 20) + ")")
                .call(xAxis);

            let heatRectWidth = this.width / (maxYear - minYear);
            let heatRectHeight = (this.height - 50) / 12;

            let colorFunction = (d: any) => {
                let temp = this.heatMapData.baseTemperature + d.variance;
                if (temp < 5) {
                    return "blue";
                } else if (temp < 7) {
                    return "yellow"
                } else if (temp < 10) {
                    return "orange";
                } else if (temp < 12) {
                    return "darkred"
                } else return "red";
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
                .on("mouseover", (ev) => {
                    this.onMouseOver(d3.event.clientX, d3.event.clientY, ev);
                })
                .on("mouseout", this.onMouseOut);
        }

    }


}
