import * as d3 from 'd3';

export default class JoiningGraph {

    private rootNode: HTMLDivElement | undefined;
    private d3graph: d3.Selection<any, any, any, any> | undefined;
    private data: any [] = [];

    private height: number = 0;
    private width: number = 0;

    private xLineFunction: any;
    private yLineFunction: any;
    private xAxis: any;

    private xAxisG: any;
    private xDomain: number[] = [0, 1];
    private xRange: number[] = [0, 100];
    private graphArea: any;

    create(rootNode: HTMLDivElement) {
        this.rootNode = rootNode;
        this.height = rootNode.clientHeight - 80;
        this.width = rootNode.clientWidth - 100;

        const d3RootSelection = d3.select(this.rootNode);
        d3RootSelection.selectAll("*").remove();

        let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", this.height);

        this.d3graph = svg.append("g");

        let yMax = d3.max(this.data, (d: { x: number, y: number }) => d.y);

        if (!yMax) {
            yMax = 0;
        }

        let yDomain = [0, yMax + 2];
        let yRange = [this.height - 20, 10];
        this.yLineFunction = d3.scaleLinear().domain(yDomain).range(yRange);

        this.xDomain = [0, 200];
        this.xRange = [0, this.width];
        this.xLineFunction = d3.scaleLinear().domain(this.xDomain).range(this.xRange);

        this.xAxis = d3.axisTop(this.xLineFunction);
        this.xAxisG = this.d3graph.append("g")
            .attr("transform", "translate(0,20)")
            .call(this.xAxis);

        this.graphArea = this.d3graph.append("g");
    }

    changeData(data: any []) {
        console.log(data);
        this.data = data;

        if (this.graphArea) {
            let lineNames = this.graphArea.selectAll('text').data(data);

            lineNames.enter().append("text")
                .merge(lineNames)
                .text((d: any) => d.name)
                .attr("x", 0)
                .attr("y", (d: any, i: number) => 40 + i * 50)
                .attr("class", "lineLabel")
                .style("fill", (d: any) => d.color);

            let lineRects = this.graphArea.selectAll("g")
                .data(data);

            lineRects.enter()
                .append("g")
                .merge(lineRects)
                .attr("id", (d: any) => d.name)
                .style("width", this.width)
                .attr("transform",
                    (d: any, i: number) => "translate(60, " + Number(25 + i * 50) + ")")
                .call((selection: any) => {
                    let rects = selection.selectAll("rect")
                        .data((d: any) => {
                            return d.dataPoints;
                        });

                    rects.enter().append("rect")
                        .merge(rects)
                        .attr("x", (d: any) => d.pos)
                        .attr("y", 0)
                        .attr("height", 15)
                        .attr("width", 15)
                        .style("fill", (d: any) => d.color);

                    rects.exit()
                        .remove();
                });

            lineRects.exit().remove();

            lineNames.exit().remove();
        }
    }
}


/*
This works, but for individual rectangles
    let lineNames = this.graphArea.selectAll('text')
                .data(data)
                .join("text")
                .text((d: any) => d.name)
                .attr("x", 0)
                .attr("y", (d: any, i: number) => 40 + i * 50)
                .attr("class", "lineLabel");

            let lineRects = this.graphArea.selectAll("rect")
                .data(data)
                .join("rect")
                .attr("x", (d: any)=>60+d.pos)
                .attr("y", (d: any, i: number)=>25+i*50)
                .attr("height", 15)
                .attr("width", 15)
                .style("fill", (d: any)=> d.color);

 */

/* this worked, but the rectangles for same name values overlayed
            const lines = this.d3graph
                .selectAll('.drop-line')
                .data(data);


            let lineContainers = lines.enter()
                // @ts-ignore
                .merge(lines)
                .append("g")
                .attr("class", "drop-line");

            lineContainers.append("text")
                .attr("x", 0)
                .attr("y", (d: any, i:number)=>40+i*50)
                .text((d: any)=>d.name);


            lineContainers.append("rect")
                .attr("x", 60)
                .attr("y", (d: any, i: number)=>25+i*50)
                .attr("height", 15)
                .attr("width", (d: any)=>d.length)
                .style("fill", (d: any)=> d.color);

            lines.exit().remove();

             */
