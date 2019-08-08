import * as React from "react";
import ScatterplotGraph from "./ScatterplotGraph";

export default class Scatterplot extends React.Component <any, any> {
    private graphRootNode!: HTMLDivElement;
    private graph: ScatterplotGraph = new ScatterplotGraph();

    private setRoot(componentNode: HTMLDivElement) {
        this.graphRootNode = componentNode;
    }

    public componentDidMount(): void {
        this.graph.create(this.graphRootNode);
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