/**
 * This component displays the map visualization of covid-19 confirmed cases severity.
 * Used third party componenet called React-Simple-Maps which takes geographical json input for drawing contour of locations.
 * Used another component called scaleQuantile for color scale, represents severity.
 */
import React, { memo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

const MapChart = (props) => {

    // Constructs color scale for confirmed cases severity display.
    const autoColorScale = scaleQuantile()
    .domain(props.data.map(d => d.confirmed_case))
    .range([
      "#ffedea",
      "#ffcec5",
      "#ffad9f",
      "#ff8a75",
      "#ff5533",
      "#e2492d",
      "#be3d26",
      "#9a311f",
      "#782618"
    ]);

    // Customize color scale
    const singleDayColorScale = scaleQuantile()
        .domain([0, 50000, 100000, 150000, 200000, 286183])
        .range([
        "#ffad9f",
        "#ff8a75",
        "#ff846e",
        "#f06c54",
        "#e34f32",
        "#db472a",
        "#ff5533",
        "#e2492d",
        "#be3d26",
        "#9a311f",
        "#782618",
        "#611c10",
        "#3d0d04",
        ]);

    // Customize color scale
    const rangeDayColorScale = scaleQuantile()
        .domain([0, 50000, 100000, 150000, 200000, 286183])
        .range([
        "#ffad9f",
        "#ff8a75",
        "#ff846e",
        "#f06c54",
        "#e34f32",
        "#db472a",
        "#ff5533",
        "#e2492d",
        "#be3d26",
        "#9a311f",
        "#782618",
        "#611c10",
        "#3d0d04",
        ]);

    // Return geo.fips to parent component through props, and handle onclick event from map.
    return (
        <ComposableMap projection="geoAlbersUsa" projectionConfig={{scale:850}} data-tip="">
            <Geographies geography={geoUrl}>
                {({ geographies }) =>
                geographies.map(geo => {
                    const cur = props.data.find(s => parseInt(s.fips) === parseInt(geo.id));
                    return (
                    <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={cur ? autoColorScale(cur.confirmed_case) : "#8a8584"}
                        onMouseEnter={() => {
                            const { name } = geo.properties;
                            const fips = geo.id;
                            props.setTooltipContent(`${name} County | fips: ${fips}`);
                        }}
                        onMouseLeave={() => {
                            props.setTooltipContent("");
                        }}
                        onClick={() => {
                            const fips = geo.id;
                            props.handleMapClick(fips);
                        }}
                        style={{
                            hover: {
                              fill: "#FF0",
                              outline: "none"
                            },
                            pressed: {
                              fill: "#FF0",
                              outline: "none"
                            }
                        }}
                    />
                    );
                })
                }
            </Geographies>
        </ComposableMap>
    );
};

export default memo(MapChart);
