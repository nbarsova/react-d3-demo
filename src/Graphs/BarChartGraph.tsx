import React, {Component} from "react";
import BarChart from "./BarChart";

export class BarChartGraph extends React.Component <any, any> {

    private graphRootNode!: HTMLDivElement;
    private chart: BarChart = new BarChart();

    private setRoot(componentNode: HTMLDivElement) {
        this.graphRootNode = componentNode;
    }

    public componentDidMount(): void {
        this.chart.create(this.graphRootNode);
    }

    public render = () => {
        return (<div>
            <div id="graphContainer"
        ref={this.setRoot.bind(this)}
        style={{
            position: 'absolute',
                width: "100%",
                height: "90%",
                left: 0
        }}
        />
        </div>);
    }
}