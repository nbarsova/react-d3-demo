import React, {Component} from 'react';
import ZoomingGraph from "./ZoomingGraph";

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
                 style={{
                     position: 'absolute',
                     width: "100%",
                     height: "90%",
                     left: 0
                 }}
            />
            <div onClick={()=> {
                this.d3Graph.externalZoomIn(2);
            }} style={{position: "absolute",
                top: 0, right: 40,
                backgroundColor: "gray",
                fontWeight: 40, width: 40, cursor: "pointer"}}>+</div>
            <div onClick={()=> {
                this.d3Graph.externalZoomIn(1/2);
            }} style={{position: "absolute",
                top: 0, right: 10,
                backgroundColor: "gray",
                fontWeight: 40, width: 40, cursor: "pointer"}}>-</div>
        </div>);
    }
}