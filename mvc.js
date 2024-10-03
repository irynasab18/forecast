export class View {
    constructor(mainContainer) {
        this.mainContainer = mainContainer;
        this.city = 'Минске';
        this.cross = './arrow-up.png';
        this.arrow = './arrow-down.png';
    }

    drawFullWidget(temp = 10, windSpeed = 5, description = 'Бе', icon = './clouds.png') {
        if (this.widgetDiv) {
            this.widgetDiv.innerHTML = '';
        } else {
            this.widgetDiv = document.createElement('div');
            this.widgetDiv.classList.add('main-div');
            this.mainContainer.append(this.widgetDiv);
        }

        this.widgetDiv.innerHTML = `<div class="weather-widget">
        <div class="minimize-btn">
            <img src="${this.cross}" alt="Свернуть" class="cross-icon"></div>
        <div class="weather-content">
            <p>Сейчас в ${this.city}: <span class="temperature">${temp}°C</span></p>
            <div class="weather-icon-description">
                <img src="./clouds.png" alt="Иконка погоды" class="weather-icon">
                <span class="description">'Бе'</span>
            </div>
            <p>Ветер: <span class="wind-speed">${windSpeed} м/c</span></p>
        </div>
        <div class="three-days-link">
            <span href=# class="more-data">Погода на 3 дня</div>
        <div class="weather-content">
    </div>`
    }

    drawSmallWidget() {
        if (this.widgetDiv) {
            this.widgetDiv.innerHTML = '';
        }
        this.widgetDiv.innerHTML = '';
        this.widgetContainer = `<div class="weather-widget">
        <div class="maximize-btn">
        <img src="${this.arrow}" alt="Развернуть" class="arrow-icon"></div>
        <div class="weather-content">
            <p>Сейчас в ${this.city}: <span class="temperature">${this.temp}°C</span></p>
        </div>
    </div>`
        this.widgetDiv = document.createElement('div');
        this.widgetDiv.classList.add('main-div');
        this.widgetDiv.innerHTML = this.widgetContainer;
        this.mainContainer.append(this.widgetDiv);
    }

    draw3DaysWidget(weatherForecast) {
        const container = this.mainContainer.querySelector('.weather-widget');
        const widgetDiv = document.createElement('div');
        widgetDiv.classList.add('main-div');
        widgetDiv.innerHTML = `<div class="three-days">
        <div class="day">
        <p><span class="date">${weatherForecast[0].date}</span></p>
        <p><span class="date">${weatherForecast[0].temp}°C</span></p>
        <div class="weather-icon-description">
                <img src="${weatherForecast[0].icon}" alt="Иконка погоды" class="weather-icon">
                <span class="description">${weatherForecast[0].description}</span>
            </div>
        </div>
        <div class="day">
        <p><span class="date">${weatherForecast[1].date}</span></p>
        <p><span class="date">${weatherForecast[1].temp}°C</span></p>
        <div class="weather-icon-description">
                <img src="${weatherForecast[1].icon}" alt="Иконка погоды" class="weather-icon">
                <span class="description">${weatherForecast[1].description}</span>
            </div>
        </div>
        <div class="day">
        <p><span class="date">${weatherForecast[2].date}</span></p>
        <p><span class="date">${weatherForecast[2].temp}°C</span></p>
        <div class="weather-icon-description">
                <img src="${weatherForecast[2].icon}" alt="Иконка погоды" class="weather-icon">
                <span class="description">${weatherForecast[2].description}</span>
            </div>
        </div>
        <div class="hide-link">
            <span href=# class="more-data">Скрыть</div>
        <div class="weather-content">
        </div>`

        container.append(widgetDiv);
    }
}

export class Model {
    constructor(view) {
        this.view = view;
        this.lat = '53.90273553549529';
        this.lon = '27.55490588794736';
        this.location = '53.90273553549529,27.55490588794736'
        //this.key = 'VlBtOfHlNSo7WWjqJlVWk7g6WlyTryn7';
        this.description = null;
        this.icon = null;
    }

    async getCurrentWeather() {
        const url = `https://api.tomorrow.io/v4/weather/forecast?location=${this.location}&apikey=${this.key}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            const jsonResp = await response.json();
            const currWeather = jsonResp.timelines.daily[0]

            this.temp = currWeather.values.temperatureApparentAvg;
            this.windSpeed = currWeather.values.windSpeedAvg;

            [this.description, this.icon] = this.setDescription(currWeather);
        } catch (error) {
            console.error('Ошибка получения данных:', error);
        }
    }

    async get3DaysWeather() {
        const url = `https://api.tomorrow.io/v4/weather/forecast?location=${this.location}&apikey=${this.key}`;
        try {
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error(`${response.status}`);
            }
            response = await response.json();
            const weatherForecast = [{
                date: response.timelines.daily[1].time.split('T')[0],
                temp: response.timelines.daily[1].values.temperatureAvg,
                description: this.setDescription(response.timelines.daily[1])[0],
                icon: this.setDescription(response.timelines.daily[1])[1]
            },
            {
                date: response.timelines.daily[2].time.split('T')[0],
                temp: response.timelines.daily[2].values.temperatureAvg,
                description: this.setDescription(response.timelines.daily[2])[0],
                icon: this.setDescription(response.timelines.daily[2])[1]
            },
            {
                date: response.timelines.daily[3].time.split('T')[0],
                temp: response.timelines.daily[3].values.temperatureAvg,
                description: this.setDescription(response.timelines.daily[3])[0],
                icon: this.setDescription(response.timelines.daily[3])[1]
            }];
            return weatherForecast;

        } catch (error) {
            console.error('Ошибка получения данных:', error);
        }
    }

    async drawInitWidget() {
        await this.getCurrentWeather();
        this.view.drawFullWidget(this.temp, this.windSpeed, this.description, this.icon);
    }

    drawSmallWidget() {
        this.view.drawSmallWidget();
    }

    async draw3DaysWidget() {
        const values = await get3DaysWeather();
        this.view.draw3DaysWidget(values);
    }

    setDescription(weatherData) {
        if (weatherData.values.cloudCoverAvg > 90 && weatherData.values.rainIntensityMin > 1) {
            this.description = 'Дождь';
            this.icon = './rain.png';
            return ['Дождь', './rain.png'];
        }

        if (weatherData.values.cloudCoverAvg >= 20 && weatherData.values.rainIntensityMin <= 1) {
            this.description = 'Облачно';
            this.icon = './clouds.png';
            return ['Облачно', './clouds.png'];
        }

        if (weatherData.values.cloudCoverAvg < 20 && weatherData.values.rainIntensityMin <= 1) {
            this.description = 'Ясно';
            this.icon = './sun.png';
            return ['Ясно', './sun.png'];
        }
    }
}

export class Controller {
    constructor(mainContainer, model) {
        this.mainContainer = mainContainer;
        this.model = model;

        this.drawInitWidget();
    }

    async drawInitWidget(event = null) {
        if (event) {
            event.preventDefault();
        }

        await this.model.drawInitWidget();
        this.addListeners();
    }

    addListeners() {
        const minimizeBtn = this.mainContainer.querySelector('.minimize-btn');
        const show3DaysBtn = this.mainContainer.querySelector('.three-days-link');

        console.log(minimizeBtn)
        console.log(show3DaysBtn)

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', event => this.drawSmallWidget(event));
        }

        if (show3DaysBtn) {
            show3DaysBtn.addEventListener('click', (event) => this.draw3DaysWidget(event));
        }

    }

    drawSmallWidget(event) {
        if (event) {
            event.preventDefault();
        }
        console.log(event)
        this.model.drawSmallWidget();

        const maximizeBtn = this.mainContainer.querySelector('.maximize-btn');
        console.log(maximizeBtn)
        maximizeBtn.addEventListener('click', (event) => this.drawInitWidget(event));
    }

    draw3DaysWidget(event) {
        if (event) {
            event.preventDefault();
        }
        console.log(event)
        this.model.draw3DaysWidget();

        const hideThreeDays = this.mainContainer.querySelector('.hide-link');
        console.log(hideThreeDays)
        hideThreeDays.addEventListener('click', (event) => this.drawFullWidget(event));
    }
}