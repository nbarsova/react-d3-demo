import React, {Component} from "react";
import BarChart from "./BarChart";
import styles from "./BarChart.module.css"

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
            <div className={styles.graphContainer}
                ref={this.setRoot.bind(this)}/>
            <div className={styles.yAxisCaption}><p>Gross Domestic Product, $</p></div>
            <div className={styles.graphTitle}><p>United Stated GDP</p></div>
        </div>);
    }
}
