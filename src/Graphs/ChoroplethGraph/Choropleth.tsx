import React from "react";
import {ChoroplethGraph} from "./ChoroplethGraph";
import styles from "./Choropleth.module.css";

export class Choropleth extends React.Component <any, any> {

    private graphRootNode!: HTMLDivElement;
    private chart: ChoroplethGraph = new ChoroplethGraph();

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
            <div className={styles.map} ref={this.setRoot.bind(this)}/>
        </div>);
    }
}
