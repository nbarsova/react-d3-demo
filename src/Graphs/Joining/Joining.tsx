import React, {Component} from 'react';
import JoiningGraph from "./JoiningGraph";
import styles from "./Joining.module.css";

export class Joining extends Component <any, any> {

    private graphRootNode!: HTMLDivElement;
    private d3Graph: JoiningGraph = new JoiningGraph();
    private lineRecreationInterval: any;

    constructor (props: any) {
        super(props);
        this.state={
            day: new Date(2019, 0, 1)
        }
    }

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
                    name: "User " + i,
                    dataPoints: dataPoints,

                };
                data.push(newDataObj);
            }

            data.splice(Math.floor(Math.random()*data.length), 1);

            this.d3Graph.changeData(data);
            let newDate = this.state.day;
            newDate.setDate(this.state.day.getDate()+1);
            this.setState({
                day: newDate
            })
        }, 2000);
    }

    public componentWillUnmount(): void {
        clearInterval(this.lineRecreationInterval)
    }


    public render = () => {
        return (<div>
            <div id="graphContainer"
                 ref={this.setRoot.bind(this)}
                 className={styles.graph}
            />
            <div className={styles.graphTitle}>Activity for {this.state.day.toDateString()}</div>
        </div>);
    }
}
