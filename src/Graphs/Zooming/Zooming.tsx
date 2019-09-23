import React, {Component} from 'react';
import ZoomingGraph from "./ZoomingGraph";
import styles from "./Zooming.module.css";

export class Zooming extends Component <any, any> {

    private graphRootNode!: HTMLDivElement;
    private d3Graph: ZoomingGraph = new ZoomingGraph();

    private setRoot(componentNode: HTMLDivElement) {
        this.graphRootNode = componentNode;
    }

    public componentDidMount(): void {
        this.d3Graph.create(this.graphRootNode);
    }


    public render = () => {
        return (<div>
            <div id="graphContainer"
                 ref={this.setRoot.bind(this)}
                 className={styles.graph}
            />
            <div className={styles.buttons}>
                <div onClick={() => {
                    this.d3Graph.externalZoom(2);
                }} className={styles.zoomButton}>+
                </div>
                <div onClick={() => {
                    this.d3Graph.externalZoom(1 / 2);
                }} className={styles.zoomButton}>-
                </div>
            </div>
        </div>);
    }
}
