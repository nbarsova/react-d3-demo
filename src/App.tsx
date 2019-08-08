import React from 'react';
import styles from './App.module.css';
import {Zooming} from "./Graphs/Zooming";
import {BarChartGraph} from "./Graphs/BarChartGraph";
import Scatterplot from "./Graphs/Scatterplot";

interface IAppState {
    selectedComponentIndex: number;
}

class App extends React.Component <any, IAppState> {
    private graphs: any = [<BarChartGraph componentName="Bar chart"/>,
         <Zooming componentName="Zooming graph"/>,
    <Scatterplot componentName="Scatterplot"/>];

    constructor(props: any) {
        super(props);
        this.state={
            selectedComponentIndex: 0
        }
    }


    private renderButton = (item: any, index: number) => {

        return (<div key={index} className={styles.button} onClick={() => {
            console.log("Clicked on "+index);
            this.setState({selectedComponentIndex: index});
        }}>
           {item.props.componentName}
        </div>)
    };

    private renderGraph = (item: React.Component, index: number) => {
        return (<div key={"component"+index}>
            {index === this.state.selectedComponentIndex ? item: null}
        </div>)
    }

    public render() {
        return (
            <div className={styles.app}>
                <div id="buttons" className={styles.navigation}>
                    {this.graphs.map(this.renderButton.bind(this))}
                </div>
                <div id="graphs">
                    {this.graphs.map(this.renderGraph.bind(this))}
                </div>
            </div>
        );
    }
}

export default App;
