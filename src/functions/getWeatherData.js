import axios  from "axios";
const getWeatherData = async () => {
  const zipcodeObject = {
    greenland: "73.68733678413628,-44.23558510441544",
    calais: "50.974815073668026,1.8301347813956306",
    buenosAires: "-34.642396705532754,-58.415858874409174",
    honolulu: "21.45261234497537,-158.0207256321105",
    melbourne: "-37.823857668463525,144.93884988216476",
    flatiron: "40.741141726512836,-73.98947329056755",
    romanshorn: "47.566997219075674,9.3618152746456",
    tucson: "32.24521248020302,-110.96200948455281",
    zurich: "47.36005276342892,8.550020046147731",
    zurichhorn: "47.35362463952061,8.551955849265793",
    athensGreece: "37.973105059118026,23.72582305173767",
    athensOhio: "39.329863826607664,-82.10246829563754",
    copenhagen: "55.67870988271423, 12.610265007027891",
  };

  const options = {
    method: "GET",
    url: `http://api.weatherapi.com/v1/forecast.json?key=${
      import.meta.env.VITE_WEATHER_API_KEY
    }&q=${zipcodeObject.athensOhio}&aqi=yes&days=1&hour=1`,
  };
  let res;
  try {
    res = await axios.request(options);
    console.log("got data: ", JSON.stringify(res.data));
  } catch (err) {
    console.log("err: ", err);
  }
  // axios
  //   .request(options)
  //   .then((res) => {
  //     console.log("res", JSON.stringify(res.data));
  //   })
  //   .catch((err) => {
  //     console.log("err:", err);
  //   });
  return res.data;
};

export { getWeatherData };
