import axios from "axios";
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
    zurichhorn: "47.35362463952061,8.551955849265793",
    athensGreece: "37.973105059118026,23.72582305173767",
    athensOhio: "39.329863826607664,-82.10246829563754",
    copenhagen: "55.67870988271423, 12.610265007027891",
    venice: "45.44405182957811, 12.32870978378545",
    vienna: "48.18954134938377, 16.311249651956423",
    london: "51.5006861749297, -0.14102742773986063",
    madrid: "40.420349029377064, -3.688900929040697",
    paris: "48.86002116556811, 2.3514248408606786",
    zurich: "47.36005276342892,8.550020046147731",
    sancang: "-7.713815657433827, 107.86175506687518",
    tamdjert: "25.616563438983285, 7.318294740071687",
    nairobi: "-1.3058009788013505, 36.801634144402776",
    fairbanks: "64.83681706159734, -147.69827979159103",
  };
  const placeKey =
    Object.keys(zipcodeObject)[
      Math.round(Math.random() * Object.keys(zipcodeObject).length - 1)
    ];
  console.log("place key: ", placeKey);
  const options = {
    method: "GET",
    url: `http://api.weatherapi.com/v1/forecast.json?key=${
      import.meta.env.VITE_WEATHER_API_KEY
    }&q=${zipcodeObject[placeKey]}&aqi=yes&days=1&hour=1`,
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
