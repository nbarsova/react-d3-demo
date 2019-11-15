import React from "react";
import {BaseD3Graph} from "./BaseD3Graph";

export class BaseGraph extends React.Component <any, any> {

    private graphRootNode!: HTMLDivElement;
    private chart: BaseD3Graph = new BaseD3Graph();

    private setRoot(componentNode: HTMLDivElement) {
        this.graphRootNode = componentNode;
    }

    public componentDidMount(): void {
        if (this.props.chart) {
        }
        this.chart.create(this.graphRootNode);
    }

    public render = () => {
        return (<div>
            <div ref={this.setRoot.bind(this)}/>
        </div>);
    }
}
