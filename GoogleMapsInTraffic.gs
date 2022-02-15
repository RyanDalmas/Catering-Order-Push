function GOOGLEMAPS_DURATION_IN_TRAFFIC (origin, destination, mode = "driving", departDate) {
  const { routes: [data] = [] } = Maps.newDirectionFinder().setDepart(new Date("7/30/21"))
    .setOrigin(origin)
    .setDestination(destination)
    .setMode(mode)
    .getDirections();

  if (!data) {
    throw new Error("No route found!");
  }
  const { legs: [{ duration_in_traffic: { text: time } } = {}] = [] } = data;

  Logger.log(data);
  return parseInt(time.toString().substring(0,time.toString().indexOf(" ")));
};