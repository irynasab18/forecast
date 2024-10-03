import { View, Model, Controller } from './mvc.js';

export default class WeatherWidget {
    constructor() {
        this.mainContainer = null;
        this.getWeather();
    }

    getWeather() {
        this.mainContainer = document.body;

        const view = new View(this.mainContainer);
        const model = new Model(view);
        const controller = new Controller(this.mainContainer, model);
    }
}