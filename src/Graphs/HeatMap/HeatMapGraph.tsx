import React, {Component} from "react";
import HeatMap from "./HeatMap";
import styles from "./HeatMap.module.css";

interface IPlotState {
    toolTipLeft: number,
    toolTipTop: number,
    toolTipStyle: string,
    toolTipContent: string
}

export class HeatMapGraph extends React.Component <any, IPlotState> {

    private graphRootNode!: HTMLDivElement;
    private chart: HeatMap = new HeatMap();

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
        this.chart.create(this.graphRootNode,
            this.onMouseOver.bind(this),
            this.onMouseOut.bind(this));
    }

    public render = () => {
        return (<div>
            <div className={styles.graphContainer}
                 ref={this.setRoot.bind(this)}/>
            <div className={this.state.toolTipStyle}
                 style={{
                     left: this.state.toolTipLeft,
                     top: this.state.toolTipTop
                 }}>{this.state.toolTipContent}</div>
        </div>);
    }

    private onMouseOver(mouseX: number, mouseY: number, tooltip: any) {

        let content = tooltip.year+ " - " + tooltip.month+", variance: "+tooltip.variance;

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
