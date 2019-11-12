import * as React from "react";
import ScatterplotGraph from "./ScatterplotGraph";
import styles from "./Scatterplot.module.css";

interface IPlotState {
    toolTipLeft: number,
    toolTipTop: number,
    toolTipStyle: string,
    toolTipContent: string
}

export default class Scatterplot extends React.Component <any, IPlotState> {
    private graphRootNode!: HTMLDivElement;
    private graph: ScatterplotGraph = new ScatterplotGraph();

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

    private onMouseOver(mouseX: number, mouseY: number, tooltip: any) {

        let content = tooltip.Name + ", place: " + tooltip.Place;
        if (tooltip.Doping) {
            content += ", " + tooltip.Doping;
        }
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

    public componentDidMount(): void {
        this.graph.create(this.graphRootNode,
            this.onMouseOver.bind(this),
            this.onMouseOut.bind(this));
    }

    public render = () => {
        return (<div>
            <div ref={this.setRoot.bind(this)}
                 className={styles.scatterplotGraph}
            />
            <div className={styles.graphTitle}><p>Doping in Professional Bicycle Racing</p></div>
            <div className={this.state.toolTipStyle}
                 style={{
                     left: this.state.toolTipLeft,
                     top: this.state.toolTipTop
                 }}>{this.state.toolTipContent}</div>
            <div className={styles.yAxisCaption}><p>Time, min</p></div>
            <div className={styles.legend}>

                <p className={styles.legendCaption}>Legend</p>
                <div className={styles.legendStr}>
                    <div className={styles.dopingCircle}/>
                    <p>riders with doping allegations</p></div>
                <div className={styles.legendStr}>
                    <div className={styles.noDopingCircle}/>
                    <p>no doping allegations</p></div>
            </div>
        </div>);
    }
}
