import React, { Component, Fragment } from 'react';
import Dropdown from '../Dropdown';
import Button from '../Button';
import Slider from '../Slider';
import Tooltip from '../Tooltip';
import { getRandomColor } from '../../utils';
import Tabs from '../Tabs';
import LazyDog from '../LazyDog';
import bodies from '../../data/masses';
export default class extends Component {
    constructor(props) {
        super(props);
        this.modifyProperty = payload => {
            this.setState(prevState => (Object.assign({}, prevState, { [payload.key]: payload.value })));
        };
        this.insertMassTemplate = payload => this.setState(Object.assign({}, this.state, { m: payload.m, radius: payload.radius, texture: payload.texture, type: payload.type }));
        this.state = {
            m: null,
            radius: null,
            texture: null,
            type: null,
            bodiesWithType: [],
            bodyTypes: []
        };
    }
    componentDidMount() {
        this.setState(Object.assign({}, this.state, { bodiesWithType: bodies.filter(entry => entry.bodyType) }), () => {
            let bodyTypes = [];
            this.state.bodiesWithType.forEach(entry => {
                if (bodyTypes.indexOf(entry.bodyType) === -1)
                    bodyTypes = [...bodyTypes, entry.bodyType];
            });
            const [selectedMass] = this.state.bodiesWithType;
            this.setState(Object.assign({}, this.state, { m: selectedMass.m, radius: selectedMass.radius, texture: selectedMass.name, type: selectedMass.type, bodyTypes }));
        });
        this.props.modifyScenarioProperty({ key: 'isMassBeingAdded', value: true });
    }
    componentWillUnmount() {
        this.props.modifyScenarioProperty({
            key: 'isMassBeingAdded',
            value: false
        });
    }
    render() {
        return (React.createElement(Fragment, null,
            React.createElement("h2", null, "Add Mass"),
            React.createElement("label", { className: "top" },
                "Primary",
                React.createElement(Tooltip, { position: "left", content: "The celestial object you want your mass to orbit." })),
            React.createElement(Dropdown, { selectedOption: this.props.primary, dropdownWrapperCssClassName: "tabs-dropdown-wrapper", selectedOptionCssClassName: "selected-option", optionsWrapperCssClass: "options" }, this.props.masses.map(mass => (React.createElement("div", { "data-name": mass.name, key: mass.name, onClick: () => this.props.modifyScenarioProperty({
                    key: 'freeOrigo',
                    value: { x: 0, y: 0, z: mass.radius * 40 }
                }, { key: 'primary', value: mass.name }, { key: 'rotatingReferenceFrame', value: mass.name }, { key: 'cameraPosition', value: 'Free' }, { key: 'cameraFocus', value: 'Origo' }) }, mass.name)))),
            React.createElement("label", { className: "top" },
                "Semi-major Axis",
                ' ',
                React.createElement(Tooltip, { position: "left", content: "Either of two points on the orbit of a planet or satellite that are nearest to or furthest from the body round which it moves. If apsis one is equal to apsis two you get the special case of a circular orbit." })),
            React.createElement(Slider, { payload: { key: 'a' }, value: this.props.a, callback: this.props.modifyScenarioProperty, max: this.props.maximumDistance, min: 0, shouldUpdateOnMaxMinChange: true, step: this.props.maximumDistance / 200 }),
            React.createElement("label", { className: "top" },
                "Eccentricity",
                ' ',
                React.createElement(Tooltip, { position: "left", content: "The argument of periapsis, w, is one of the orbital elements of an orbiting body. Parametrically, w is the angle from the mass's ascending node to its periapsis, the point in its orbit where the mass is the closest to the body it orbits, measured in the direction of motion." })),
            React.createElement(Slider, { payload: { key: 'e' }, value: this.props.e, callback: this.props.modifyScenarioProperty, max: 1, min: 0, step: 0.001 }),
            React.createElement("label", { className: "top" },
                "Argument of Periapsis",
                ' ',
                React.createElement(Tooltip, { position: "left", content: "The argument of periapsis, w, is one of the orbital elements of an orbiting body. Parametrically, w is the angle from the mass's ascending node to its periapsis, the point in its orbit where the mass is the closest to the body it orbits, measured in the direction of motion." })),
            React.createElement(Slider, { payload: { key: 'w' }, value: this.props.w, callback: this.props.modifyScenarioProperty, max: 360, min: 0, step: 0.1 }),
            React.createElement("label", { className: "top" },
                "Inclination",
                ' ',
                React.createElement(Tooltip, { position: "left", content: "Orbital inclination, i, measures the tilt of an object's orbit around a celestial body. It is expressed as the angle between a reference plane and the orbital plane or axis of direction of the orbiting object." })),
            React.createElement(Slider, { payload: { key: 'i' }, value: this.props.i, callback: this.props.modifyScenarioProperty, max: 360, min: 0, step: 0.1 }),
            React.createElement("label", { className: "top" },
                "Mass Template",
                React.createElement(Tooltip, { position: "left", content: "The mass, radius, texture, type and color of the mass you're adding." })),
            React.createElement(Tabs, { tabsWrapperClassName: "mass-tabs", tabsContentClassName: "mass-content", initTab: 0, noCloseButton: true }, this.state.bodyTypes.map(entry => (React.createElement("div", { "data-label": entry, key: entry }, this.state.bodiesWithType.map(body => {
                if (body.bodyType === entry)
                    return (React.createElement("div", { onClick: () => this.insertMassTemplate({
                            m: body.m,
                            radius: body.radius,
                            texture: body.name,
                            type: body.type
                        }), className: "add-mass-entry-wrapper", style: {
                            border: this.state.texture === body.name
                                ? '1px solid red'
                                : 'none'
                        } },
                        React.createElement(LazyDog, { src: `./images/masses/${body.name}.png`, alt: body.name, caption: body.name, width: 75, height: 50, placeHolderIcon: "fa fa-venus-mars fa-2x" })));
            }))))),
            React.createElement(Button, { callback: () => this.props.addMass({
                    primary: this.props.primary,
                    secondary: {
                        name: `Custom Mass ${Date.now()}`,
                        trailVertices: 3000,
                        m: this.state.m,
                        radius: this.state.radius,
                        texture: this.state.texture,
                        type: this.state.type,
                        color: getRandomColor(),
                        a: this.props.a,
                        e: this.props.e,
                        w: this.props.w,
                        i: this.props.i
                    }
                }), cssClassName: "button top" },
                "Add ",
                this.state.texture)));
    }
}
//# sourceMappingURL=AddMass.js.map