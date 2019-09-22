import * as d3 from "d3";

export default class ScatterplotGraph {


    private rootNode: HTMLDivElement | undefined;
    private height: number = 0;
    private width: number = 0;

    private timeConverter = (time: number) => {
        let min= Math.floor(time/60);
        let sec=time-60*min;
        let date = new Date(1970,
                0,
                1,
                0,
            min,
            sec,
            0);
        console.log(time, date);

        return date;
    }


    public create(rootNode: HTMLDivElement,
                  onMouseOver: (mouseX: number, mouseY: number, tooltip: any)=> void,
                  onMouseOut: (ev: any)=>void) {
        this.rootNode = rootNode;
        this.height = rootNode.clientHeight - 80;
        this.width = rootNode.clientWidth - 100;

        const d3RootSelection = d3.select(this.rootNode);
        d3RootSelection.selectAll("*").remove();

        let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", this.height);

        let timeFormat = d3.timeFormat("%M:%S");

        d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
            .then((data: any) => {

                let timeMax = d3.max(data, (d: any) => {
                    return Number(d.Seconds);
                });
                let timeMin = d3.min(data, (d: any) => {
                    return Number(d.Seconds);
                });

                if (!timeMax) timeMax = 0;
                if (!timeMin) timeMin = 0;

                let yDomain = [this.timeConverter(timeMax+20), this.timeConverter(timeMin-20)];
                let yRange = [this.height - 20, 0];

                let yLineFunction = d3.scaleTime().domain(yDomain).range(yRange);
                // @ts-ignore
                let yAxis = d3.axisRight(yLineFunction).tickFormat(timeFormat);

                svg.append("g")
                    .attr("id", "y-axis")
                    .call(yAxis);

                let minYear = d3.min(data, (d: any) => {
                    return d.Year;
                });

                let maxYear = d3.max(data, (d: any) => {
                    return d.Year;
                });

                let xDomain = [Number(minYear)-1, Number(maxYear)+2];

                let xRange = [0, this.width];

                let xLineFunction = d3.scaleLinear()
                    .domain(xDomain)
                    .range(xRange);


                let xAxis = d3.axisBottom(xLineFunction)
                    .tickFormat(d3.format("d"));

                let xAxisG = svg.append("g")
                    .attr("id", "x-axis")
                    .attr("transform", "translate(0, " + (this.height - 20) + ")")
                    .call(xAxis);

                svg.selectAll("circle")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("r", 8)
                    .attr("cx", (d:any) => {
                        return xLineFunction(d.Year);
                    })
                    .attr("cy", (d:any) => {
                        return (yLineFunction(this.timeConverter(d.Seconds)));
                    })
                    .attr("fill", (d:any)=> {
                        return d.Doping===""?"green":"red";
                    })
                    .on("mouseover", (ev)=> {
                        onMouseOver(d3.event.clientX, d3.event.clientY, ev);
                    })
                    .on("mouseout", onMouseOut);
            });


    }
}
