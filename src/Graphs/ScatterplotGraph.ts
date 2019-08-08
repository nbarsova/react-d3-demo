import * as d3 from "d3";

export default class ScatterplotGraph {


    private rootNode: HTMLDivElement | undefined;
    private height: number = 0;
    private width: number = 0;

    private timeConverter = (time?: string) => {
        let date = new Date();
        if (time) {
            date = new Date(1970, 0, 1, 0, Number(time.substring(0, time.indexOf(":"))), Number(time.substring(time.indexOf(":") + 1, time.length)));
        }
        return date.getSeconds();
    }


    public create(rootNode: HTMLDivElement) {
        this.rootNode = rootNode;
        this.height = rootNode.clientHeight - 80;
        this.width = rootNode.clientWidth - 100;

        const d3RootSelection = d3.select(this.rootNode);
        d3RootSelection.selectAll("*").remove();

        let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", this.height);

        d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
            .then((data: any) => {
                console.log(data);
                let timeMax = d3.max(data, (d: any) => {
                    return d.Time;
                });

                let yDomain = [0, this.timeConverter(timeMax)];
                let yRange = [this.height - 20, 0];

                let yLineFunction = d3.scaleLinear().domain(yDomain).range(yRange);
                let yAxis = d3.axisRight(yLineFunction);
                let yAxisG = svg.append("g")
                    .attr("id", "y-axis")
                    .call(yAxis);

                let minYear = d3.min(data, (d: any) => {
                    return d.Year;
                });

                let maxYear = d3.max(data, (d: any) => {
                    return d.Year;
                });

                let xDomain = [Number(minYear), Number(maxYear)];

                let xRange = [0, this.width];

                let xLineFunction = d3.scaleLinear()
                    .domain(xDomain)
                    .range(xRange);

                let xAxis = d3.axisBottom(xLineFunction);

                let xAxisG = svg.append("g")
                    .attr("id", "x-axis")
                    .attr("transform", "translate(0, " + (this.height - 20) + ")")
                    .call(xAxis);

                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("r", 10)
                    .attr("cx", (d: any) => {
                        return xLineFunction(d.Year);
                    })
                    .attr("cy", (d: any) => {
                        return (yLineFunction(this.timeConverter(d.Time)));
                    });
            });


    }
}