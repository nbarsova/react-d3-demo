import * as d3 from "d3";
// @ts-ignore
import * as topojson from "topojson-client";

export class ChoroplethGraph {

    private educationDataUrl =
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
    private countyDataUrl =
        "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";

    public create: (rootNode: HTMLDivElement) => void = (rootNode: HTMLDivElement) => {

        let countyDataPromise = d3.json(this.countyDataUrl);
        let educationDataPromise = d3.json(this.educationDataUrl);

        const d3RootSelection = d3.select(rootNode);
        let height = rootNode.clientHeight - 80;
        let width = rootNode.clientWidth - 100;
        d3RootSelection.selectAll("*").remove();

        let svg = d3RootSelection.append("svg")
            .attr("class", "d3")
            .attr("width", width)
            .attr("height", height);

        var path = d3.geoPath();


        var color = d3.scaleThreshold()
            .domain(d3.range(2.6, 75.1, (75.1 - 2.6) / 8))
            // @ts-ignore
            .range(d3.schemeGreens[9]);

        Promise.all([countyDataPromise, educationDataPromise]).then((result: any) => {
            console.log(result);

            let counties = result[0];
            let education = result[1];

            let features = topojson.feature(counties, counties.objects.counties).features;
            console.log(features);
            svg.append("g")
                .attr("class", "counties")
                .selectAll("path")
                .data(features)
                .enter().append("path")
                .attr("class", "county")
                .attr("data-fips", function (d: any) {
                    return d.id
                })
                .attr("data-education", function (d: any) {
                    var result = education.filter(function (obj: any) {
                        return obj.fips == d.id;
                    });
                    if (result[0]) {
                        return result[0].bachelorsOrHigher
                    }
                    //could not find a matching fips id in the data
                    return 0
                })
                .attr("fill", function (d: any) {
                    var result = education.filter(function (obj: any) {
                        return obj.fips == d.id;
                    });
                    if (result[0]) {
                        return color(result[0].bachelorsOrHigher)
                    }
                    // could not find a matching fips id in the data
                    return color(0)
                })
                // @ts-ignore
                .attr("d", path);

            let states = counties.objects.states;

            svg.append("path")
                .datum(topojson.mesh(counties, states, function (a: any, b: any) {
                    return a !== b;
                }))
                .attr("class", "states")
                .attr("fill", "none")
                .attr("stroke", "white")
                .attr("stroke-linejoin", "round")
                .attr("d", path);
        });
    }
}
