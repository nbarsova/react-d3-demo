import React from 'react';
// @ts-ignore
import styles from './App.module.css';
import {Zooming} from "./Graphs/Zooming/Zooming";
import {BarChartGraph} from "./Graphs/BarChart/BarChartGraph";
import Scatterplot from "./Graphs/Scatterplot/Scatterplot";
import {Joining} from "./Graphs/Joining/Joining";
import {HeatMapGraph} from "./Graphs/HeatMap/HeatMapGraph";
import {Choropleth} from "./Graphs/ChoroplethGraph/Choropleth";

interface IAppState {
    selectedComponentIndex: number;
}

class App extends React.Component <any, IAppState> {
    private graphs: any = [<BarChartGraph componentName="Bar chart"/>,
        <Scatterplot componentName="Scatterplot"/>,
        <Zooming componentName="Zooming graph"/>,
        <Joining componentName="Joining data"/>,
    <HeatMapGraph componentName="Heat Map"/>,
    <Choropleth componentName="Chotopleth graph"/>];

    constructor(props: any) {
        super(props);
        this.state = {
            selectedComponentIndex: 0
        }
    }


    private renderButton = (item: any, index: number) => {

        return (<div key={index} className={index === this.state.selectedComponentIndex ? styles.selectedButton : styles.button} onClick={() => {
            this.setState({selectedComponentIndex: index});
        }}>
            {item.props.componentName}
        </div>)
    };

    private renderGraph = (item: React.Component, index: number) => {
        return (<div key={"component" + index}>
            {index === this.state.selectedComponentIndex ? item : null}
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
