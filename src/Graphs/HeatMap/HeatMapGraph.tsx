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
    private legendNode!: HTMLDivElement;
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

    private setLegendRoot(legendNode: HTMLDivElement) {
        this.legendNode = legendNode;
    }

    public componentDidMount(): void {
        this.chart.create(this.graphRootNode,
            this.onMouseOver.bind(this),
            this.onMouseOut.bind(this),
            this.legendNode);
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
            <div className={styles.legend}
                 ref={this.setLegendRoot.bind(this)}/>

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
