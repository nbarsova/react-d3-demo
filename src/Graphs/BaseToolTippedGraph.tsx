import React, {Component} from "react";
import styles from "./HeatMap.module.css";
import {BaseGraph} from "./BaseGraph";

interface IPlotState {
    toolTipLeft: number,
    toolTipTop: number,
    toolTipStyle: string,
    toolTipContent: string
}

export class BaseToolTippedGraph extends React.Component <any, IPlotState> {

    private graphRootNode!: HTMLDivElement;

    constructor(props: any) {
        super(props);
        this.state = {
            toolTipLeft: 0,
            toolTipTop: 0,
            toolTipStyle: styles.tooltipHidden,
            toolTipContent: ""
        }
    }

    private setRoot(componentNode: HTMLDivElement) {
        this.graphRootNode = componentNode;
    }

    public componentDidMount(): void {
       /*  this.chart.create(this.graphRootNode,
            this.onMouseOver.bind(this),
            this.onMouseOut.bind(this)); */
    }

    public render = () => {
        return (<div>
            <BaseGraph />
            <div className={this.state.toolTipStyle}
                 style={{
                     left: this.state.toolTipLeft,
                     top: this.state.toolTipTop
                 }}>{this.state.toolTipContent}</div>
        </div>);
    }

    private onMouseOver(mouseX: number, mouseY: number, content: string) {

        this.setState({
            toolTipLeft: mouseX,
            toolTipTop: mouseY,
            toolTipStyle: styles.toolTipShown,
            toolTipContent: content
        });
    }

    private onMouseOut() {
        this.setState({
            toolTipStyle: styles.tooltipHidden
        })
    }
}
