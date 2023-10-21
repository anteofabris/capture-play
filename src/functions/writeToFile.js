import fs from "fs";
import { testWeatherData } from "../../testWeatherData";
// import { logger } from "./logger";

export const writeToFile = async (randomIndex, data) => {
  var path = `../written_files/${testWeatherData[randomIndex].location.name}_${testWeatherData[randomIndex].location.region}.txt`;
  fs.writeFile(path, "Hey there!", function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  return;
};
