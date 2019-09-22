import React, {Component} from 'react';
import JoiningGraph from "./JoiningGraph";

export class Joining extends Component <any, any> {

    private graphRootNode!: HTMLDivElement;
    private d3Graph: JoiningGraph = new JoiningGraph();
    private lineRecreationInterval: any;

    private setRoot(componentNode: HTMLDivElement) {
        this.graphRootNode = componentNode;
    }

    public componentDidMount(): void {
        this.d3Graph.create(this.graphRootNode);
        this.lineRecreationInterval = setInterval(() => {
            let data: any [] = [];
            let colors = ["red",
                "darkred",
                "green",
                "olivegreen",
                "lightblue",
                "magenta",
                "yellow",
                "gray", "lightgray", "black"];

            let amount = Math.random() * 10;

            for (let i = 0; i < amount; i++) {
                let dataPoints = [];
                let color = colors[Math.floor(Math.random() * 9)]

                for (let j = 0; j < Math.random() * 5; j++) {
                    dataPoints.push({pos: Math.random() * this.graphRootNode.clientWidth / 2,
                    color: color});
                }

                let newDataObj = {
                    name: "name" + i,
                    dataPoints: dataPoints,

                };
                data.push(newDataObj);
            }

            data.splice(Math.floor(Math.random()*data.length), 1);

            this.d3Graph.changeData(data);
        }, 2000);
    }

    public componentWillUnmount(): void {
        clearInterval(this.lineRecreationInterval)
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
            <div style={{
                position: 'absolute',
                bottom: 20,
                left: "50vw",
                padding: 5,
                borderRadius: 5,
                backgroundColor: "lightblue",
                cursor: "pointer"
            }}
                 onClick={() => clearInterval(this.lineRecreationInterval)}>stop
            </div>
        </div>);
    }
}
