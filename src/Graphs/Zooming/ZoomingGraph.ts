import * as d3 from 'd3';
import {ZoomBehavior} from "d3";

export default class ZoomingGraph {

    private rootNode: HTMLDivElement | undefined;
    private d3graph: d3.Selection <any, any, any, any>|undefined;
    private data = [{x: 1, y: 12},
        {x: 2, y: 31},
        {x: 3, y: 22},
        {x: 4, y: 17},
        {x: 5, y: 25},
        {x: 6, y: 18},
        {x: 7, y: 29},
        {x: 8, y: 14},
        {x: 9, y: 9}];

    private height: number = 0;
    private width: number = 0;

    private lineFunction = d3.line<{x: number, y: number}>()
        .defined((d, index, lineData) => lineData[index] !== null)
        .x((d: any) => (this.xLineFunction(d.x)))
        .y((d: any) => (this.yLineFunction(d.y)));

    private xLineFunction: any;
    private yLineFunction: any;
    private xAxis: any;
    private zoomBehavior: ZoomBehavior<Element, any> | undefined;
    private line: any;
    private xAxisG: any;
    private xDomain: number[]=[0,1];
    private xRange: number[]=[0, 100];
    private invisibleGraph: any;

    create(rootNode: HTMLDivElement) {
        this.rootNode = rootNode;
        this.height = rootNode.clientHeight-80;
        this.width = rootNode.clientWidth-100;

        const d3RootSelection = d3.select(this.rootNode);
        d3RootSelection.selectAll("*").remove();

       let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", this.width)
            .attr("height", this.height);

        this.d3graph = svg.append("g");

        let yMax = d3.max(this.data, (d: {x: number, y: number})=> d.y);

        if (!yMax) {
            yMax = 0;
        }

        let yDomain = [0, yMax+2];
        let yRange = [this.height-20, 10];
        this.yLineFunction = d3.scaleLinear().domain(yDomain).range(yRange);

        this.xDomain = [this.data[0].x, this.data[this.data.length-1].x];
        this.xRange = [0, this.width];
        this.xLineFunction = d3.scaleLinear().domain(this.xDomain).range(this.xRange);

        this.xAxis = d3.axisBottom(this.xLineFunction);
        this.xAxisG = this.d3graph.append("g")
            .attr("transform", "translate(0,"+(this.height-20)+")")
            .call(this.xAxis);


        this.line = this.d3graph.append("svg:path")
            .data([this.data])
            .attr("d", this.lineFunction)
            .style("stroke", "#999999")
            .style("stroke-width", "0.7px")
            .style("fill", "transparent");

        this.zoomBehavior = d3.zoom();

        this.invisibleGraph = svg.append("rect")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("fill", "none")
            .style("pointer-events", "all");

           this.invisibleGraph.call(this.zoomBehavior
                .scaleExtent([1, 4])
               .translateExtent([[0, Number.NEGATIVE_INFINITY],
                   [this.width, Number.POSITIVE_INFINITY]])
                .on("zoom", this.zoomed));
    }

    private zoomed = () => {
        if (this.d3graph) {
            console.log("zoomed", d3.event.transform, d3.zoomTransform(this.d3graph.node()));

            const oldGraphSelection = this.d3graph.selectAll('*');
                oldGraphSelection.style("visibility", "hidden");

            this.xLineFunction = d3.event.transform.rescaleX(
                d3.scaleLinear()
                    .domain(this.xDomain)
                    .range(this.xRange));

            this.line = this.d3graph.append("svg:path")
                .data([this.data])
                .attr("d", this.lineFunction)
                .attr("id", "current")
                .style("stroke", "#999999")
                .style("stroke-width", "0.7px")
                .style("fill", "transparent");

            this.xAxis = d3.axisBottom(this.xLineFunction);
            this.xAxisG = this.d3graph.append("g")
                .attr("transform", "translate(0,"+(this.height-20)+")")
                .call(this.xAxis);

            this.d3graph.selectAll("old").remove()

        }
    }

    public externalZoom (zoomFactor: number) {

        if (this.d3graph) {
            this.zoomBehavior && this.zoomBehavior.scaleBy(this.invisibleGraph, zoomFactor);
        }
    }

}
